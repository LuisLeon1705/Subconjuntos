import { MRT_Row, MRT_RowData, MRT_TableInstance } from "mantine-react-table";
import { z } from "zod";

export const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface Subset {
  name: string;
  elements: Set<string>;
}
export type EditRowProps = {
  row: MRT_Row<MRT_RowData>;
  table: MRT_TableInstance<MRT_RowData>;
  exitCreatingMode?: () => void;
  exitEditingMode?: () => void;
};

export interface SubsetTable {
  id: string;
  name: string;
  elements: string;
}

export interface RandomGenerator {
  universeElementsCount: number;
  subsetCount: number;
}

export const tableSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  elements: z
    .string()
    .min(1, { message: "Se requiere por lo menos un elemento" })
    .refine(
      (elements) => {
        const elementsArray = elements.split(",").map((el) => el.trim());
        return (
          elementsArray.length > 0 &&
          new Set(elementsArray).size === elementsArray.length
        );
      },
      {
        message: "Los nombres de los subconjuntos deben ser únicos",
      }
    ),
});

export const subsetSchema = z.object({
  name: z.string().nonempty("Name is required"),
  elements: z.array(z.string()).transform((elements) => new Set(elements)),
});

export const randomGeneratorSchema = z.object({
  universeElementsCount: z
    .number()
    .int()
    .min(1, { message: "El valor minimo es 1" })
    .max(20, { message: "El valor maximo es 20" }),
  subsetCount: z
    .number()
    .int()
    .min(2, { message: "El valor minimo es 2" })
    .max(5, { message: "El valor maximo es 5" }),
});

export const subsetsSchema = z
  .array(subsetSchema)
  .superRefine((subsets, ctx) => {
    const names = subsets.map((subset) => subset.name);
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los nombres de los subconjuntos deben ser únicos",
      });
    }
  });
