const express = require('express');
const path = require('path');
const fs = require('fs');
const { createWorkbookFromJson } = require('./utils/excelGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Excel report generator: GET /download-report-xlsx');
});

app.get('/download-report-xlsx', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'testData.json');
    if (!fs.existsSync(dataPath)) {
      return res.status(500).send('testData.json not found in /data');
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    const workbook = await createWorkbookFromJson(data);

    // send workbook as buffer
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="shift-report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Failed to generate excel:', err);
    res.status(500).send('Failed to generate excel');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Download endpoint: http://localhost:${PORT}/download-report-xlsx`);
});
