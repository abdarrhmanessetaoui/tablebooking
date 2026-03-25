const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove hover state hooks
    content = content.replace(/const\s+\[hov[A-Za-z0-9_]*,\s+setHov[A-Za-z0-9_]*\]\s*=\s*useState\([^)]*\);?/g, '');

    // Remove onMouseEnter and onMouseLeave props
    content = content.replace(/\s*onMouseEnter=\{[^}]+\}/g, '');
    content = content.replace(/\s*onMouseLeave=\{[^}]+\}/g, '');

    // Replace css transitions
    content = content.replace(/transition:\s*['"`][^'"`]+['"`],?/g, '');
    content = content.replace(/transition\s*:\s*[^;]+;/g, '');

    // Replace the ternary hov ? A : B
    // We aggressively match hov ternaries to capture the true branch
    content = content.replace(/hov[a-zA-Z0-9_]*\s*\?\s*([^:\n]+)\s*:\s*([^,}\)\n]+(?:\([^)]*\))?[^,}\)\n]*)/g, (match, p1) => {
      // Return the A (true) branch, carefully trimmed
      return p1.trim();
    });

    // Remove CSS :hover blocks (in .styles.js and .css)
    content = content.replace(/\.[a-zA-Z0-9_-]+:hover(?::not\([^)]*\))?\s*\{[^}]+\}/g, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});

console.log('done script');
