/**
 * Fix Windows backslash paths in import statements
 * Replaces backslashes with forward slashes in prisma imports
 */

import fs from 'fs/promises';
import path from 'path';

const serverDir = process.cwd();

// Files that need fixing based on grep search results
const filesToFix = [
  // Router/API
  'Router/API/Account/me.js',
  'Router/API/Preferences/language.js',
  'Router/API/Preferences/language-new.js',
  'Router/API/Preferences/notifications.js',
  'Router/API/Preferences/theme.js',
  
  // Middlewares
  'Middlewares/JWT/verifyAccessToken.js',
  
  // Sockets
  'Sockets/utils/inquiry-helpers.js',
  'Sockets/middleware/auth.js',
  'Sockets/handlers/client/client_inquiry.js',
  'Sockets/handlers/client/client_chat.js',
  'Sockets/handlers/admin/admin_inquiry.js',
  'Sockets/handlers/admin/admin_chat.js',
  
  // Services
  'Services/botService.js',
  'Services/auditLogger.js',
];

// Search all .js files in these directories for backslash imports
const searchDirs = [
  'Controller',
  'Middlewares',
  'Router',
  'Sockets',
  'Services',
];

async function getAllJsFiles(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

async function fixFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Check if file has backslash imports
    const hasBackslashImports = /import\s+.*\s+from\s+['"][^'"]*\\/.test(content);
    
    if (!hasBackslashImports) {
      return null; // No changes needed
    }
    
    // Replace backslashes with forward slashes in import statements
    const fixed = content.replace(
      /(import\s+.*\s+from\s+['"])([^'"]+)(['"])/g,
      (match, prefix, importPath, suffix) => {
        // Replace all backslashes with forward slashes
        const fixedPath = importPath.replace(/\\/g, '/');
        return `${prefix}${fixedPath}${suffix}`;
      }
    );
    
    if (fixed !== content) {
      await fs.writeFile(filePath, fixed, 'utf8');
      return filePath;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Scanning for files with backslash imports...\n');
  
  const allFiles = [];
  
  // Scan all directories
  for (const dir of searchDirs) {
    const dirPath = path.join(serverDir, dir);
    try {
      const files = await getAllJsFiles(dirPath);
      allFiles.push(...files);
    } catch (error) {
      console.log(`⚠️ Could not scan ${dir}: ${error.message}`);
    }
  }
  
  console.log(`📁 Found ${allFiles.length} JavaScript files\n`);
  
  let fixedCount = 0;
  const fixedFiles = [];
  
  for (const file of allFiles) {
    const result = await fixFile(file);
    if (result) {
      fixedCount++;
      const relativePath = path.relative(serverDir, result);
      fixedFiles.push(relativePath);
      console.log(`✅ Fixed: ${relativePath}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✨ Migration complete!`);
  console.log(`📊 Files scanned: ${allFiles.length}`);
  console.log(`🔧 Files fixed: ${fixedCount}`);
  
  if (fixedCount === 0) {
    console.log('\n✅ No backslash imports found - all paths are correct!');
  } else {
    console.log('\n📋 Fixed files:');
    fixedFiles.forEach(f => console.log(`   - ${f}`));
  }
}

main().catch(console.error);
