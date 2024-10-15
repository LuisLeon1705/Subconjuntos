import { Button, Flex, Group, NumberInput, TextInput } from "@mantine/core";
import { SubsetTable } from "@types";
import { useUniverseForm } from "./useUniverseForm";

interface UniverseFormProps {
  // Propiedades
  data: SubsetTable;
  onSubmit: (values: SubsetTable) => void;
  hasValues: boolean;
  handleRandom: (universeCount: number, subsetCount: number) => void;
}

export const UniverseForm = ({ ...props }: UniverseFormProps) => {
  const { form, universeRandomForm, handleSubmit, handleSubmitRandom } =
    useUniverseForm(props);
  return (
    <Flex direction="column">
      <Flex
        direction="row"
        gap="md"
        justify="space-between"
        align="flex-end"
        mx="md"
        mb="md"
      >
        <NumberInput
          label="Número de elementos del universo"
          {...universeRandomForm.getInputProps("universeElementsCount")}
          w="40%"
          min={1}
        />
        <NumberInput
          label="Número de subconjuntos"
          {...universeRandomForm.getInputProps("subsetCount")}
          w="40%"
          min={1}
        />
        <Button w="20%" onClick={handleSubmitRandom}>
          Generar aleatorio
        </Button>
      </Flex>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Flex direction="row" gap="md" mx="md">
          <TextInput
            required
            label="Nombre del universo"
            placeholder="Nombre del universo"
            w="25%"
            {...form.getInputProps("name")}
          />
          <TextInput
            required
            label="Elementos del universo"
            placeholder="Elementos del universo"
            w="75%"
            {...form.getInputProps("elements")}
          />
        </Flex>
        <Group justify="flex-end" my="md" mr="md">
          <Button type="submit">Guardar</Button>
        </Group>
      </form>
    </Flex>
  );
};
