const express = require("express");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 2500;

// ------------------------
// Hardcoded Battery Data
// ------------------------

const metaInfo = [
 ["COMPUTER NAME", "NILESH-LAPTOP"],
  ["SYSTEM PRODUCT NAME", "Acer Swift SF314-71"],
  ["BIOS", "V1.09 03/12/2024"],
  ["OS BUILD", "26120.1.amd64fre.windows_release.240910-1435"],
  ["PLATFORM ROLE", "Mobile"],
  ["CONNECTED STANDBY", "Supported"],
  ["REPORT TIME", "2025-11-22 04:18:33"],
];

const batteryInfo = [
  ["NAME", "AP18E7M"],
  ["MANUFACTURER", "SMP KT00407017"],
  ["SERIAL NUMBER", "BATT12345"],
  ["CHEMISTRY", "Li-ion"],
  ["DESIGN CAPACITY", "58,760 mWh"],
  ["FULL CHARGE CAPACITY", "49,020 mWh"],
  ["CYCLE COUNT", "534"],
];

// --------------------------------------------------
// GET /download-report  → sends PDF
// --------------------------------------------------

// check 

app.get("/", (req, res) =>{
res.send("Hello message from backend : CLick here for download the PDF Report http://localhost:2500/download-report")
});

app.get("/download-report", async (req, res) => {
  // load template
  let html = fs.readFileSync(path.join(__dirname, "templates/report.html"), "utf-8");

  // insert dynamic meta rows
  const metaRows = metaInfo
    .map(([label, value]) => 
      `<tr><td class="label">${label}</td><td class="value">${value}</td></tr>`
    )
    .join("");

  // insert dynamic battery rows
  const batteryRows = batteryInfo
    .map(([label, value]) => 
      `<tr><td class="label">${label}</td><td class="value">${value}</td></tr>`
    )
    .join("");

  // replace placeholders
  html = html
    .replace("{{META_ROWS}}", metaRows)
    .replace("{{BATTERY_ROWS}}", batteryRows)
    .replace("{{HEADER_TIME}}", new Date().toLocaleString());

  // launch headless chrome
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // generate PDF buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
  });

  await browser.close();

  // Send the PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=battery-report.pdf");
  res.send(pdfBuffer);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}/download-report`);
});
