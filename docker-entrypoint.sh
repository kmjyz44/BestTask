
#!/bin/sh
set -e

# Wait for DB if DATABASE_URL is present and host is 'db'
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
fi

echo "Starting Next.js..."
npm run start -- -p 3000
