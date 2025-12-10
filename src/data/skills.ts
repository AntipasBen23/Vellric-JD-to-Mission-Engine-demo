// frontend/src/data/skills.ts

export type SkillId =
  | "react"
  | "nextjs"
  | "typescript"
  | "javascript"
  | "node"
  | "go"
  | "python"
  | "sql"
  | "postgres"
  | "mongodb"
  | "docker"
  | "kubernetes"
  | "aws"
  | "gcp"
  | "azure"
  | "communication"
  | "product"
  | "leadership";

export type Skill = {
  id: SkillId;
  label: string;
  category: "frontend" | "backend" | "data" | "infra" | "soft";
  keywords: string[];
};

export const SKILLS: Skill[] = [
  {
    id: "react",
    label: "React",
    category: "frontend",
    keywords: ["react", "react.js", "reactjs"],
  },
  {
    id: "nextjs",
    label: "Next.js",
    category: "frontend",
    keywords: ["next.js", "nextjs", "next js"],
  },
  {
    id: "typescript",
    label: "TypeScript",
    category: "frontend",
    keywords: ["typescript", "ts"],
  },
  {
    id: "javascript",
    label: "JavaScript",
    category: "frontend",
    keywords: ["javascript", "js", "es6"],
  },
  {
    id: "node",
    label: "Node.js",
    category: "backend",
    keywords: ["node", "node.js", "nodejs"],
  },
  {
    id: "go",
    label: "Go",
    category: "backend",
    keywords: ["go", "golang"],
  },
  {
    id: "python",
    label: "Python",
    category: "backend",
    keywords: ["python"],
  },
  {
    id: "sql",
    label: "SQL & analytics",
    category: "data",
    keywords: ["sql", "analytics", "data analysis", "query", "queries"],
  },
  {
    id: "postgres",
    label: "Postgres",
    category: "data",
    keywords: ["postgres", "postgresql"],
  },
  {
    id: "mongodb",
    label: "MongoDB",
    category: "data",
    keywords: ["mongodb", "mongo"],
  },
  {
    id: "docker",
    label: "Docker",
    category: "infra",
    keywords: ["docker", "containers"],
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    category: "infra",
    keywords: ["kubernetes", "k8s", "clusters"],
  },
  {
    id: "aws",
    label: "AWS",
    category: "infra",
    keywords: ["aws", "amazon web services"],
  },
  {
    id: "gcp",
    label: "GCP",
    category: "infra",
    keywords: ["gcp", "google cloud"],
  },
  {
    id: "azure",
    label: "Azure",
    category: "infra",
    keywords: ["azure", "microsoft azure"],
  },
  {
    id: "communication",
    label: "Communication",
    category: "soft",
    keywords: ["communication", "stakeholder", "present", "presentation"],
  },
  {
    id: "product",
    label: "Product thinking",
    category: "soft",
    keywords: ["product", "roadmap", "ux", "user research", "discovery"],
  },
  {
    id: "leadership",
    label: "Leadership",
    category: "soft",
    keywords: ["leadership", "mentoring", "leading", "manager"],
  },
];

export function findSkillsInText(text: string): { skillId: SkillId; count: number }[] {
  const lower = text.toLowerCase();
  const results: { skillId: SkillId; count: number }[] = [];

  SKILLS.forEach((skill) => {
    let count = 0;
    skill.keywords.forEach((kw) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "g");
      const matches = lower.match(regex);
      if (matches) count += matches.length;
    });

    if (count > 0) {
      results.push({ skillId: skill.id, count });
    }
  });

  return results;
}
