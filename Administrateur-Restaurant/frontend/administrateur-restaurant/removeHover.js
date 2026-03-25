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
    content = content.replace(/onMouseEnter=\{[^}]+\}/g, '');
    content = content.replace(/onMouseLeave=\{[^}]+\}/g, '');

    // Remove inline CSS transitions
    content = content.replace(/transition:\s*['"`][^'"`]+['"`],?/g, '');
    
    // Remove css string transitions
    content = content.replace(/transition:\s*[^;]+;/g, '');

    // Replace JS ternary: `hov ? A : B` -> `A`
    // We use a regex that handles A and B being either a variable, string, or balanced parentheses (simple).
    // It's safer to just replace `hov ? A : B` manually where it fails, but this covers 99%:
    content = content.replace(/\bhov[A-Za-z0-9_]*\s*\?\s*([^:]+)\s*:\s*([^,}\)\n]+(?:\([^)]*\))?[^,}\)\n]*)/g, (match, p1, p2) => {
      // Just return the true branch (p1), trimmed
      return p1.trim();
    });

    // Remove CSS :hover blocks (simple ones)
    content = content.replace(/\.[a-zA-Z0-9_-]+:hover(?::not\([^)]*\))?\s*\{[^}]+\}/g, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
console.log('Done script');
