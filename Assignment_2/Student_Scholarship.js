// Student Scholarship Eligibility
// Inputs
const marksPercent = 88; // change as needed
const attendancePercent = 78; // change as needed

let scholarshipStatus = "No scholarship";

if (marksPercent > 85 && attendancePercent > 75) {
  scholarshipStatus = "Full scholarship";
} else if (marksPercent >= 70 && marksPercent <= 85) {
  scholarshipStatus = "50% scholarship";
}

console.log("Scholarship status:", scholarshipStatus);
