const generateButton = document.getElementById("generate");
const story = document.getElementById("story");
const customName = document.getElementById("customName");

const storyText =
  "It was 94 fahrenheit outside, so Bob went for a walk. When they got to :insertx:, they stared in horror for a few moments, then :inserty:. Bob saw the whole thing, but was not surprised — :insertz: weighs 300 pounds, and it was a hot day.";

const insertX = [
  "the moon mall",
  "the noodle castle",
  "the cosmic pet store",
];

const insertY = [
  "danced with a swarm of sparrows",
  "melted into a puddle of glitter",
  "moonwalked into a giant cupcake",
];

const insertZ = [
  "a cheerful penguin",
  "a tiny dragon",
  "an overexcited robot",
];

const randomValueFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const toCelsius = (fahrenheit) => {
  return Math.round(((fahrenheit - 32) * 5) / 9);
};

const toStone = (pounds) => {
  return Math.round(pounds / 14);
};

generateButton.addEventListener("click", () => {
  const itemX = randomValueFromArray(insertX);
  const itemY = randomValueFromArray(insertY);
  const itemZ = randomValueFromArray(insertZ);

  let newStory = storyText
    .replace(":insertx:", itemX)
    .replace(":inserty:", itemY)
    .replace(":insertz:", itemZ);

  const nameValue = customName.value.trim();
  if (nameValue !== "") {
    newStory = newStory.replaceAll("Bob", nameValue);
  }

  const units = document.querySelector("input[name='units']:checked").value;
  if (units === "uk") {
    const ukTemp = `${toCelsius(94)} centigrade`;
    const ukWeight = `${toStone(300)} stone`;
    newStory = newStory
      .replace("94 fahrenheit", ukTemp)
      .replace("300 pounds", ukWeight);
  }

  story.textContent = newStory;
});
