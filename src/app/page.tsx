// frontend/src/app/page.tsx
"use client";

import React, { useMemo, useState, CSSProperties } from "react";
import { SKILLS, SkillId, findSkillsInText } from "../data/skills";
import { generateMissions } from "../data/missionTemplates";
import { SkillSlider } from "../components/SkillSlider";

type JobSkill = {
  skillId: SkillId;
  weight: number;
};

type UserSkillMap = Partial<Record<SkillId, number>>;

type Mission = {
  id: string;
  skillId: SkillId;
  title: string;
  description: string;
};

/* ---------- shared styles ---------- */

const pageStyle: CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "32px 16px 40px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const logoStyle: CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "999px",
  backgroundImage: "linear-gradient(135deg, #b025ff, #5b00ff)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "22px",
  letterSpacing: "0.18em",
  color: "#05010a",
  boxShadow: "0 0 30px rgba(176, 37, 255, 0.8)",
};

const titleStyle: CSSProperties = {
  fontSize: "24px",
  margin: 0,
};

const accentText: CSSProperties = {
  backgroundImage: "linear-gradient(120deg, #b025ff, #ff7bff)",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

const subtitleStyle: CSSProperties = {
  marginTop: "4px",
  fontSize: "13px",
  color: "#a3a3c2",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
  gap: "20px",
};

const panelBase: CSSProperties = {
  borderRadius: "18px",
  border: "1px solid rgba(189, 147, 249, 0.16)",
  boxShadow: "0 18px 45px rgba(0, 0, 0, 0.6)",
  padding: "18px",
  backgroundImage:
    "radial-gradient(circle at top left, #21103c 0, #0b0714 38%, #05030a 100%)",
};

const rightPanelBackground: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at top left, #1a0a33 0, #070414 45%, #05030a 100%)",
};

const panelTitleStyle: CSSProperties = {
  fontSize: "15px",
  margin: 0,
};

const labelSmall: CSSProperties = {
  fontSize: "12px",
  color: "#a3a3c2",
};

const inputBase: CSSProperties = {
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  backgroundColor: "rgba(10, 5, 22, 0.9)",
  padding: "8px 10px",
  fontSize: "13px",
  color: "#f5f5ff",
  outline: "none",
};

const buttonPrimary: CSSProperties = {
  marginTop: "8px",
  borderRadius: "999px",
  padding: "9px 16px",
  fontSize: "13px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  backgroundImage: "linear-gradient(120deg, #b025ff, #5b00ff)",
  color: "#05030a",
  boxShadow: "0 12px 28px rgba(176, 37, 255, 0.65)",
};

const buttonSecondary: CSSProperties = {
  marginTop: "10px",
  borderRadius: "999px",
  padding: "9px 16px",
  fontSize: "13px",
  fontWeight: 500,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  cursor: "pointer",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "#ffffff",
};

const hintText: CSSProperties = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#a3a3c2",
};

const chipStyle: CSSProperties = {
  borderRadius: "999px",
  padding: "4px 10px",
  fontSize: "11px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
};

const readinessCard: CSSProperties = {
  padding: "10px 12px",
  borderRadius: "14px",
  border: "1px solid rgba(176, 37, 255, 0.4)",
  backgroundImage:
    "radial-gradient(circle at top right, #321154 0, #12041e 65%, #05030a 100%)",
};

const missionCard: CSSProperties = {
  borderRadius: "12px",
  padding: "8px 10px 10px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(8, 5, 20, 0.95)",
};

/* ---------- component ---------- */

