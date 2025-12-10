// frontend/src/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { SKILLS, SkillId, findSkillsInText } from "../data/skills";
import { generateMissions } from "../data/missionTemplates";
import { SkillSlider } from "../components/SkillSlider";

type JobSkill = {
  skillId: SkillId;
  weight: number; // 0–100 normalized
};

type UserSkillMap = Record<SkillId, number>;

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
  const [userSkills, setUserSkills] = useState<UserSkillMap>({});
  const [missions, setMissions] = useState<Mission[]>([]);
  const [readiness, setReadiness] = useState<number | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const foundSkills = useMemo(() => {
    return findSkillsInText(jdText);
  }, [jdText]);

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

    // Initialize user skills if missing (default mid score 50)
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
      4 // max missions
    ).map((m, idx) => ({
      id: `m-${idx}`,
      ...m,
    }));

    setMissions(newMissions);
  }

  const hasJobSkills = jobSkills.length > 0;

  return (
    <main className="page">
      <header className="page-header">
        <div className="logo-mark">V</div>
        <div>
          <h1 className="title">
            JD → Mission Engine <span className="accent">for Velric</span>
          </h1>
          <p className="subtitle">
            Paste any job description, see the skills it really cares about,
            then generate missions and a readiness score.
          </p>
        </div>
      </header>

      <section className="grid">
        {/* LEFT: JD INPUT */}
        <div className="panel panel-left">
          <h2 className="panel-title">1. Job Description</h2>
          <label className="field">
            <span className="field-label">Role title (optional)</span>
            <input
              className="input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, Talent Platform"
            />
          </label>

          <label className="field">
            <span className="field-label">Paste job description</span>
            <textarea
              className="textarea"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full JD here..."
              rows={14}
            />
          </label>

          <button
            className="primary-button"
            onClick={handleAnalyze}
            disabled={!jdText.trim()}
          >
            Analyze JD
          </button>

          <div className="detected-skills">
            <span className="detected-label">Detected skills:</span>
            {foundSkills.length === 0 && (
              <span className="detected-empty">None yet</span>
            )}
            {foundSkills.slice(0, 10).map((s) => {
              const skill = SKILLS.find((sk) => sk.id === s.skillId)!;
              return (
                <span key={s.skillId} className="chip">
                  {skill.label} <span className="chip-count">×{s.count}</span>
                </span>
              );
            })}
            {foundSkills.length > 10 && (
              <span className="chip chip-more">
                +{foundSkills.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: SKILLS + REPORT */}
        <div className="panel panel-right">
          <h2 className="panel-title">2. Readiness & Missions</h2>

          {!analyzed && (
            <p className="hint">
              Run <span className="accent">Analyze JD</span> to see skill
              weights and tune your profile.
            </p>
          )}

          {analyzed && !hasJobSkills && (
            <p className="hint">
              No skills from our library matched this JD yet. Try pasting a
              longer or more detailed job description.
            </p>
          )}

          {hasJobSkills && (
            <>
              <div className="skills-section">
                <h3 className="section-title">Your skill profile</h3>
                <p className="section-copy">
                  Drag sliders to roughly match your current strength. This is
                  your “pre-Velric” approximation.
                </p>

                <div className="skills-list">
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

                <button className="secondary-button" onClick={handleCompute}>
                  Compute readiness & missions
                </button>
              </div>

              {readiness != null && (
                <div className="report">
                  <div className="readiness-card">
                    <div className="readiness-label">
                      Role readiness score
                    </div>
                    <div className="readiness-score">
                      {readiness}
                      <span className="readiness-unit">/100</span>
                    </div>
                    <div className="readiness-bar">
                      <div
                        className="readiness-bar-fill"
                        style={{ width: `${readiness}%` }}
                      />
                    </div>
                    <p className="readiness-note">
                      This is a heuristic preview of what a Velric-style score
                      might look like for this JD — using only your sliders and
                      keyword weights.
                    </p>
                  </div>

                  <div className="missions-card">
                    <h3 className="section-title">Suggested missions</h3>
                    {missions.length === 0 && (
                      <p className="hint">
                        No big gaps detected. Nudge some sliders down to see
                        more targeted missions.
                      </p>
                    )}
                    <div className="missions-list">
                      {missions.map((m) => {
                        const skill = SKILLS.find(
                          (s) => s.id === m.skillId
                        )!;
                        return (
                          <div key={m.id} className="mission">
                            <div className="mission-pill">
                              {skill.label}
                            </div>
                            <h4 className="mission-title">{m.title}</h4>
                            <p className="mission-body">
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

      <footer className="footer">
        <span>Built as a concept companion for Velric’s proof-of-work vision.</span>
      </footer>
    </main>
  );
}
