"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export default function MentionsLineChart({ data = [] }) {

  // 1. Construir serie temporal continua día por día
  const chartData = useMemo(() => {
    if (!data.length) return [];

    // Mapear datos existentes por día (YYYY-MM-DD → count)
    const dataMap = new Map();
    data.forEach((d) => {
      const dayKey = new Date(d.date).toISOString().slice(0, 10);
      dataMap.set(dayKey, d.count ?? 0);
    });

    // Calcular rango completo
    const minDate = new Date(Math.min(...data.map(d => new Date(d.date))));
    const maxDate = new Date(Math.max(...data.map(d => new Date(d.date))));

    // Generar todos los días intermedios
    const series = [];
    const current = new Date(minDate);

    while (current <= maxDate) {
      const key = current.toISOString().slice(0, 10);
      series.push({
        date: current.getTime(),
        count: dataMap.get(key) ?? 0
      });
      current.setDate(current.getDate() + 1);
    }

    return series;
  }, [data]);

  if (!chartData.length) {
    return <p className="text-muted-foreground text-sm">Sin datos</p>;
  }

  // 2. Construcción de ticks adaptativos
  const { ticks, shortRange } = useMemo(() => {
    const dates = chartData.map((d) => d.date);

    const minTs = Math.min(...dates);
    const maxTs = Math.max(...dates);

    const minDate = new Date(minTs);
    const maxDate = new Date(maxTs);

    const monthsDiff =
      (maxDate.getFullYear() - minDate.getFullYear()) * 12 +
      (maxDate.getMonth() - minDate.getMonth());

    const isShortRange = monthsDiff <= 2;
    const tickTs = [];

    if (isShortRange) {
      const step = Math.ceil(chartData.length / 6);
      for (let i = 0; i < chartData.length; i += step) {
        tickTs.push(chartData[i].date);
      }
    } else {
      const monthsMap = new Map();
      chartData.forEach((d) => {
        const dt = new Date(d.date);
        const key = `${dt.getFullYear()}-${dt.getMonth()}`;
        if (!monthsMap.has(key)) monthsMap.set(key, d.date);
      });

      const months = Array.from(monthsMap.values());
      const step = Math.ceil(months.length / 6);
      for (let i = 0; i < months.length; i += step) {
        tickTs.push(months[i]);
      }
    }

    if (tickTs[0] !== chartData[0].date) tickTs.unshift(chartData[0].date);
    if (tickTs[tickTs.length - 1] !== chartData[chartData.length - 1].date)
      tickTs.push(chartData[chartData.length - 1].date);

    return { ticks: tickTs, shortRange: isShortRange };
  }, [chartData]);

  // 3. Formato ticks eje X
  const formatTick = (ts) => {
    const date = new Date(ts);
    if (shortRange) {
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
    }
    return date.toLocaleDateString("es-ES", {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 15, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            ticks={ticks}
            tickFormatter={formatTick}
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip content={<ChartTooltip />} />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