export default function HomePage() {
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkillMap>({});
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
    <main style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle}>V</div>
        <div>
          <h1 style={titleStyle}>
            JD → Mission Engine{" "}
            <span style={accentText}>for Velric</span>
          </h1>
          <p style={subtitleStyle}>
            Paste any job description, extract the real skill signal, and
            preview missions plus a readiness score—no backend, all client-side.
          </p>
        </div>
      </header>

      {/* Main grid */}
      <section style={gridStyle as CSSProperties}>
        {/* LEFT PANEL */}
        <div style={panelBase}>
          <h2 style={panelTitleStyle}>1. Job Description</h2>

          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={labelSmall}>
                Role title <span style={{ color: "#6b6b88" }}>(optional)</span>
              </span>
              <input
                style={inputBase}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer, Talent Platform"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={labelSmall}>Paste job description</span>
              <textarea
                style={{
                  ...inputBase,
                  minHeight: "220px",
                  resize: "vertical",
                }}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full JD here..."
              />
            </label>

            <button
              style={{
                ...buttonPrimary,
                opacity: jdText.trim() ? 1 : 0.4,
                boxShadow: jdText.trim()
                  ? buttonPrimary.boxShadow
                  : "none",
              }}
              onClick={handleAnalyze}
              disabled={!jdText.trim()}
            >
              Analyze JD
            </button>
          </div>

          {/* detected skills */}
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#a3a3c2" }}>Detected skills:</span>
            {foundSkills.length === 0 && (
              <span style={{ color: "#7d7da0" }}>None yet</span>
            )}
            {foundSkills.slice(0, 10).map((s) => {
              const skill = SKILLS.find((sk) => sk.id === s.skillId)!;
              return (
                <span key={s.skillId} style={chipStyle}>
                  {skill.label}{" "}
                  <span style={{ marginLeft: "4px", color: "#a3a3c2" }}>
                    ×{s.count}
                  </span>
                </span>
              );
            })}
            {foundSkills.length > 10 && (
              <span
                style={{
                  ...chipStyle,
                  borderStyle: "dashed",
                }}
              >
                +{foundSkills.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ ...panelBase, ...rightPanelBackground }}>
          <h2 style={panelTitleStyle}>2. Readiness & Missions</h2>

          {!analyzed && (
            <p style={hintText}>
              Run <span style={accentText}>Analyze JD</span> to detect skill
              weights and then tune your profile using the sliders.
            </p>
          )}

          {analyzed && !hasJobSkills && (
            <p style={hintText}>
              No skills from the current library matched this JD yet. Try a more
              detailed description or add more technical keywords.
            </p>
          )}

          {hasJobSkills && (
            <>
              {/* skill sliders */}
              <div style={{ marginTop: "10px" }}>
                <h3
                  style={{
                    fontSize: "13px",
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  Your skill profile
                </h3>
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    color: "#a3a3c2",
                  }}
                >
                  Drag sliders to approximate your current strength. This is a
                  rough “pre-Velric” signal based only on your self-assessment.
                </p>

                <div
                  style={{
                    marginTop: "8px",
                    maxHeight: "260px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingRight: "4px",
                  }}
                >
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

                <button style={buttonSecondary} onClick={handleCompute}>
                  Compute readiness & missions
                </button>
              </div>

              {/* readiness + missions */}
              {readiness != null && (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={readinessCard}>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#a3a3c2",
                      }}
                    >
                      Role readiness score
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "28px",
                          fontWeight: 600,
                        }}
                      >
                        {readiness}
                      </span>
                      <span
                        style={{ fontSize: "11px", color: "#a3a3c2" }}
                      >
                        /100
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        height: "6px",
                        borderRadius: "999px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${readiness}%`,
                          backgroundImage:
                            "linear-gradient(90deg, #b025ff, #ff7bff)",
                          borderRadius: "999px",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        color: "#a3a3c2",
                      }}
                    >
                      Heuristic preview of how you might score for this JD using
                      simple weights and sliders—not an official Velric Score,
                      but shaped like one.
                    </p>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      Suggested missions
                    </h3>
                    {missions.length === 0 && (
                      <p style={hintText}>
                        No big gaps popped up. Drop one or two skill sliders
                        lower to see more targeted missions.
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {missions.map((m) => {
                        const skill = SKILLS.find(
                          (s) => s.id === m.skillId
                        )!;
                        return (
                          <div key={m.id} style={missionCard}>
                            <div
                              style={{
                                display: "inline-flex",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                backgroundColor:
                                  "rgba(176, 37, 255, 0.16)",
                                fontSize: "10px",
                                color: "#b025ff",
                              }}
                            >
                              {skill.label}
                            </div>
                            <h4
                              style={{
                                margin: "6px 0 4px",
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              {m.title}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "#a3a3c2",
                                lineHeight: 1.5,
                              }}
                            >
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

      <footer
        style={{
          marginTop: "16px",
          fontSize: "11px",
          color: "#a3a3c2",
          textAlign: "center",
        }}
      >
        Built as a concept companion for Velric&apos;s proof-of-work vision.
      </footer>
    </main>
  );
}
