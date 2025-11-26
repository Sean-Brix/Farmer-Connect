/**
 * Migration Script: Replace PrismaClient imports with centralized db instance
 * 
 * This script fixes the "Too many connections" issue by replacing all
 * individual PrismaClient instances with a centralized singleton.
 * 
 * Run: node scripts/fix-prisma-imports.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverDir = path.join(__dirname, '..');

// Patterns to find and replace
const patterns = [
  {
    // Pattern 1: import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient();
    find: /import\s+{\s*PrismaClient\s*}\s+from\s+['"]@prisma\/client['"];?\s*\n\s*const\s+prisma\s*=\s*new\s+PrismaClient\(\s*(?:{[^}]*})?\s*\);?/g,
    replace: "import prisma from '../../../config/database.js';"
  },
  {
    // Pattern 2: import { PrismaClient } from '@prisma/client'\nconst prisma = new PrismaClient()
    find: /import\s+{\s*PrismaClient\s*}\s+from\s+['"]@prisma\/client['"];?\s*\n\s*const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g,
    replace: "import prisma from '../../../config/database.js';"
  },
  {
    // Pattern 3: Just the import line
    find: /import\s+{\s*PrismaClient\s*}\s+from\s+['"]@prisma\/client['"];?/g,
    replace: "// PrismaClient import removed - using centralized db"
  },
  {
    // Pattern 4: Just the new PrismaClient() line
    find: /const\s+prisma\s*=\s*new\s+PrismaClient\(\s*(?:{[^}]*})?\s*\);?/g,
    replace: "// Using centralized prisma instance"
  }
];

// Directories to scan
const dirsToScan = [
  'Controller',
  'Middlewares',
  'Router',
  'Sockets',
  'Services'
];

let filesModified = 0;
let totalReplacements = 0;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let modified = content;
  let replacements = 0;

  // Check if file needs modification
  if (!content.includes('PrismaClient') && !content.includes('new PrismaClient')) {
    return;
  }

  // Calculate relative path to config/database.js
  const relativePath = path.relative(path.dirname(filePath), path.join(serverDir, 'config', 'database.js'));
  const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

  // Apply replacements
  for (const pattern of patterns) {
    const matches = modified.match(pattern.find);
    if (matches) {
      modified = modified.replace(pattern.find, pattern.replace.replace('../../../config/database.js', importPath));
      replacements += matches.length;
    }
  }

  // Add import at the top if prisma is used but not imported
  if (modified.includes('prisma.') && !modified.includes('import prisma')) {
    const firstImport = modified.search(/^import\s/m);
    if (firstImport !== -1) {
      modified = modified.slice(0, firstImport) + 
                `import prisma from '${importPath}';\n` +
                modified.slice(firstImport);
      replacements++;
    }
  }

  if (replacements > 0) {
    fs.writeFileSync(filePath, modified, 'utf-8');
    console.log(`✅ Modified: ${path.relative(serverDir, filePath)} (${replacements} replacements)`);
    filesModified++;
    totalReplacements += replacements;
  }
}

function scanDirectory(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

console.log('🔧 Starting Prisma import migration...\n');

for (const dirName of dirsToScan) {
  const dirPath = path.join(serverDir, dirName);
  if (fs.existsSync(dirPath)) {
    console.log(`📂 Scanning ${dirName}/...`);
    scanDirectory(dirPath);
  }
}

console.log(`\n✨ Migration complete!`);
console.log(`📊 Files modified: ${filesModified}`);
console.log(`🔄 Total replacements: ${totalReplacements}`);
console.log(`\n⚠️  IMPORTANT: Review changes and test thoroughly!`);
