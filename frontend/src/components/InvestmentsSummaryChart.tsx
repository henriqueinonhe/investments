import React from "react";
import { Chart } from "./Chart";
import randomColor from "randomcolor";
import { InvestmentsService, InvestmentsSummary } from "../services/InvestmentsService";
import { useTranslation } from "react-i18next";
import { ChartConfiguration } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { lighten } from "polished";


export interface InvestmentSummaryChartProps {
  summary : InvestmentsSummary;
}

export const InvestmentsSummaryChart = React.memo((props : InvestmentSummaryChartProps) => {
  const {
    summary
  } = props;

  const { t } = useTranslation();

  const colors = summary?.map(() => randomColor({
    luminosity: "light"
  })).map(color => lighten(0.05, color));

  const labels = summary?.map(e => 
    t(InvestmentsService.displayableInvestmentType(e.type))) as Array<string> ?? [];

  const values = summary?.map(e => e.sum) ?? [];

  const total = values.reduce((accum, current) => accum + current, 0);
  const formatter = (value : number) : string => {
    return `${value} (${(100 * value / total).toFixed(2)}%)`;
  };

  const config : ChartConfiguration = {
    type: "doughnut",
    plugins: [ChartDataLabels],
    data: {
      labels: labels,
      datasets: [{
        label: t("Investments Summary")!,
        data: values,
        backgroundColor: colors,
        hoverOffset: 4
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter: formatter,
          color: "#111"
        }
      }
    }
  };

  return <Chart config={config}/>;

});

InvestmentsSummaryChart.displayName = "InvestmentsSummaryChart";

