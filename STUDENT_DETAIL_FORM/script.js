const form = document.getElementById("studentForm");
const result = document.getElementById("result");

const outName = document.getElementById("outName");
const outRoll = document.getElementById("outRoll");
const outEmail = document.getElementById("outEmail");
const outDepartment = document.getElementById("outDepartment");
const outYear = document.getElementById("outYear");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const roll = formData.get("roll").trim();
  const email = formData.get("email").trim();
  const department = formData.get("department").trim();
  const year = formData.get("year");

  if (!name || !roll || !email || !department || !year) {
    result.hidden = false;
    result.querySelector(".result__title").textContent =
      "Please fill in all fields.";
    outName.textContent = "-";
    outRoll.textContent = "-";
    outEmail.textContent = "-";
    outDepartment.textContent = "-";
    outYear.textContent = "-";
    return;
  }

  result.hidden = false;
  result.querySelector(".result__title").textContent = "Student Details";
  outName.textContent = name;
  outRoll.textContent = roll;
  outEmail.textContent = email;
  outDepartment.textContent = department;
  outYear.textContent = `${year} Year`;
});
