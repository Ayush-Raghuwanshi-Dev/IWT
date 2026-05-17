# CSV Graph Generator

Upload a CSV file, generate a graph with Python, and receive the image back from the server.

## Features
- CSV upload with server-side validation
- Python script parses numeric columns and plots a line chart
- Output image saved as JPEG and returned in the response

## Requirements
- Node.js and npm
- Python 3 with `matplotlib`

## Setup
1. Install Node dependencies:
```
npm install
```
2. Install Python dependency:
```
pip install -r requirements.txt
```
3. Start the server:
```
npm start
```
4. Open `http://localhost:3002` and upload a CSV.

## Notes
- The app saves uploads in `uploads/` and images in `outputs/`.
- If the CSV has only one numeric column, the x-axis uses row index.
