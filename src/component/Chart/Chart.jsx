import React, {  useMemo } from "react";
import { Chart } from "react-google-charts";

const ChartComponent = ({ historicalData }) => {
  // 1) Build sampled data
  const data = useMemo(() => {
    if (!historicalData?.prices) return [["Date", "Price"]];
    const base = [["Date", "Price"]];
    const inc = Math.max(1, Math.floor(historicalData.prices.length / 50));
    historicalData.prices.forEach((p, i) => {
      if (i % inc === 0) base.push([new Date(p[0]), p[1]]);
    });
    return base;
  }, [historicalData]);

  // 2) Compute ticks
  const vAxisProps = useMemo(() => {
    const prices = data.slice(1).map((row) => row[1]);
    if (prices.length === 0) return {};
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const count = 6;
    const step = (max - min) / (count - 1);

    const ticks = Array.from({ length: count }, (_, i) => {
      const v = min + step * i;
      return { v, f: `$${v.toFixed(2)}` };
    });

    return {
      viewWindow: { min, max },
      ticks,
    };
  }, [data]);

  // 3) Final chart options
  const options = {
    title: "7-Day Price History",
    hAxis: {
      title: "Date",
      format: "MMM dd",
      gridlines: { count: 7 },
    },
    vAxis: {
      title: "Price (USD)",
      ...vAxisProps,
    },
    legend: "none",
    chartArea: { width: "85%", height: "75%" },
    curveType: "function",
    pointSize: 3,
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
};

export default ChartComponent;
