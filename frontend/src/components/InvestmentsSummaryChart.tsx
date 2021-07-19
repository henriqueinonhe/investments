import React from "react";
import { Chart } from "./Chart";
import randomColor from "randomcolor";
import { InvestmentsService, InvestmentsSummary } from "../services/InvestmentsService";
import { useTranslation } from "react-i18next";
import { ChartConfiguration } from "chart.js";


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
  }));

  const labels = summary?.map(e => 
    t(InvestmentsService.displayableInvestmentType(e.type))) as Array<string> ?? [];
  const values = summary?.map(e => e.sum) ?? [];

  const config : ChartConfiguration = {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        label: t("Investments Summary")!,
        data: values,
        backgroundColor: colors,
        hoverOffset: 4
      }]
    }
  };

  return <Chart config={config}/>;

});

InvestmentsSummaryChart.displayName = "InvestmentsSummaryChart";

