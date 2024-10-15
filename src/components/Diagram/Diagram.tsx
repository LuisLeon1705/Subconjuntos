import { Calculator } from "@components";
import { Flex } from "@mantine/core";
import { SubsetTable } from "@types";
import { Chart, ChartConfiguration, LinearScale, Tooltip } from "chart.js";
import "chartjs-chart-venn";
import {
  ArcSlice,
  extractSets,
  VennDiagramController,
} from "chartjs-chart-venn";
import { useEffect, useRef } from "react";

Chart.register(VennDiagramController, ArcSlice, LinearScale, Tooltip);

export const Diagram = (props: {
  subsets: SubsetTable[];
  universe: SubsetTable;
}) => {
  const { subsets } = props;
  // Refs to the canvas and the chart instance
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  // triggers
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const dataSet = subsets.map((subset) => ({
          label: subset.name,
          values: subset.elements.split(",").map((el) => el.trim()),
        }));
        const data: ChartConfiguration<"venn">["data"] = extractSets(dataSet, {
          label: "Univero",
        });
        // Destroy the previous chart instance if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        // #region config
        const config: ChartConfiguration<"venn"> = {
          type: "venn",
          data,
        };

        chartRef.current = new Chart(ctx, config);
      }
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [subsets]);

  return (
    <Flex w="100%" direction="column" gap="md">
      <Flex wrap="nowrap" mt="md" w={400} mx="auto">
        <canvas ref={canvasRef} width={250} height={250}></canvas>
      </Flex>
      <Calculator {...props} />
    </Flex>
  );
};
