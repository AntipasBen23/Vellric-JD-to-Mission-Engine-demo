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
    <div className="rounded-xl border border-white/5 bg-black/40 px-3 py-2.5">
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-slate-50">{label}</span>
        <span className="text-[10px] text-slate-400">
          {importanceLabel} • {importance.toFixed(0)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-[color:var(--tw-gradient-from)]"
        />
        <span className="w-8 text-right text-[11px] text-slate-200">
          {value}
        </span>
      </div>
    </div>
  );
};
