#!/usr/bin/env node

/**
 * Check if documentation needs to be updated based on git changes
 * Ensures docs stay in sync with code changes
 */

const { execSync } = require('child_process');
const path = require('path');

const DOC_UPDATE_RULES = {
  // If these files change, these docs need updating
  'backend/prisma/schema.prisma': ['/docs/DATABASE_MVP.md'],
  'backend/src/api/': ['/docs/API_ENDPOINTS.md'],
  'frontend/src/components/': ['/docs/COMPONENTS_HIERARCHY.md'],
  'frontend/public/locales/': ['/docs/I18N_STRATEGY.md'],
  '.env.example': ['/CLAUDE.md'],
};

function getChangedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function getLastModified(filePath) {
  try {
    const output = execSync(`git log -1 --format=%at -- ${filePath}`, { encoding: 'utf8' });
    return parseInt(output.trim()) || 0;
  } catch (error) {
    return 0;
  }
}

console.log('📝 Checking if documentation needs updates...\n');

const changedFiles = getChangedFiles();
const docsToCheck = new Set();

// Check which docs might need updating
changedFiles.forEach(file => {
  Object.entries(DOC_UPDATE_RULES).forEach(([pattern, docs]) => {
    if (file.includes(pattern)) {
      docs.forEach(doc => docsToCheck.add(doc));
    }
  });
});

if (docsToCheck.size === 0) {
  console.log('✅ No documentation updates needed!\n');
  process.exit(0);
}

// Check if docs are older than related code
let needsUpdate = false;
docsToCheck.forEach(doc => {
  const docPath = path.join(process.cwd(), doc);
  const docModified = getLastModified(docPath);
  
  // Find the most recent code change
  let mostRecentCodeChange = 0;
  changedFiles.forEach(file => {
    const fileModified = getLastModified(file);
    if (fileModified > mostRecentCodeChange) {
      mostRecentCodeChange = fileModified;
    }
  });
  
  if (mostRecentCodeChange > docModified) {
    console.warn(`⚠️  ${doc} may need updating (last modified: ${new Date(docModified * 1000).toLocaleDateString()})`);
    needsUpdate = true;
  }
});

if (needsUpdate) {
  console.error('\n❌ Documentation appears to be out of date!');
  console.error('💡 Please update the documentation before committing.\n');
  console.error('Affected files:');
  docsToCheck.forEach(doc => console.error(`  - ${doc}`));
  console.error('\n');
  process.exit(1);
} else {
  console.log('✅ Documentation is up to date!\n');
}