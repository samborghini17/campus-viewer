const fs = require('fs');
const content = fs.readFileSync('files/assets/274249944/1/level-manager.js', 'utf8');
const id = 'innospin';
const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const regex = new RegExp(`(\\{\\s*id:\\s*['"]${escapedId}['"][\\s\\S]*?collider:\\s*(?:null|'[^']*')[\\s\\S]*?\\},?)`, 'g');
console.log("Match exists:", regex.test(content));
regex.lastIndex = 0;
const match = regex.exec(content);
if (match) {
    console.log("Matched text:\\n", match[0]);
} else {
    console.log("No match found!");
}
