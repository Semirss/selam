const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir('./src', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Colors
    content = content.replace(/bg-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]/g, 'bg-$1');
    content = content.replace(/text-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]/g, 'text-$1');
    content = content.replace(/border-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]/g, 'border-$1');
    content = content.replace(/(border-[a-z])-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]/g, '$1-$2');
    content = content.replace(/ring-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]/g, 'ring-$1');
    content = content.replace(/shadow-\[var\(--(shadow-sm|shadow-md|shadow-lg)\)\]/g, '$1');
    content = content.replace(/rounded-\[var\(--(radius-sm|radius-md|radius-lg)\)\]/g, 'rounded-$1');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
});

console.log('Done!');
