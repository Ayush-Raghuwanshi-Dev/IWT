const form = document.getElementById("converter");
const celsiusInput = document.getElementById("celsius");
const result = document.getElementById("result");

const formatFahrenheit = (value) => {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}°F`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const celsius = Number(celsiusInput.value);

  if (Number.isNaN(celsius) || celsiusInput.value.trim() === "") {
    result.textContent = "Enter a valid number.";
    return;
  }

  const fahrenheit = celsius * 1.8 + 32;
  result.textContent = formatFahrenheit(fahrenheit);
});
