import React from "react";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const row = payload[0]?.payload || {};
  const hasSourceAndPlatform = row.source && row.platform;

  // Convertir timestamp → "YYYY-MM-DD"
  const formattedLabel = hasSourceAndPlatform
    ? `${row.platform} - ${row.source}`
    : typeof label === "number"
      ? new Date(label).toISOString().slice(0, 10)
      : label;

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-md shadow-md px-2 py-1 text-xs text-white">
      {formattedLabel && (
        <p className="font-medium mb-0">
          {formattedLabel}
        </p>
      )}
      <p>{payload[0].value}</p>
    </div>
  );
}
