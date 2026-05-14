const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcDir = path.join(process.cwd(), 'src');
const files = getFiles(srcDir);

const missing = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('logout()')) {
    if (!content.includes('const {') || !content.includes('logout')) {
       // Check if it's imported from elsewhere?
       if (!content.includes('import { logout }')) {
          missing.push(file);
       }
    }
  }
}

console.log('Files missing logout:');
missing.forEach(m => console.log(m));
