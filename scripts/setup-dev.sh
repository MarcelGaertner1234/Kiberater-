#!/bin/bash

# KI-Beratung Platform Development Setup Script

set -e  # Exit on error

echo "🚀 Starting KI-Beratung Platform Development Setup..."

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install $1 and try again."
        exit 1
    fi
}

echo "📋 Checking prerequisites..."
check_command node
check_command npm
check_command psql
check_command redis-cli

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ All prerequisites met!"

# Create .env files if they don't exist
echo "📝 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
else
    echo "ℹ️  .env already exists"
fi

if [ ! -f frontend/.env.local ]; then
    cat > frontend/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-change-in-production
EOL
    echo "✅ Created frontend/.env.local"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from backend/.env.example"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Database setup
echo "🗄️  Setting up database..."
read -p "Do you want to create a new PostgreSQL database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating database..."
    createdb ki_beratung_db || echo "Database might already exist"
    
    # Run migrations
    cd backend
    npm run generate
    npm run migrate
    cd ..
    echo "✅ Database setup complete"
else
    echo "ℹ️  Skipping database creation"
fi

# Create necessary directories
echo "📁 Creating additional directories..."
mkdir -p uploads logs tmp

# Git hooks setup (optional)
read -p "Do you want to set up git hooks for code quality? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash
echo "Running pre-commit checks..."
npm run lint
npm run format
EOL
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks installed"
fi

# Final instructions
echo "
✅ Development setup complete!

📝 Next steps:
1. Update the .env files with your actual credentials
2. Start the development servers:
   - In one terminal: cd backend && npm run dev
   - In another terminal: cd frontend && npm run dev
3. Access the application at http://localhost:3000

🔧 Useful commands:
- npm run dev          : Start both frontend and backend (requires turbo)
- npm run test         : Run all tests
- npm run lint         : Run linting
- npm run format       : Format code

📚 Documentation:
- Architecture: docs/ARCHITECTURE.md
- API: docs/API.md
- Deployment: docs/DEPLOYMENT.md

Happy coding! 🎉
"