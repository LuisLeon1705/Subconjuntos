import { Badge, Flex, MultiSelect } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { EditRowProps, SubsetTable, tableSchema } from "@types";
import _ from "lodash";
import { MRT_RowData, type MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";

interface RowProps extends EditRowProps {
  values: Partial<SubsetTable>;
}

export const useTable = ({
  data,
  setData,
  universe,
}: {
  data: SubsetTable[];
  setData: (data: SubsetTable[]) => void;
  universe: SubsetTable;
}) => {
  // form
  const form = useForm<Partial<SubsetTable>>({
    initialValues: {
      id: "0",
      name: "",
      elements: "",
    },
    validate: zodResolver(tableSchema),
    validateInputOnBlur: true,
  });
  // estados
  const [isEditing, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const universeElements = useMemo(() => {
    return (
      universe?.elements
        ?.split(",")
        .map((el) => el.trim())
        .filter((el) => el !== "") ?? []
    );
  }, [universe]);
  const columns = useMemo<MRT_ColumnDef<MRT_RowData>[]>(
    () => [
      {
        accessorKey: "id",
        header: "id",
      },
      {
        accessorKey: "name",
        header: "Nombre",
        Edit: () => <>{form.values.name}</>,
      },
      {
        accessorKey: "elements",
        header: "Elementos",
        mantineEditTextInputProps: {
          error: form.errors.elements,
          onBlur: (event) =>
            form.setFieldValue("elements", event.currentTarget.value),
        },
        Edit: () => (
          <MultiSelect
            label="Elementos"
            placeholder="Selecciona los elementos del subconjunto"
            data={universeElements}
            searchable
            nothingFoundMessage="No encontrado..."
            error={form.errors.elements}
            value={
              form.values.elements
                ?.split(",")
                .map((el) => el.trim())
                .filter((el) => el !== "") ?? []
            }
            onChange={(elements) =>
              form.setFieldValue("elements", elements.join(", "))
            }
          />
        ),
        Cell: ({ row }) => (
          <Flex gap="md" wrap="wrap">
            {row.original.elements.split(",").map((el: string) => (
              <Badge key={`badge-table-${el}`} variant="light">
                {el.trim()}
              </Badge>
            ))}
          </Flex>
        ),
      },
    ],
    [form, universeElements]
  );
  // eventos
  const handleDeleteCell = async (id: string) => {
    try {
      setData(data.filter((el) => el.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditRow = async ({ table, row }: RowProps) => {
    form.validate();
    if (form.isValid()) {
      const findIndex = data.findIndex(
        (el) =>
          el.id !== row.original.id && (form.values.name ?? "") === el.name
      );
      if (findIndex === -1) {
        try {
          table.setEditingRow(null);
          const { name, elements } = form.values;
          setData(
            data.map((el) =>
              el.id === row.original.id
                ? {
                    ...el,
                    name: name ?? el.name,
                    elements: elements ?? el.elements,
                  }
                : el
            )
          );
          closeEdit();
        } catch (error) {
          console.error(error);
        }
      } else {
        form.setFieldError("name", "El nombre debe ser único");
      }
    }
  };

  const handleCreate = ({ exitCreatingMode }: RowProps) => {
    form.validate();
    if (form.isValid() && exitCreatingMode) {
      if (!data.map((el) => el.name).includes(form.values.name ?? "")) {
        const { name, elements } = form.values;
        setData([
          ...data,
          { id: _.uniqueId(""), name: name ?? "", elements: elements ?? "" },
        ]);
        closeEdit();
        exitCreatingMode();
      } else {
        form.setFieldError("name", "El nombre debe ser único");
      }
    }
  };
  return {
    // estados
    columns,
    form,
    data: useMemo(() => data, [data]),
    // eventos
    handleDeleteCell,
    handleEditRow,
    handleCreate,
    //display
    isEditing,
    openEdit,
    closeEdit,
    hasUniverse: universeElements.length > 0,
  };
};
