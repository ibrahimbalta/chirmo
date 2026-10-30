const fs = require('fs');
const path = require('path');

const b64Path = path.resolve('scratch/favicon_b64.txt');
const b64 = fs.readFileSync(b64Path, 'utf8').trim();

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldTag = /<link rel="icon"[^>]+>/;
const newTags = [
  '    <link rel="icon" type="image/png" href="data:image/png;base64,' + b64 + '" />',
  '    <link rel="icon" type="image/png" sizes="64x64" href="./favicon.png" />',
  '    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png" />',
  '    <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png" />',
  '    <link rel="shortcut icon" href="./favicon.ico" />',
  '    <link rel="apple-touch-icon" href="./apple-touch-icon.png" />'
].join('\n');

html = html.replace(oldTag, newTags);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with 3D metallic C favicon!');
