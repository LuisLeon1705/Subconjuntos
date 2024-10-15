import { Diagram, Table, UniverseForm } from "@components";
import { ActionIcon, Box, Flex, Title } from "@mantine/core";
import { ChartLine, FadersHorizontal } from "@phosphor-icons/react";
import React from "react";
import "./Home.css"; // Asegúrate de importar los estilos CSS
import { useHome } from "./useHome";

export const Home: React.FC = () => {
  const {
    universe,
    handleUpdateUniverse,
    handleRandom,
    data,
    setData,
    toggle,
    isEditing,
  } = useHome();
  return (
    <Flex direction="column" gap="md">
      <Flex mx="20%">
        <Title order={1} ta="center" textWrap="balance">
          Generador de Subconjuntos y Diagramas de Venn
        </Title>
      </Flex>
      <Flex justify="flex-end" mr="md">
        <ActionIcon onClick={toggle} size="xl" miw="220">
          {isEditing ? "Ver Diagrama" : "Editar Subconjuntos"}
          {isEditing ? <ChartLine size={32} /> : <FadersHorizontal size={32} />}
        </ActionIcon>
      </Flex>
      <Box className="fade-container" style={{ height: "400px" }}>
        <Box className={`fade-element ${isEditing ? "visible" : ""}`}>
          <UniverseForm
            data={universe}
            onSubmit={handleUpdateUniverse}
            hasValues={data.length > 0}
            handleRandom={(universeCount, subsetCount) =>
              handleRandom(false, universeCount, subsetCount)
            }
          />
          <Table data={data} setData={setData} universe={universe} />
        </Box>
        <Flex className={`fade-element ${!isEditing ? "visible" : ""}`}>
          {data.length < 2 ? (
            <span
              style={{
                color: "var(--mantine-color-red-8)",
                fontSize: 25,
                width: "100%",
                textAlign: "center",
              }}
            >
              Se necesitan por lo menos 2 subconjuntos para continuar
            </span>
          ) : (
            <Diagram subsets={data} universe={universe} />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
