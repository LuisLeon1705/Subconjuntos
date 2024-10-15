import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import React from "react";
//import VennDiagramComponent from "./components/vennDiagram";
import { localStorageColorSchemeManager, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Base } from "@pages";

const App: React.FC = () => {
  const colorSchemeManager = localStorageColorSchemeManager({
    key: "color-scheme",
  });
  return (
    <MantineProvider
      defaultColorScheme="dark"
      colorSchemeManager={colorSchemeManager}
    >
      <ModalsProvider>
        <Base />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
