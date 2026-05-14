const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const content = fs.readFileSync('src/app/teacher/profile/page.tsx', 'utf8');
try {
  acorn.Parser.extend(jsx()).parse(content, { ecmaVersion: 2020, sourceType: 'module' });
  console.log('Success: No syntax errors found.');
} catch (e) {
  console.error('Syntax Error found:');
  console.error(e.message);
  console.error('At location:', e.loc);
}
