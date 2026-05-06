import express from "express";

const app = express();

app.use(express.json());

app.get("/random-joke", (_req, res) => {
  res.json({
    joke: getRandomJoke(),
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `App started on port ${PORT}. http://localhost:${PORT}/random-joke`,
  );
});

// helpers
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomJoke() {
  const jokes = [
    "Why was the mobile phone wearing glasses?... Because it lost its contacts.",
    "What was the spider doing on the computer?... He was making a web-site!",
    "What do you call an iPhone that sleeps too much?... Dead Siri-ous.",
    "What did the computer have during his break time?... He had a byte!",
    "What is the computer's favorite snack to eat?... Microchips!",
    "What shoes do computers love the most?... Re-boots!",
    "Why did the computer go to the dentist?... To get his Bluetooth checked.",
    "What is the biggest lie anyone can tell?... I have read and agreed to all the terms and conditions.",
  ];

  const indexOfLastElement = jokes.length - 1;
  
  return jokes.at(getRandomNumber(0, indexOfLastElement));
}