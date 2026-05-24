import { portfolio } from "../constants";

export type GithubRepo = {
  name:        string;
  owner:       string;
  description: string | null;
  url:         string;
  homepageUrl: string | null;
  starCount:   number;
  language:    { name: string; color: string } | null;
  topics:      string[];
  pushedAt:    string;
};

function mapNode(node: Record<string, unknown>): GithubRepo {
  return {
    name:        node.name as string,
    owner:       (node.owner as { login: string }).login,
    description: (node.description as string | null) ?? null,
    url:         node.url as string,
    homepageUrl: (node.homepageUrl as string) || null,
    starCount:   node.stargazerCount as number,
    language:    node.primaryLanguage as { name: string; color: string } | null,
    topics: (
      (node.repositoryTopics as { nodes: Array<{ topic: { name: string } }> })
        ?.nodes ?? []
    ).map((n) => n.topic.name),
    pushedAt: node.pushedAt as string,
  };
}

const QUERY = `
  fragment R on Repository {
    name description url homepageUrl stargazerCount pushedAt
    owner { login }
    primaryLanguage { name color }
    repositoryTopics(first: 5) { nodes { topic { name } } }
  }
  {
    user(login: "${portfolio.githubUsername}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes { ... on Repository { ...R } }
      }
      repositories(
        first: 30,
        orderBy: { field: PUSHED_AT, direction: DESC },
        privacy: PUBLIC,
        isFork: false
      ) {
        nodes { ...R }
      }
    }
  }
`;

export async function fetchPublicRepoCount(): Promise<number> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/users/${portfolio.githubUsername}`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return (data.public_repos as number) ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchGithubProjects(): Promise<{
  pinned: GithubRepo[];
  recent: GithubRepo[];
}> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { pinned: [], recent: [] };

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization:  `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return { pinned: [], recent: [] };

  const json = await res.json();
  const user = json?.data?.user;
  if (!user) return { pinned: [], recent: [] };

  const pinned = (user.pinnedItems.nodes as Record<string, unknown>[]).map(mapNode);
  const pinnedNames = new Set(pinned.map((r) => r.name));

  const recent = (user.repositories.nodes as Record<string, unknown>[])
    .filter((n) => !pinnedNames.has(n.name as string))
    .slice(0, 6)
    .map(mapNode);

  return { pinned, recent };
}
