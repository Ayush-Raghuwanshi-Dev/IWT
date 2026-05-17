import csv
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def read_csv_numeric(file_path):
    with open(file_path, "r", newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        rows = list(reader)

    if not rows:
        raise ValueError("CSV is empty.")

    header = rows[0]
    data_rows = rows[1:] if len(rows) > 1 else []

    numeric_cols = []
    for col_index in range(len(header)):
        values = []
        for row in data_rows:
            if col_index >= len(row):
                continue
            try:
                values.append(float(row[col_index]))
            except ValueError:
                values = []
                break
        if values:
            numeric_cols.append((header[col_index] or f"Column {col_index+1}", values))

    if not numeric_cols:
        raise ValueError("CSV has no numeric columns to plot.")

    if len(numeric_cols) == 1:
        label, values = numeric_cols[0]
        return list(range(1, len(values) + 1)), values, "Index", label

    x_label, x_values = numeric_cols[0]
    y_label, y_values = numeric_cols[1]
    return x_values, y_values, x_label, y_label


def main():
    if len(sys.argv) < 3:
        raise SystemExit("Usage: graph.py <input_csv> <output_image>")

    input_csv = Path(sys.argv[1])
    output_image = Path(sys.argv[2])

    x_vals, y_vals, x_label, y_label = read_csv_numeric(input_csv)

    plt.figure(figsize=(8, 4.5))
    plt.plot(x_vals, y_vals, marker="o", color="#2f6fe4")
    plt.title(f"Graph for {input_csv.stem}")
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.grid(True, linestyle="--", alpha=0.4)
    plt.tight_layout()
    plt.savefig(output_image, format="jpeg", dpi=150)


if __name__ == "__main__":
    main()
