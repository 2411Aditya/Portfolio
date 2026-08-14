const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfPath = path.join(__dirname, '../public/RESUME11.pdf');
const dataBuffer = fs.readFileSync(pdfPath);
const parser = new pdf.PDFParse(new Uint8Array(dataBuffer));

parser.getText().then(result => {
  const text = typeof result === 'string' ? result : (result.text || (result.pages && result.pages[0] ? result.pages[0].text : ''));
  fs.writeFileSync(path.join(__dirname, '../src/data/rawPdfText.txt'), text, 'utf8');
  console.log("Saved raw text to src/data/rawPdfText.txt");
});
