
#  Excel Shift Report Generator (Node.js + Express + ExcelJS)

This backend project generates a **fully-styled Excel report** (single sheet) using **JSON test data**.  
The output Excel file looks similar to a formatted manufacturing/production report (like the screenshot you provided), including:

- Section titles (Batches, Cylinders, Quality, Abatement, Calciners)
- Colored header rows (orange)
- Green/red cell coloring based on values
- Auto-adjusted column widths
- Borders
- Center-aligned data cells
- Stacked sections on a **single worksheet**
- Download via a simple GET request

Everything is generated **automatically** — no manual column resizing or formatting needed.

---

#  Features

- Backend-only Excel generation  
- Dynamic data from JSON  
- Styled columns and rows  
- Auto column width  
- Auto borders  
- Conditional color fill  
- Easy GET API to download the Excel  
- Configurable via simple JSON file  
- Zero frontend, no templates, no manual work  

---

#  Project Structure

```

excel-report-backend/
├── data/
│   └── testData.json             # Your JSON test data lives here
├── utils/
│   └── excelGenerator.js         # Core Excel generation + styling
├── server.js                     # Express server + download route
└── package.json

````

---

#  Installation

1. Clone the repository:
```bash
git clone <your-repo-link>
cd excel-report-backend
````

2. Install dependencies:

```bash
npm install
```

---

#  Running the Server

Start the server:

```bash
node server.js
```

Server will run at:

```
http://localhost:3000/
```

---

#  Download the Excel Report

Open this link in a browser:

```
localhost
```

This will automatically download:

```
shift-report.xlsx
```

Open the file in Excel — you will see a fully formatted report based on your JSON.

---

#  Working With Test Data

The project reads data from:

```
/data/testData.json

```

This file contains a JSON structure like:

```json
{
  "reportTitle": "Shift Report : Morning (2025-11-21)",
  "sections": [
    {
      "key": "Batches",
      "columns": ["Mixers", "Target", "Actual", "Morning", "Afternoon", "Night"],
      "rows": [
        { "Mixers": "Mixer01", "Target": 10, "Actual": 4, "Morning": 4, "Afternoon": 0, "Night": 0 }
      ]
    }
  ]
}
```

---

#  How New Users Should Modify the Test Data

###  Add or remove sections

Just add/remove objects inside the `"sections"` array.

Example:

```json
{
  "key": "Quality",
  "columns": [...],
  "rows": [...]
}
```

###  Add or remove columns

Edit `"columns"` array directly.

###  Add new rows

Add more objects inside `"rows"`.

###  Column names must match JSON keys

If a column name differs in spacing/case (e.g., "Day Pollution" vs "daypollution"),
the backend auto-matches it by ignoring spaces & case.

###  No need to format or align anything

ExcelJS automatically:

* sets column width based on content
* centers all data
* adds borders
* adds colors
* creates section titles & spacing

You only modify JSON — the backend does the formatting.

---

#  Styling Rules (Important for New Users)

You can control styling by editing `utils/excelGenerator.js`.

### **1. Center alignment**

Already enabled globally:

```js
cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
```

### **2. Header color (orange)**

```js
fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9900' } }
```

### **3. Green and Red fills**

```js
greenFill = { argb: 'FFBFFFC6' }   # light green
redFill   = { argb: 'FFFFB3B3' }   # light red
```

### **4. Conditional formatting (editable)**

Current rules:

* If `"Actual"` < `"Target"` → red
* If `"Morning/Evening/Night"` > 0 → green
* If `"Day Pollution"` > 1000 → red

You can add more.

---

#  How to Integrate Your Own Real Data

If your real system provides JSON from a database or API:

1. Replace reading from file:

```js
const data = JSON.parse(raw);
```

2. With:

```js
const data = yourDynamicData; 
```

Or convert POST JSON into Excel:

```js
app.post("/report", (req, res) => {
  const data = req.body;
});
```

---
