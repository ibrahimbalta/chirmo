const fs = require('fs');
const b64 = fs.readFileSync('public/cogko-icon.png').toString('base64');
let html = fs.readFileSync('index.html', 'utf8');
const regex = /href="data:image\/png;base64,[^"]+"/;
html = html.replace(regex, 'href="data:image/png;base64,' + b64 + '"');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html tab icon with cogko-icon!');
