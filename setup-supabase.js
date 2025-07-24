#!/usr/bin/env node

/**
 * Supabase Setup Helper Script
 * Hilft beim Konfigurieren der .env Dateien mit Supabase Credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('🚀 KI-Beratungsplattform Supabase Setup\n');
  console.log('Dieses Script hilft Ihnen, die Supabase-Verbindung zu konfigurieren.');
  console.log('Sie benötigen Ihre Supabase Project Reference und Credentials.\n');

  try {
    // Check if .env files exist
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

    if (!fs.existsSync(backendEnvPath) || !fs.existsSync(frontendEnvPath)) {
      console.error('❌ .env Dateien nicht gefunden. Bitte führen Sie zuerst aus:');
      console.error('   cp backend/.env.example backend/.env');
      console.error('   cp frontend/.env.example frontend/.env');
      process.exit(1);
    }

    console.log('📝 Bitte geben Sie Ihre Supabase-Daten ein:\n');

    // Collect information
    const projectRef = await question('Project Reference (z.B. abcdefghijklmnop): ');
    const dbPassword = await question('Database Password: ');
    const serviceRoleKey = await question('Service Role Key (eyJ...): ');
    const anonKey = await question('Anon/Public Key (eyJ...): ');
    const jwtSecret = await question('JWT Secret: ');

    console.log('\n📝 Konfiguriere Backend .env...');

    // Read and update backend .env
    let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    
    // Update DATABASE_URL
    backendEnv = backendEnv.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=postgresql://postgres.${projectRef}:${dbPassword}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
    );
    
    // Update DIRECT_URL
    backendEnv = backendEnv.replace(
      /DIRECT_URL=.*/,
      `DIRECT_URL=postgresql://postgres.${projectRef}:${dbPassword}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
    );
    
    // Update Supabase settings
    backendEnv = backendEnv.replace(
      /SUPABASE_URL=.*/,
      `SUPABASE_URL=https://${projectRef}.supabase.co`
    );
    backendEnv = backendEnv.replace(
      /SUPABASE_SERVICE_ROLE_KEY=.*/,
      `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
    );
    backendEnv = backendEnv.replace(
      /SUPABASE_JWT_SECRET=.*/,
      `SUPABASE_JWT_SECRET=${jwtSecret}`
    );
    
    // Generate a secure JWT secret if not using Supabase's
    const localJwtSecret = crypto.randomBytes(32).toString('hex');
    backendEnv = backendEnv.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET=${jwtSecret || localJwtSecret}`
    );

    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log('✅ Backend .env aktualisiert');

    console.log('\n📝 Konfiguriere Frontend .env...');

    // Read and update frontend .env
    let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    
    frontendEnv = frontendEnv.replace(
      /NEXT_PUBLIC_SUPABASE_URL=.*/,
      `NEXT_PUBLIC_SUPABASE_URL=https://${projectRef}.supabase.co`
    );
    frontendEnv = frontendEnv.replace(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
    );

    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log('✅ Frontend .env aktualisiert');

    console.log('\n🎉 Supabase-Konfiguration abgeschlossen!');
    console.log('\nNächste Schritte:');
    console.log('1. npm run setup (für Datenbank-Migration)');
    console.log('2. npm run dev (zum Starten der Server)');
    console.log('3. Öffnen Sie http://localhost:3000');

    // Ask if user wants to run setup now
    const runSetup = await question('\nMöchten Sie npm run setup jetzt ausführen? (j/n): ');
    
    if (runSetup.toLowerCase() === 'j' || runSetup.toLowerCase() === 'y') {
      console.log('\n🚀 Führe Setup aus...\n');
      require('child_process').execSync('npm run setup', { stdio: 'inherit' });
    }

  } catch (error) {
    console.error('\n❌ Fehler:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Add some helper info
if (process.argv.includes('--help')) {
  console.log(`
KI-Beratungsplattform Supabase Setup Helper

Dieses Script hilft Ihnen bei der Konfiguration der Supabase-Verbindung.

Voraussetzungen:
1. Supabase-Konto erstellt
2. Neues Projekt angelegt
3. Credentials aus Settings → API kopiert

Verwendung:
  node setup-supabase.js

Weitere Hilfe:
  Siehe SUPABASE_QUICK_SETUP.md für detaillierte Anleitung
`);
  process.exit(0);
}

main();