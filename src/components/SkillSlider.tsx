// frontend/src/components/SkillSlider.tsx
"use client";

import React, { CSSProperties } from "react";

type Props = {
  label: string;
  importance: number;
  value: number;
  onChange: (value: number) => void;
};

const containerStyle: CSSProperties = {
  borderRadius: "12px",
  padding: "8px 10px",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(5, 3, 18, 0.9)",
};

const headerRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginBottom: "4px",
};

const nameStyle: CSSProperties = {
  fontSize: "13px",
};

const metaStyle: CSSProperties = {
  fontSize: "11px",
  color: "#a3a3c2",
};

const sliderRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const valueStyle: CSSProperties = {
  width: "30px",
  textAlign: "right",
  fontSize: "12px",
};

export const SkillSlider: React.FC<Props> = ({
  label,
  importance,
  value,
  onChange,
}) => {
  const importanceLabel =
    importance > 40 ? "Core" : importance > 20 ? "Important" : "Nice-to-have";

  return (
    <div style={containerStyle}>
      <div style={headerRow}>
        <span style={nameStyle}>{label}</span>
        <span style={metaStyle}>
          {importanceLabel} • {importance.toFixed(0)}%
        </span>
      </div>
      <div style={sliderRow}>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={valueStyle}>{value}</span>
      </div>
    </div>
  );
};
