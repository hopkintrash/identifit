/**
 * Fix absolute paths in demo/app/index.html so the app loads when served from a subdirectory.
 * Expo outputs /favicon.ico and /_expo/... which break when the app is at /app/
 */
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../demo/app/index.html');
if (!fs.existsSync(indexPath)) {
  console.warn('demo/app/index.html not found, skipping path fix');
  process.exit(0);
}

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/href="\/favicon/g, 'href="./favicon');
html = html.replace(/src="\/_expo/g, 'src="./_expo');
fs.writeFileSync(indexPath, html);
console.log('Fixed demo app paths for subdirectory serving');
