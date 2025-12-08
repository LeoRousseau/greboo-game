export function computeScore(timeMs: number, pinecones: number, hp: number): number {
  const fiveMinutesMs = 5 * 60 * 1000;
  const timeScore = Math.max(0, fiveMinutesMs - timeMs) / 100; // Max 3000 points for time
  const pineconeScore = pinecones * 100; // 100 points per pinecone collected
  return Math.floor((timeScore + pineconeScore) * hp); // Multiply by remaining HP
}
