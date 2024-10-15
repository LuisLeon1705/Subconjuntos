import {
    ActionIcon,
    Box,
    MantineColorScheme,
    useComputedColorScheme,
    useMantineColorScheme
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Home } from "@pages";
import { Moon, Sun } from "@phosphor-icons/react";
import "mantine-react-table/styles.css";
import React from "react";

export const Base: React.FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const setTheme = (theme: MantineColorScheme) => {
    setColorScheme(theme);
  };
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  return (
    <Box>
      <ActionIcon
        onClick={() =>
          setTheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
        pos="absolute"
        right={5}
        top={5}
      >
        {computedColorScheme === "light" ? (
          <Moon size={20} />
        ) : (
          <Sun size={20} />
        )}
      </ActionIcon>
      <Home />
    </Box>
  );
};
