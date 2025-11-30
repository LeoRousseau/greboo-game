import { supabase } from "./supabase";

export async function addScore(name: string, score: number) {
  const { data, error } = await supabase.from("scores").insert([{ name, score }]);
  if (error) console.error(error);
  return data;
}

export async function getTopScores() {
  const { data, error } = await supabase.from("scores").select("*").order("score", { ascending: false }).limit(10);
  if (error) console.error(error);
  return data || [];
}
