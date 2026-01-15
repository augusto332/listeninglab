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
  const filteredData = useMemo(
    () => data.filter((d) => (d?.count ?? 0) > 0),
    [data]
  );

  if (!filteredData.length) {
    return <p className="text-muted-foreground text-sm">Sin datos</p>;
  }

  // Construir ticks adaptativos sin romper React
  const { ticks, shortRange } = useMemo(() => {
    const dates = filteredData.map((d) => new Date(d.date).getTime());

    const minTs = Math.min(...dates);
    const maxTs = Math.max(...dates);

    const minDate = new Date(minTs);
    const maxDate = new Date(maxTs);

    const monthsDiff =
      (maxDate.getFullYear() - minDate.getFullYear()) * 12 +
      (maxDate.getMonth() - minDate.getMonth());

    const isShortRange = monthsDiff <= 2;

    const tickDates = [];

    if (isShortRange) {
      // mostrar ~6 ticks máximo
      const step = Math.ceil(filteredData.length / 6);

      for (let i = 0; i < filteredData.length; i += step) {
        tickDates.push(filteredData[i].date);
      }
    } else {
      // un tick por mes (máx 6)
      const monthsMap = new Map();

      filteredData.forEach((d) => {
        const date = new Date(d.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthsMap.has(key)) monthsMap.set(key, d.date);
      });

      const months = Array.from(monthsMap.values());
      const step = Math.ceil(months.length / 6);

      for (let i = 0; i < months.length; i += step) {
        tickDates.push(months[i]);
      }
    }

    // asegurar primer y último tick
    if (tickDates[0] !== filteredData[0].date)
      tickDates.unshift(filteredData[0].date);

    if (tickDates[tickDates.length - 1] !== filteredData[filteredData.length - 1].date)
      tickDates.push(filteredData[filteredData.length - 1].date);

    return { ticks: tickDates, shortRange: isShortRange };
  }, [filteredData]);

  // Format ticks
  const formatTick = (dateStr) => {
    const date = new Date(dateStr);

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

  // Tooltip fecha completa
  const formatTooltip = (dateStr) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 10, right: 20, bottom: 15, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis
            dataKey="date"
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

          <Tooltip
            content={<ChartTooltip />}
            labelFormatter={formatTooltip}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
