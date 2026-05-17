const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");
const keys = document.querySelector(".keys");

let current = "0";
let previous = null;
let operator = null;
let awaitingNew = false;

const formatNumber = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "Error";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
  }).format(num);
};

const updateDisplay = () => {
  const exprParts = [];
  if (previous !== null) exprParts.push(previous);
  if (operator) exprParts.push(operator);
  expressionEl.textContent = exprParts.length ? exprParts.join(" ") : current;
  resultEl.textContent = formatNumber(current);
};

const setStatus = (text) => {
  statusEl.textContent = text;
};

const compute = (a, b, op) => {
  const first = Number(a);
  const second = Number(b);
  if (!Number.isFinite(first) || !Number.isFinite(second)) return "Error";

  switch (op) {
    case "+":
      return String(first + second);
    case "-":
      return String(first - second);
    case "*":
      return String(first * second);
    case "/":
      return second === 0 ? "Error" : String(first / second);
    default:
      return String(second);
  }
};

const handleDigit = (value) => {
  if (awaitingNew) {
    current = value;
    awaitingNew = false;
  } else {
    current = current === "0" ? value : current + value;
  }
  setStatus("Typing");
  updateDisplay();
};

const handleDecimal = () => {
  if (awaitingNew) {
    current = "0.";
    awaitingNew = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  setStatus("Typing");
  updateDisplay();
};

const handleOperator = (nextOperator) => {
  if (operator && !awaitingNew) {
    current = compute(previous, current, operator);
  }

  previous = current;
  operator = nextOperator;
  awaitingNew = true;
  setStatus("Operator set");
  updateDisplay();
};

const handleEquals = () => {
  if (!operator || awaitingNew) return;

  current = compute(previous, current, operator);
  previous = null;
  operator = null;
  awaitingNew = false;
  setStatus("Result");
  updateDisplay();
};

const handleClear = () => {
  current = "0";
  previous = null;
  operator = null;
  awaitingNew = false;
  setStatus("Cleared");
  updateDisplay();
};

const handleSign = () => {
  if (current === "0") return;
  current = String(Number(current) * -1);
  setStatus("Sign changed");
  updateDisplay();
};

const handlePercent = () => {
  current = String(Number(current) / 100);
  setStatus("Percent");
  updateDisplay();
};

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "digit":
      handleDigit(value);
      break;
    case "decimal":
      handleDecimal();
      break;
    case "operator":
      handleOperator(value);
      break;
    case "equals":
      handleEquals();
      break;
    case "clear":
      handleClear();
      break;
    case "sign":
      handleSign();
      break;
    case "percent":
      handlePercent();
      break;
    default:
      break;
  }
});

window.addEventListener("keydown", (event) => {
  const { key } = event;
  if (/\d/.test(key)) return handleDigit(key);
  if (key === ".") return handleDecimal();
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    return handleOperator(key);
  }
  if (key === "Enter" || key === "=") return handleEquals();
  if (key === "Escape") return handleClear();
  return undefined;
});

updateDisplay();
