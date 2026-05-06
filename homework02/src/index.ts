import express from "express";

const app = express();
const PORT = 3000;

const answersV1: string[] = ["Yes", "No", "Maybe", "Ask again later"];

const answersV2 = [
  { text: "Yes", confidence: "high" },
  { text: "No", confidence: "high" },
  { text: "Maybe", confidence: "medium" },
  { text: "Ask again later", confidence: "low" },
];

function getRandom<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

app.get("/api/v1/8ball", (_req, res) => {
  const randomAnswer = getRandom(answersV1);
  res.json({
    answer: randomAnswer,
  });
});

app.get("/api/v2/8ball", (_req, res) => {
  const randomData = getRandom(answersV2);
  res.json({
    answer: randomData.text,
    confidence: randomData.confidence,
    timestamp: "2026-04-09T12:00:00.000Z",
  });
});

app.get("/8ball", (_req, res) => {
  res.redirect(302, "/api/v2/8ball");
});

app.listen(PORT, () => {
  console.log(` Server started on port ${PORT} \n http://localhost:${PORT}`);
});
