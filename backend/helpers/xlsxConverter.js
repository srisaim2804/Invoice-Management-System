const xlsx = require('xlsx');

const trimString = (str) => {
  if (typeof str === 'string') {
    return str.trim();
  }
  return str;
};

const convertXlsxToCsv = (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error('No sheets found in the uploaded XLSX file.');
  }

  const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });

  const formattedData = jsonData.map(row => {
    const trimmedRow = Object.keys(row).reduce((acc, key) => {
      acc[key] = trimString(row[key]);
      return acc;
    }, {});

    return trimmedRow;
  });

  const nonEmptyRows = formattedData.filter(row => 
    Object.values(row).some(cell => cell !== null && cell !== "")
  );

  if (nonEmptyRows.length === 0) {
    throw new Error('The uploaded XLSX file contains only empty rows.');
  }

  const filteredSheet = xlsx.utils.json_to_sheet(nonEmptyRows);
  const csvData = xlsx.utils.sheet_to_csv(filteredSheet);
  const base64Data = Buffer.from(csvData, 'utf-8').toString('base64');
  return { csvData, base64Data };
};

module.exports = { convertXlsxToCsv };
