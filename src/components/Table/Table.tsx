import { ActionIcon, Button, Flex, Tooltip } from "@mantine/core";
import { Pencil, Trash } from "@phosphor-icons/react";
import { letters, SubsetTable } from "@types";
import {
  MantineReactTable,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
  useMantineReactTable,
} from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useTable } from "./useTable";

export const Table = (props: {
  data: SubsetTable[];
  setData: (data: SubsetTable[]) => void;
  universe: SubsetTable;
}) => {
  const {
    //states
    columns,
    form,
    data,
    handleEditRow,
    handleCreate,
    handleDeleteCell,
    //display
    isEditing,
    openEdit,
    closeEdit,
    hasUniverse,
  } = useTable(props);
  const tableComponent = useMantineReactTable({
    //basic
    columns,
    data: data || [],
    //display

    editDisplayMode: "row",
    createDisplayMode: "row",
    paginationDisplayMode: "pages",
    localization: MRT_Localization_ES,
    //events
    onEditingRowSave: handleEditRow,
    onCreatingRowSave: handleCreate,
    onCreatingRowCancel: () => {
      form.reset();
      closeEdit();
    },
    onEditingRowCancel: () => {
      form.reset();
      closeEdit();
    },
    //render
    renderTopToolbarCustomActions: ({ table }) => (
      <Flex justify="flex-end" w="100%">
        <Tooltip
          label="Debes configurar el universo antes de agregar los subconjuntos"
          disabled={hasUniverse}
        >
          <Button
            disabled={isEditing || data.length >= 5 || !hasUniverse}
            onClick={() => {
              const newId = data.length + 1;
              form.setValues({
                id: String(newId),
                name: `${letters[newId - 1]}`,
                elements: "",
              });
              table.setCreatingRow(true);
              table.setEditingRow(null);
              openEdit();
            }}
          >
            Añadir subconjunto
          </Button>
        </Tooltip>
      </Flex>
    ),
    renderRowActions: (rowProps: {
      row: MRT_Row<MRT_RowData>;
      table: MRT_TableInstance<MRT_RowData>;
    }) => {
      return (
        <Flex>
          <ActionIcon
            variant="subtle"
            onClick={() => {
              form.setValues({ ...rowProps.row.original });
              rowProps.table.setEditingRow({ ...rowProps.row });
              rowProps.table.setCreatingRow(null);
            }}
            style={{
              backgroundColor: "transparent",
            }}
            disabled={isEditing || !hasUniverse}
          >
            <Pencil size={20} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => handleDeleteCell(rowProps.row.original.id)}
            style={{
              backgroundColor: "transparent",
            }}
            disabled={isEditing || !hasUniverse}
          >
            <Trash size={20} color={"red"} />
          </ActionIcon>
        </Flex>
      );
    },
    //others
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
    enablePagination: false,
    enableEditing: true,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    positionActionsColumn: "last",
    enableBottomToolbar: false,
  });

  return (
    <Flex direction="column">
      <MantineReactTable key="user-table" table={tableComponent} />
    </Flex>
  );
};
