#!/usr/bin/env node

/**
 * Check for duplicate functions across the codebase
 * Prevents code duplication and enforces DRY principle
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DUPLICATE_PATTERNS = [
  // Common function patterns
  /function\s+(\w+)\s*\(/g,
  /const\s+(\w+)\s*=\s*\(/g,
  /const\s+(\w+)\s*=\s*async\s*\(/g,
  /export\s+function\s+(\w+)/g,
  /export\s+const\s+(\w+)\s*=/g,
];

const IGNORE_DIRS = ['node_modules', '.next', 'dist', 'build', '.git'];
const CHECK_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

const functionMap = new Map();
const duplicates = [];

function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(item)) {
        findFiles(fullPath, files);
      }
    } else if (CHECK_EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  for (const pattern of DUPLICATE_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const funcName = match[1];
      
      // Skip common React/Next.js functions
      if (['useState', 'useEffect', 'render', 'default'].includes(funcName)) {
        continue;
      }
      
      if (functionMap.has(funcName)) {
        const existing = functionMap.get(funcName);
        if (existing.path !== filePath) {
          duplicates.push({
            name: funcName,
            locations: [existing.path, filePath]
          });
        }
      } else {
        functionMap.set(funcName, { path: filePath });
      }
    }
  }
}

// Main execution
console.log('🔍 Scanning for duplicate functions...\n');

const files = findFiles(process.cwd());
files.forEach(checkFile);

if (duplicates.length > 0) {
  console.error('❌ Found duplicate functions:\n');
  
  duplicates.forEach(dup => {
    console.error(`Function "${dup.name}" found in:`);
    dup.locations.forEach(loc => {
      const relativePath = path.relative(process.cwd(), loc);
      console.error(`  - ${relativePath}`);
    });
    console.error('');
  });
  
  console.error('💡 Consider extracting these to shared utilities!\n');
  process.exit(1);
} else {
  console.log('✅ No duplicate functions found!\n');
}