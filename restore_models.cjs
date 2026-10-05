const fs = require('fs');
let code = fs.readFileSync('geminiService.ts', 'utf8');
code = code.replace(/model: ['"]gemini-2.5-flash['"]/g, 'model: "gemini-3.1-pro-preview"');
// Let's restore 2.5-pro for lines 1834 and 2102 manually or just use 3.1-pro-preview everywhere as it works. Using 3.1-pro-preview for all might be fine or I can just be precise.
fs.writeFileSync('geminiService.ts', code);
