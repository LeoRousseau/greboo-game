const API = "http://localhost:3000";

export function getScores(): Promise<{ name: string; score: number; date: string }[]> {
  console.log(`${API}/scores`);
  return fetch(`${API}/scores`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  }).then((r) => r.json());
}

export function setScores(name: string, score: number) {
  return fetch(`${API}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score, date: new Date().toISOString() }),
  });
}
