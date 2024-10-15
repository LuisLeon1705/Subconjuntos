import { getWords, useConfirmModal } from "@hooks";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { letters, SubsetTable } from "@types";
import React from "react";

export const useHome = () => {
  const [data, setData] = React.useState<SubsetTable[]>([]);
  const [universe, setUniverse] = React.useState<SubsetTable>({
    name: "",
    elements: "",
    id: "0",
  });
  const [isEditing, { toggle }] = useDisclosure(true);
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
    onConfirm: () => handleRandom(true),
  });
  const handleUpdateUniverse = (values: SubsetTable) => {
    if (data.length > 0) {
      setData([]);
    }
    setUniverse(values);
  };
  const handleRandom = (
    generateRandom: boolean = false,
    universeCount: number = 1,
    subsetCount: number = 2
  ) => {
    if (!generateRandom && (data.length > 0 || universe.elements.length > 0)) {
      openModal(() => handleRandom(true, universeCount, subsetCount));
    } else {
      const newUniverse = getWords({
        min: universeCount,
        max: universeCount,
      });
      const newSubsets = getRandomSubsets(newUniverse, subsetCount);
      setUniverse({
        name: "Universo",
        elements: newUniverse.join(", "),
        id: "0",
      });
      setData(
        newSubsets.map((subset, index) => ({
          name: `${letters[index]}`,
          elements: Array.from(new Set(subset)).join(", "),
          id: `${index + 1}`,
        }))
      );
    }
  };
  const getRandomSubsets = (array: string[], subsetCount: number) => {
    const subsets = [];
    for (let i = 0; i < subsetCount; i++) {
      const shuffledArray = [...array].sort(() => Math.random() - 0.5);
      const subsetSize = Math.floor(Math.random() * (array.length - 1)) + 1;
      const subset = shuffledArray.slice(0, subsetSize);
      subsets.push(subset);
    }

    return subsets;
  };

  return {
    universe,
    handleUpdateUniverse,
    handleRandom,
    data,
    setData,
    isEditing,
    toggle,
  };
};
