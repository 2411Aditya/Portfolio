const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfPath = path.join(__dirname, '../public/RESUME11.pdf');

if (fs.existsSync(pdfPath)) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new pdf.PDFParse(new Uint8Array(dataBuffer));
  parser.getText().then(text => {
    console.log("=== Successfully Parsed RESUME11.pdf ===");
    console.log("Result object:", text);
  }).catch(err => {
    console.error("Error extracting text:", err);
  });
} else {
  console.log("public/RESUME11.pdf does not exist.");
}
