// frontend/src/data/missionTemplates.ts

import { SKILLS, SkillId } from "./skills";

type JobSkill = {
  skillId: SkillId;
  weight: number;
};

// Allow missing keys – we only store sliders for some skills
export type UserSkillMap = Partial<Record<SkillId, number>>;

type MissionTemplate = {
  title: string;
  body: string;
};

type MissionOutput = {
  skillId: SkillId;
  title: string;
  description: string;
};

const DOMAINS = [
  "a hiring marketplace",
  "an AI talent platform",
  "a SaaS billing dashboard",
  "a student career portal",
  "a B2B recruiting tool",
];

const STACKS: Record<"frontend" | "backend" | "data" | "infra" | "soft", string> =
  {
    frontend: "Next.js + TypeScript",
    backend: "Go + Postgres",
    data: "Postgres + SQL",
    infra: "Docker + Kubernetes",
    soft: "async docs + Loom walkthrough",
  };

const TEMPLATES: Record<
  "frontend" | "backend" | "data" | "infra" | "soft",
  MissionTemplate[]
> = {
  frontend: [
    {
      title: "Design the candidate missions dashboard",
      body: `Build a responsive dashboard UI for {{domain}} using {{stack}}.
It should list missions, show progress for each one, and surface a “readiness score” summary. Include loading states and empty states.`,
    },
    {
      title: "Implement a JD-to-mission preview flow",
      body: `Implement a three-step frontend flow: paste JD → preview detected skills → show suggested missions.
Use {{stack}} and focus on clarity of state handling and UX.`,
    },
  ],
  backend: [
    {
      title: "Score engine for JD fit",
      body: `Implement a small API in {{stack}} that accepts a JSON payload of candidate skills and required skills, then returns a readiness score and sorted gaps.
Expose at least two endpoints and include basic tests.`,
    },
    {
      title: "Mission submission and review",
      body: `Design and implement backend endpoints in {{stack}} for:
- submitting a mission
- updating its status
- fetching a candidate's mission history.
Store everything in a relational schema and document your choices.`,
    },
  ],
  data: [
    {
      title: "Hiring funnel analytics",
      body: `Create a schema and SQL queries for {{domain}} that answer:
- conversion from mission accepted → mission completed
- average readiness score per role
- time-to-completion distribution.
Deliver a schema diagram plus the SQL queries.`,
    },
    {
      title: "Skill-gap reporting",
      body: `Assume you track candidate skill scores over time in Postgres.
Design tables and write queries that find:
- top 5 most common skill gaps
- average time it takes to close each gap after a mission.
Explain how a recruiter would use these results.`,
    },
  ],
  infra: [
    {
      title: "Containerize the scoring service",
      body: `Write a Dockerfile and basic deployment plan for a scoring API for {{domain}}.
Optimize for fast cold starts and easy local development. Include a short README describing trade-offs.`,
    },
    {
      title: "Resilient mission processing pipeline",
      body: `Sketch the architecture and deployment notes for a mission evaluation service running on {{stack}}.
Explain how you'd handle retries, observability, and rolling updates.`,
    },
  ],
  soft: [
    {
      title: "Write a one-page product spec",
      body: `Write a concise spec for the “JD-to-mission engine” inside a platform like Velric.
Describe:
- problem
- success metrics
- user stories (candidate & recruiter)
- v1 scope / cut lines.
Keep it to one page of clear, structured writing.`,
    },
    {
      title: "Stakeholder walkthrough",
      body: `Draft an async Loom-style script explaining the JD-to-mission feature for:
- product
- engineering
- sales.
Focus on clarity, trade-offs, and how it improves hiring outcomes.`,
    },
  ],
};

function getCategory(skillId: SkillId): keyof typeof TEMPLATES {
  const skill = SKILLS.find((s) => s.id === skillId);
  if (!skill) return "backend";
  return skill.category;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMissions(
  jobTitle: string,
  jobSkills: JobSkill[],
  userSkills: UserSkillMap,
  maxMissions: number
): MissionOutput[] {
  if (jobSkills.length === 0) return [];

  const domain = jobTitle.trim() !== "" ? jobTitle.trim() : pick(DOMAINS);

  // Sort skills by "gap * importance"
  const ranked = jobSkills
    .map((js) => {
      const user = userSkills[js.skillId] ?? 0;
      const gap = Math.max(0, 100 - user);
      const score = gap * (js.weight || 1);
      return { ...js, gap, score };
    })
    .filter((r) => r.gap > 10)
    .sort((a, b) => b.score - a.score);

  const limited = ranked.slice(0, maxMissions);

  const missions: MissionOutput[] = [];

  limited.forEach((r) => {
    const category = getCategory(r.skillId);
    const templates = TEMPLATES[category];
    if (!templates || templates.length === 0) return;

    const tmpl = pick(templates);
    const stack = STACKS[category];

    const description = tmpl.body
      .replace(/{{domain}}/g, domain)
      .replace(/{{stack}}/g, stack);

    missions.push({
      skillId: r.skillId,
      title: tmpl.title,
      description,
    });
  });

  return missions;
}
