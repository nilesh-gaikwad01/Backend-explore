const ExcelJS = require('exceljs');

/**
 * createWorkbookFromJson(data)
 * data: { reportTitle, sections: [ { key, columns, rows } ] }
 * returns an ExcelJS Workbook
 */

async function createWorkbookFromJson(data) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Report', {
    views: [{ state: 'normal', showGridLines: false }]
  });

  const ORANGE = 'FFB23E00'.slice(0, 8); // fallback hex (we'll use fills with hex)
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9900' } }; // orange
  const redFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFB3B3' } }; // light red
  const greenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFFFC6' } }; // light green

  const thinBorder = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // row index pointer

  let rowIndex = 1;

  // Title row (merged)

  ws.mergeCells(rowIndex, 1, rowIndex, 12);
  const titleCell = ws.getCell(rowIndex, 1);
  titleCell.value = data.reportTitle || 'Report';
  titleCell.font = { size: 18, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  rowIndex += 2; // leave one blank row after title

  // iterate sections

  for (const section of data.sections) {
    // Section title row
    ws.getRow(rowIndex).height = 22;
    const titleCell = ws.getCell(rowIndex, 1);
    titleCell.value = section.key;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    rowIndex++;

    // Header row

    const headerRow = ws.getRow(rowIndex);
    const columns = section.columns;
    for (let c = 0; c < columns.length; c++) {
      const cell = headerRow.getCell(c + 1);
      cell.value = columns[c];
      cell.font = { bold: true };
      cell.fill = headerFill;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = thinBorder;
    }
    headerRow.height = 20;
    rowIndex++;

    // Data rows

    for (const r of section.rows) {
      const row = ws.getRow(rowIndex);
      for (let c = 0; c < section.columns.length; c++) {
        const colName = section.columns[c];
        const cell = row.getCell(c + 1);
        // in JSON keys might differ in case; try exact key, else look for a matching key ignoring case or spaces
        let value = r[colName];
        if (value === undefined) {
          // fallback: try case-insensitive match
          const keys = Object.keys(r);
          const found = keys.find(k => k.toLowerCase().replace(/\s/g,'') === colName.toLowerCase().replace(/\s/g,''));
          if (found) value = r[found];
        }

        cell.value = (value === undefined || value === null) ? '' : value;
        cell.alignment = { vertical: 'middle', horizontal: "center", wrapText: true };
        cell.border = thinBorder;

        // Conditional coloring rules (simple heuristics)
        // If column "Actual" and there is a "Target", color green if Actual >= Target else red
        if (colName.toLowerCase() === 'actual') {
          const targetVal = r['Target'] !== undefined ? r['Target'] : r['target'] !== undefined ? r['target'] : null;
          if (typeof targetVal === 'number' && typeof value === 'number') {
            if (value >= targetVal) {
              cell.fill = greenFill;
            } else {
              cell.fill = redFill;
            }
          }
        }

        // For "Morning","Afternoon","Night" columns: color if >0 (green) or if below target highlight red (if target exists)
        if (['morning','afternoon','night'].includes(colName.toLowerCase())) {
          if (value !== '' && value !== null && value !== 0) {
            // if numeric and equals target? we won't apply complex logic here; color green when >0
            cell.fill = typeof value === 'number' && value > 0 ? greenFill : greenFill;
          }
        }

        // For parameters like "Daily" or "Day Pollution" we can highlight big numbers as red (example threshold)
        if (['day pollution','daily'].includes(colName.toLowerCase())) {
          if (typeof value === 'number' && value > 1000) {
            cell.fill = redFill;
          }
        }
      }
      row.height = 18;
      rowIndex++;
    }

    // Add one blank row between sections
    rowIndex++;
  }

  // Auto-size columns: determine max width per used column (up to 20 columns)
  const maxCols = 30;
  for (let c = 1; c <= maxCols; c++) {
    let maxLength = 10;
    ws.eachRow(r => {
      const cell = r.getCell(c);
      if (cell && cell.value) {
        const text = (cell.value && typeof cell.value === 'object' && cell.value.richText) ? cell.value.richText.map(t=>t.text).join('') : String(cell.value);
        if (text.length > maxLength) maxLength = Math.min(60, text.length);
      }
    });
    if (maxLength > 0) ws.getColumn(c).width = Math.min(60, maxLength + 2);
  }

  return wb;
}

module.exports = { createWorkbookFromJson };
