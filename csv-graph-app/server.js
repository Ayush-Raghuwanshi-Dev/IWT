const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 3002;

const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "outputs");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const name = `${base}-${Date.now()}.csv`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      return cb(new Error("Only CSV files are allowed."));
    }
    return cb(null, true);
  },
});

app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("csv"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  const inputPath = req.file.path;
  const outputName = `${path.parse(req.file.filename).name}.jpeg`;
  const outputPath = path.join(outputDir, outputName);

  const pythonScript = path.join(__dirname, "python", "graph.py");
  const python = spawn("python", [pythonScript, inputPath, outputPath]);

  let errorMessage = "";
  python.stderr.on("data", (data) => {
    errorMessage += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: errorMessage || "Graph generation failed." });
    }
    return res.sendFile(outputPath);
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  return next();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
