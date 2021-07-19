import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ChartConfiguration } from "chart.js";
import {
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from "chart.js";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);


interface ChartProps {
  config : ChartConfiguration;
}

export const Chart = React.memo((props : ChartProps) => {
  const {
    config
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const serializedConfig = JSON.stringify(config);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    const chart = new ChartJS(context, config);

    return () => { chart.destroy(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedConfig]);

  return <canvas ref={canvasRef} />;
});

Chart.displayName = "Chart";