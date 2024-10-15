import {
  Button,
  Flex,
  Group,
  Input,
  InputLabel,
  Text,
  Title,
} from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { SubsetTable } from "@types";
import { useEffect, useMemo, useRef, useState } from "react";

// Definición de los operadores y sus propiedades.
const operators: {
  [key: string]: { precedence: number; associativity: "left" | "right" };
} = {
  U: { precedence: 1, associativity: "left" }, // Unión
  "∩": { precedence: 2, associativity: "left" }, // Intersección
  "-": { precedence: 2, associativity: "left" }, // Diferencia
  "'": { precedence: 3, associativity: "right" }, // Complemento
};

// Función para convertir una expresión infix a postfix usando el Shunting Yard Algorithm.
const infixToPostfix = (infix: string[]): string[] => {
  const output: string[] = [];
  const stack: string[] = [];

  infix.forEach((token) => {
    if (/[A-Za-z]/.test(token) && !operators[token]) {
      output.push(token);
    } else if (operators[token]) {
      const o1 = token;
      let o2 = stack[stack.length - 1];
      while (
        operators[o2] &&
        ((operators[o1].associativity === "left" &&
          operators[o1].precedence <= operators[o2].precedence) ||
          (operators[o1].associativity === "right" &&
            operators[o1].precedence < operators[o2].precedence))
      ) {
        output.push(stack.pop()!);
        o2 = stack[stack.length - 1];
      }
      stack.push(o1);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack[stack.length - 1] !== "(") {
        output.push(stack.pop()!);
      }
      stack.pop();
    }
  });

  while (stack.length > 0) {
    output.push(stack.pop()!);
  }

  return output;
};

// Función para evaluar una expresión postfix.
const evaluatePostfix = (
  postfix: string[],
  sets: { [key: string]: Set<string> },
  universe: Set<string>
): Set<string> => {
  const stack: Set<string>[] = [];
  postfix.forEach((token) => {
    if (/[A-Za-z]/.test(token) && !operators[token]) {
      // Push the set represented by the token onto the stack.
      stack.push(sets[token]);
    } else if (operators[token]) {
      if (token === "'") {
        // Complement operation.
        const a = stack.pop()!;
        const result = new Set([...universe].filter((x) => !a.has(x)));
        stack.push(result);
      } else {
        // For binary operations (U, ∩, -).
        const b = stack.pop()!;
        const a = stack.pop()!;
        let result: Set<string>;
        switch (token) {
          case "U":
            // Union operation: combines elements from both sets.
            result = new Set([...a, ...b]);
            break;
          case "∩":
            // Intersection operation: includes only elements present in both sets.
            result = new Set([...a].filter((x) => b.has(x)));
            break;
          case "-":
            // Difference operation: includes elements from 'a' that are not in 'b'.
            result = new Set([...a].filter((x) => !b.has(x)));
            break;
          default:
            throw new Error(`Unknown operator: ${token}`);
        }

        stack.push(result);
      }
    }
  });

  return stack.pop()!;
};

export const Calculator = ({
  subsets,
  universe: initialUniverse,
}: {
  subsets: SubsetTable[];
  universe: SubsetTable;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusTrap = useFocusTrap();
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<Set<string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const transformSubsets = (
    subsets: SubsetTable[]
  ): { [key: string]: Set<string> } => {
    const result: { [key: string]: Set<string> } = {};

    subsets.forEach(({ name, elements }) => {
      // Convierte la cadena de elementos en un Set<string>
      const elementSet = new Set(
        elements.split(",").map((element) => element.trim())
      );
      result[name] = elementSet;
    });

    return result;
  };
  useEffect(() => {
    setResult(null);
    setError(null);
    setExpression("");
  }, [subsets, initialUniverse]);
  // Función para convertir la expresión en tokens.
  const tokenize = (input: string): string[] => {
    return input
      .replace(/([A-Za-z])/g, " $1 ")
      .replace(/([U∩\-()'])/g, " $1 ")
      .trim()
      .split(/\s+/);
  };

  // Valida la expresión infix antes de convertirla y evaluarla.
  const validateExpression = (tokens: string[]): boolean => {
    const validTokens = /^[A-Za-zU∩\-()']+$/;
    if (!tokens.join("").match(validTokens)) {
      setError("Caracteres inválidos en la expresión.");
      return false;
    }

    const openParens = tokens.filter((token) => token === "(").length;
    const closeParens = tokens.filter((token) => token === ")").length;
    if (openParens !== closeParens) {
      setError("Paréntesis no coinciden.");
      return false;
    }

    setError(null);
    return true;
  };

  // Maneja el cálculo de la expresión ingresada por el usuario.
  const handleCalculate = () => {
    const tokens = tokenize(expression.toUpperCase());
    if (!validateExpression(tokens)) {
      setResult(null);
      return;
    }

    try {
      const postfix = infixToPostfix(tokens);
      const calculatedResult = evaluatePostfix(postfix, sets, universe);
      setResult(calculatedResult);
    } catch (error) {
      console.error(error);
      setError(
        "Error al calcular la expresión. Por favor, revise la sintaxis."
      );
      setResult(null);
    }
  };
  const moveCursor = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  };
  const addOperator = (operator: string, addSpace: boolean = true) => {
    let newExpression = expression ?? "";
    if (addSpace) {
      newExpression += " ";
    }
    newExpression += operator;
    setExpression(newExpression);
    moveCursor();
  };

  // Define los conjuntos y el universo.
  const sets = useMemo(() => transformSubsets(subsets), [subsets]);
  const universe = useMemo(() => {
    return new Set(
      initialUniverse.elements.split(",").map((element) => element.trim())
    );
  }, [initialUniverse]);

  return (
    <Flex direction="column">
      <div ref={focusTrap}>
        <Input
          ref={inputRef}
          value={expression}
          onChange={(event) => setExpression(event.currentTarget.value)}
          placeholder="Ingrese su expresión de conjuntos, por ejemplo, A U (B') ∩ C"
        />
      </div>
      <Flex my="sm" mx="md" justify="space-between">
        <Flex align="center" gap="sm">
          <InputLabel>Operadores:</InputLabel>
          <Button
            variant="outline"
            onClick={() => addOperator("U ")}
            style={{ marginRight: "5px" }}
          >
            U
          </Button>
          <Button
            variant="outline"
            onClick={() => addOperator("∩ ")}
            style={{ marginRight: "5px" }}
          >
            ∩
          </Button>
          <Button
            variant="outline"
            onClick={() => addOperator("- ")}
            style={{ marginRight: "5px" }}
          >
            -
          </Button>
          <Button
            variant="outline"
            onClick={() => addOperator("'", false)}
            style={{ marginRight: "5px" }}
          >
            '
          </Button>
        </Flex>
        <Group>
          <Button onClick={handleCalculate}>Calcular</Button>
        </Group>
      </Flex>
      {error && <Text color="red">{error}</Text>}
      {result && (
        <Flex direction="row" gap="md" align="flex-end">
          <Title order={3}>Resultado:</Title>
          <>{[...result].join(", ")}</>
        </Flex>
      )}
    </Flex>
  );
};
