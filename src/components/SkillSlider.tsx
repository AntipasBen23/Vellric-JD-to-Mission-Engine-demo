// frontend/src/components/SkillSlider.tsx
"use client";

import React from "react";

type Props = {
  label: string;
  importance: number; // 0–100
  value: number; // 0–100
  onChange: (value: number) => void;
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
    <div className="skill">
      <div className="skill-header">
        <span className="skill-name">{label}</span>
        <span className="skill-meta">
          {importanceLabel} • {importance.toFixed(0)}%
        </span>
      </div>
      <div className="skill-slider-row">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="skill-slider"
        />
        <span className="skill-value">{value}</span>
      </div>
    </div>
  );
};
