// generate_excel.js — Exports test cases to styled Excel file
const ExcelJS = require('exceljs');
const fs = require('fs');

async function generateExcel() {
  const testCases = JSON.parse(fs.readFileSync('test_cases.json', 'utf-8'));
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'VWO RAG System';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('VWO Regression Test Cases', {
    properties: { tabColor: { argb: '4472C4' } }
  });

  // Define columns
  sheet.columns = [
    { header: 'Test Case ID', key: 'id', width: 14 },
    { header: 'Module', key: 'module', width: 28 },
    { header: 'Test Case Title', key: 'title', width: 40 },
    { header: 'Preconditions', key: 'preconditions', width: 38 },
    { header: 'Test Steps', key: 'steps', width: 50 },
    { header: 'Expected Result', key: 'expectedResult', width: 45 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Type', key: 'type', width: 14 }
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11, name: 'Calibri' };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5496' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  headerRow.height = 30;
  headerRow.border = {
    bottom: { style: 'medium', color: { argb: '1F3864' } }
  };

  // Add data rows
  testCases.forEach((tc, idx) => {
    const row = sheet.addRow({
      id: tc.id,
      module: tc.module,
      title: tc.title,
      preconditions: tc.preconditions,
      steps: tc.steps,
      expectedResult: tc.expectedResult,
      priority: tc.priority,
      type: tc.type
    });

    // Alternating row colors
    const fillColor = idx % 2 === 0 ? 'F2F7FB' : 'FFFFFF';
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    row.alignment = { vertical: 'top', wrapText: true };
    row.height = 60;

    // Color-code priority
    const priorityCell = row.getCell('priority');
    if (tc.priority === 'High') {
      priorityCell.font = { bold: true, color: { argb: 'CC0000' } };
    } else if (tc.priority === 'Medium') {
      priorityCell.font = { bold: true, color: { argb: 'E67300' } };
    } else {
      priorityCell.font = { bold: true, color: { argb: '008000' } };
    }

    // Border all cells
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'D9E2F3' } },
        bottom: { style: 'thin', color: { argb: 'D9E2F3' } },
        left: { style: 'thin', color: { argb: 'D9E2F3' } },
        right: { style: 'thin', color: { argb: 'D9E2F3' } }
      };
    });
  });

  // Freeze header row
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Auto-filter
  sheet.autoFilter = { from: 'A1', to: 'H1' };

  await workbook.xlsx.writeFile('VWO_Regression_Test_Cases.xlsx');
  console.log(`Excel file created: VWO_Regression_Test_Cases.xlsx (${testCases.length} test cases)`);
}

generateExcel().catch(console.error);
