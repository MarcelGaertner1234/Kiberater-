#!/usr/bin/env node

/**
 * Generate secure secrets for local development
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function updateEnvFile(filePath, updates) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  });

  fs.writeFileSync(filePath, content);
  return true;
}

function main() {
  console.log('🔐 Generating secure secrets for local development...\n');

  const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
  const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');

  // Generate secrets
  const jwtSecret = generateSecret(64);
  const nextAuthSecret = generateSecret(32);
  const webhookSecret = generateSecret(32);

  // Update backend .env
  console.log('📝 Updating backend .env...');
  const backendUpdates = {
    JWT_SECRET: jwtSecret,
    N8N_WEBHOOK_SECRET: webhookSecret,
    WEBHOOK_API_KEY: generateSecret(32)
  };

  if (updateEnvFile(backendEnvPath, backendUpdates)) {
    console.log('✅ Backend secrets generated');
  }

  // Update frontend .env
  console.log('\n📝 Updating frontend .env...');
  const frontendUpdates = {
    NEXTAUTH_SECRET: nextAuthSecret,
    NEXTAUTH_URL: 'http://localhost:3000'
  };

  if (updateEnvFile(frontendEnvPath, frontendUpdates)) {
    console.log('✅ Frontend secrets generated');
  }

  console.log('\n🎉 Secrets generated successfully!');
  console.log('\n⚠️  These are for LOCAL DEVELOPMENT ONLY.');
  console.log('For production, use proper secret management (AWS Secrets Manager, etc.)');
}

main();