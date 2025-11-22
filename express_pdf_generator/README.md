#  Backend PDF Report Generator (Node.js + Express + Puppeteer)

This backend project generates a **professionally-styled PDF** using pure **HTML + CSS** on the server.  
A simple GET API triggers PDF generation using **Puppeteer**, which renders your HTML like a real browser and exports it as a high-quality PDF.

This project is designed for:
- System reports  
- Battery reports  
- Device status reports  
- Any backend-only PDF creation  
- Automation tasks (cron-based or on-demand reports)

---

#  Features

- Backend-only PDF generation  
- Pure HTML + CSS layout  
- No frontend required  
- Clean and professional layout  
- Auto timestamp  
- Preloaded test data (battery info)  
- Easy GET endpoint to download PDF  
- Fully customizable HTML & CSS  
- Uses Puppeteer for accurate rendering  

---

#  Project Structure

```

battery-report-backend/
├── templates/
│   └── report.html              # HTML template (with inline CSS)
├── server.js                    # Express server + PDF generation route
└── package.json

````

---

#  Installation

1. Clone the repository:
```bash
git clone <your-repo-link>
cd battery-report-backend
````

2. Install required packages:

```bash
npm install
```

Puppeteer will automatically download Chromium (used to render the PDF).

---

#  Run the Server

Start the backend:

```bash
node server.js
```

Your server runs

---

#  Test Data (Battery Information)

The PDF is generated using backend test data defined in `server.js`, such as:

```js
const metaInfo = [
  ["COMPUTER NAME", "NILESH-LAPTOP"],
  ["SYSTEM PRODUCT NAME", "Acer Swift SF314-71"],
  ["BIOS", "V1.09 03/12/2024"],
  ["OS BUILD", "26120.1.amd64fre.windows_release.240910-1435"],
  ["PLATFORM ROLE", "Mobile"],
  ["CONNECTED STANDBY", "Supported"],
  ["REPORT TIME", "2025-11-22 04:18:33"]
];

const batteryInfo = [
  ["NAME", "AP18E7M"],
  ["MANUFACTURER", "SMP KT00407017"],
  ["SERIAL NUMBER", "BATT12345"],
  ["CHEMISTRY", "Li-ion"],
  ["DESIGN CAPACITY", "58,760 mWh"],
  ["FULL CHARGE CAPACITY", "49,020 mWh"],
  ["CYCLE COUNT", "534"]
];
```

You can replace these arrays with:

* API data
* Database values
* Dynamic readings
* File-based JSON
* User input

Just update the variables and regenerate the PDF.

---

#  Customizing the PDF Layout

All styling is inside:

```
templates/report.html
```

You can edit everything:

* Colors
* Fonts
* Table layout
* Section titles
* Borders
* Margins
* Page size

Puppeteer renders HTML exactly like Chrome → the PDF always looks identical to what you style.

---

#  How New Users Should Work With This Project

###  1. Modify template

Open:

```
templates/report.html
```

Edit the HTML/CSS directly (structure or styling).

###  2. Modify test data

Open:

```
server.js
```

Update variables like `metaInfo` and `batteryInfo`.

###  3. Generate the PDF

Use the GET endpoint:

```
/download-report
```

###  4. Add new sections

Just add new HTML table sections into `report.html` and supply dynamic values.

###  5. No need to touch Puppeteer

Leave the `page.pdf()` settings unless you want:

* landscape mode
* different margins
* different page size

---

