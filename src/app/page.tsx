// frontend/src/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { SKILLS, SkillId, findSkillsInText } from "../data/skills";
import { generateMissions } from "../data/missionTemplates";
import { SkillSlider } from "../components/SkillSlider";

type JobSkill = {
  skillId: SkillId;
  weight: number; // 0–100
};

// ✅ allow it to be partial – we don't always have all skills set
type UserSkillMap = Partial<Record<SkillId, number>>;

type Mission = {
  id: string;
  skillId: SkillId;
  title: string;
  description: string;
};

export default function HomePage() {
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkillMap>({}); // ✅ ok now
  const [missions, setMissions] = useState<Mission[]>([]);
  const [readiness, setReadiness] = useState<number | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const foundSkills = useMemo(() => findSkillsInText(jdText), [jdText]);

  function handleAnalyze() {
    const detected = foundSkills;
    if (detected.length === 0) {
      setJobSkills([]);
      setReadiness(null);
      setMissions([]);
      setAnalyzed(true);
      return;
    }

    const total = detected.reduce((sum, s) => sum + s.count, 0) || 1;
    const normalized: JobSkill[] = detected.map((s) => ({
      skillId: s.skillId,
      weight: (s.count / total) * 100,
    }));

    setJobSkills(normalized);

    setUserSkills((prev) => {
      const next: UserSkillMap = { ...prev };
      normalized.forEach(({ skillId }) => {
        if (next[skillId] == null) next[skillId] = 50;
      });
      return next;
    });

    setAnalyzed(true);
    setReadiness(null);
    setMissions([]);
  }

  function handleSkillChange(skillId: SkillId, value: number) {
    setUserSkills((prev) => ({ ...prev, [skillId]: value }));
  }

  function handleCompute() {
    if (jobSkills.length === 0) return;

    let weightedSum = 0;
    let maxSum = 0;

    jobSkills.forEach(({ skillId, weight }) => {
      const userScore = userSkills[skillId] ?? 0;
      weightedSum += weight * (userScore / 100);
      maxSum += weight;
    });

    const readinessScore = maxSum === 0 ? 0 : (weightedSum / maxSum) * 100;
    setReadiness(Math.round(readinessScore));

    const newMissions = generateMissions(
      jobTitle,
      jobSkills,
      userSkills,
      4
    ).map((m, idx) => ({
      id: `m-${idx}`,
      ...m,
    }));

    setMissions(newMissions);
  }

  const hasJobSkills = jobSkills.length > 0;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-velric-purple to-velric-purpleSoft text-xl font-extrabold tracking-[0.18em] text-black shadow-[0_0_30px_rgba(176,37,255,0.75)]">
          V
        </div>
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">
            JD → Mission Engine{" "}
            <span className="bg-gradient-to-r from-velric-purple to-pink-400 bg-clip-text text-transparent">
              for Velric
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-300 md:text-sm">
            Paste any job description, extract the real skill signal, and
            preview missions plus a readiness score—no backend, all client-side.
          </p>
        </div>
      </header>

      {/* Main grid */}
      <section className="grid gap-5 md:grid-cols-2">
        {/* Left: JD input */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#21103c] via-[#0b0714] to-black p-4 shadow-xl md:p-5">
          <h2 className="text-sm font-medium md:text-base">
            1. Job Description
          </h2>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-xs text-slate-400">
              Role title <span className="text-slate-500">(optional)</span>
            </span>
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-50 outline-none ring-velric-purple/40 placeholder:text-slate-500 focus:border-velric-purple focus:ring-1"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, Talent Platform"
            />
          </label>

          <label className="mt-3 flex flex-col gap-1.5">
            <span className="text-xs text-slate-400">Paste job description</span>
            <textarea
              className="min-h-[220px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-50 outline-none ring-velric-purple/40 placeholder:text-slate-500 focus:border-velric-purple focus:ring-1"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full JD here..."
            />
          </label>

          <button
            className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-velric-purple to-velric-purpleSoft px-4 py-2 text-xs font-medium text-black shadow-lg shadow-velric-purple/60 disabled:opacity-40"
            onClick={handleAnalyze}
            disabled={!jdText.trim()}
          >
            Analyze JD
          </button>

          {/* Detected skills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-400">Detected skills:</span>
            {foundSkills.length === 0 && (
              <span className="text-slate-500">None yet</span>
            )}
            {foundSkills.slice(0, 10).map((s) => {
              const skill = SKILLS.find((sk) => sk.id === s.skillId)!;
              return (
                <span
                  key={s.skillId}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                >
                  {skill.label}
                  <span className="text-[10px] text-slate-400">
                    ×{s.count}
                  </span>
                </span>
              );
            })}
            {foundSkills.length > 10 && (
              <span className="rounded-full border border-dashed border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                +{foundSkills.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* Right: skills + missions */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0a33] via-[#070414] to-black p-4 shadow-xl md:p-5">
          <h2 className="text-sm font-medium md:text-base">
            2. Readiness & Missions
          </h2>

          {!analyzed && (
            <p className="mt-3 text-xs text-slate-300">
              Run{" "}
              <span className="bg-gradient-to-r from-velric-purple to-pink-400 bg-clip-text font-medium text-transparent">
                Analyze JD
              </span>{" "}
              to detect skill weights and then tune your profile using the
              sliders.
            </p>
          )}

          {analyzed && !hasJobSkills && (
            <p className="mt-3 text-xs text-slate-300">
              No skills from the current library matched this JD yet. Try a more
              detailed description or add more technical keywords.
            </p>
          )}

          {hasJobSkills && (
            <>
              {/* Skill sliders */}
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-slate-100">
                  Your skill profile
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  Drag sliders to approximate your current strength. This is a
                  rough “pre-Velric” signal based only on your self-assessment.
                </p>

                <div className="mt-2 flex max-h-64 flex-col gap-2.5 overflow-y-auto pr-1">
                  {jobSkills
                    .slice()
                    .sort((a, b) => b.weight - a.weight)
                    .map(({ skillId, weight }) => {
                      const skill = SKILLS.find((s) => s.id === skillId)!;
                      const value = userSkills[skillId] ?? 50;
                      return (
                        <SkillSlider
                          key={skillId}
                          label={skill.label}
                          importance={weight}
                          value={value}
                          onChange={(v) => handleSkillChange(skillId, v)}
                        />
                      );
                    })}
                </div>

                <button
                  className="mt-3 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-50 hover:bg-white/10"
                  onClick={handleCompute}
                >
                  Compute readiness & missions
                </button>
              </div>

              {/* Report */}
              {readiness != null && (
                <div className="mt-4 space-y-3">
                  {/* Readiness card */}
                  <div className="rounded-2xl border border-velric-purple/50 bg-gradient-to-r from-[#321154] via-[#12041e] to-black px-4 py-3 text-xs shadow-lg">
                    <div className="text-[11px] text-slate-300">
                      Role readiness score
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold">
                        {readiness}
                      </span>
                      <span className="text-[11px] text-slate-400">/100</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-velric-purple to-pink-400"
                        style={{ width: `${readiness}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-300">
                      Heuristic preview of how you might score for this JD using
                      simple weights and sliders—not an official Velric Score,
                      but shaped like one.
                    </p>
                  </div>

                  {/* Missions */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100">
                      Suggested missions
                    </h3>
                    {missions.length === 0 && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        No big gaps popped up. Drop one or two skill sliders
                        lower to see more targeted missions.
                      </p>
                    )}
                    <div className="mt-2 space-y-2.5">
                      {missions.map((m) => {
                        const skill = SKILLS.find(
                          (s) => s.id === m.skillId
                        )!;
                        return (
                          <div
                            key={m.id}
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs"
                          >
                            <div className="inline-flex rounded-full bg-velric-purple/15 px-2 py-0.5 text-[10px] text-velric-purple">
                              {skill.label}
                            </div>
                            <h4 className="mt-1 text-[13px] font-medium text-slate-50">
                              {m.title}
                            </h4>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                              {m.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="mt-3 text-center text-[11px] text-slate-400">
        Built as a concept companion for Velric&apos;s proof-of-work vision.
      </footer>
    </main>
  );
}
