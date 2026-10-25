import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'data', 'destinations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /\/assets\/destinations\/([^'"]+)\.(png|jpg)/g;
const matchCount = (content.match(regex) || []).length;
console.log(`Found ${matchCount} destination image paths to convert to .webp`);

content = content.replace(regex, '/assets/destinations/$1.webp');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated destinations.ts to WebP format');
