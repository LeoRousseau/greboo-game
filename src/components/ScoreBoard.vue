<template>
  <div class="score-table">
    <button class="close-btn" @click="onClose?.()">✕</button>
    <h2>🏆 Scoreboard 🏆</h2>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in topScores" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.score }}</td>
          <td>{{ item.date.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getTopScores } from "../scoreboard";

const topScores = ref<{ name: string; score: number; date: Date }[]>([]);
const props = defineProps<{
  onClose?: () => void;
}>();

const { onClose } = props;

onMounted(async () => {
  const scores = await getTopScores();

  const formatedScores = scores.map((s) => ({
    name: s.name,
    score: s.score,
    date: new Date(s.date),
  }));

  topScores.value = formatedScores.slice(0, 10);
});
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;

  background: #555555;
  border-radius: 50%;
  border: none;

  font-size: 18px;
  font-weight: 600;
  color: #777;

  cursor: pointer;
  padding: 4px;
  line-height: 1;

  transition: 0.2s ease;
}

.close-btn:hover {
  color: #000;
  transform: scale(1.15);
}

.score-table {
  position: relative;
  width: 600px;
  margin: 20px auto;
  padding: 16px;
  border-radius: 12px;
  background: #383838;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  text-align: center;
}

.score-table h2 {
  margin-top: 40px;
  margin-bottom: 40px;
  font-size: 30px;
  font-weight: 600;
  color: #ffea00;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  border-spacing: 30px 0;
}

thead tr {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

th {
  padding: 10px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  font-size: 12px;
  padding-left: 20px;
  padding-right: 20px;
}

tbody tr:nth-child(even) {
  background: #5e5e5e;
}

td {
  padding: 10px;
  color: #d8d8d8;
}

tbody tr:hover {
  background: #2e2e2e;
  cursor: pointer;
  transition: 0.2s;
}
</style>
