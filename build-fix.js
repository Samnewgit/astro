// Post-build script to fix Cloudflare Pages worker
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the worker file
const workerPath = path.join(__dirname, 'dist', 'worker.js');

// Content to write
const content = `// Auto-generated worker file for Cloudflare Pages
// This bridges the directory-based worker to a single file

export { default } from './_worker.js/index.js';`;

// Write the file
fs.writeFileSync(workerPath, content, 'utf8');
console.log('Created worker.js file for Cloudflare Pages deployment');

// Also create a _routes.json file if it doesn't exist
const routesPath = path.join(__dirname, 'dist', '_routes.json');
if (!fs.existsSync(routesPath)) {
  const routesContent = `{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}`;
  fs.writeFileSync(routesPath, routesContent, 'utf8');
  console.log('Created _routes.json file for Cloudflare Pages deployment');
} 
