/* eslint-disable react-hooks/exhaustive-deps */
import { useConfirmModal } from "@hooks";
import { Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  RandomGenerator,
  randomGeneratorSchema,
  SubsetTable,
  tableSchema,
} from "@types";
import { useEffect } from "react";

interface useUniverseFormProps {
  // Propiedades
  data: SubsetTable;
  onSubmit: (values: SubsetTable) => void;
  hasValues: boolean;
  handleRandom: (universeCount: number, subsetCount: number) => void;
}

export const useUniverseForm = ({
  data,
  onSubmit,
  hasValues,
  handleRandom,
}: useUniverseFormProps) => {
  const form = useForm<SubsetTable>({
    initialValues: {
      id: "0",
      name: "",
      elements: "",
    },
    validate: zodResolver(tableSchema),
    validateInputOnBlur: true,
  });
  const universeRandomForm = useForm<RandomGenerator>({
    initialValues: {
      universeElementsCount: 1,
      subsetCount: 5,
    },
    validate: zodResolver(randomGeneratorSchema),
    validateInputOnBlur: true,
  });
  const handleModalSubmit = () => {
    onSubmit(form.values);
  };

  const { openModal } = useConfirmModal({
    title: "Alerta",
    labels: { confirm: "Confirmar", cancel: "Cancelar" },
    children: (
      <Text size="sm">
        ¿Estás seguro de que deseas realizar esta acción? Esta acción borraría
        todos los subconjuntos y no se puede deshacer.
      </Text>
    ),
    onCancel: () => null,
    onConfirm: handleModalSubmit,
  });
  const handleSubmit = (values: SubsetTable) => {
    if (hasValues) {
      openModal();
    } else {
      onSubmit(values);
    }
  };
  const handleSubmitRandom = () => {
    universeRandomForm.validate();
    if (universeRandomForm.isValid()) {
      const { universeElementsCount, subsetCount } = universeRandomForm.values;
      handleRandom(universeElementsCount, subsetCount);
    }
  };
  useEffect(() => {
    form.setValues(data);
  }, [data]);
  return {
    form,
    universeRandomForm,
    handleSubmit,
    handleSubmitRandom,
  };
};
