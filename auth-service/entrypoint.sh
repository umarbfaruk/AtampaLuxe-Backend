#!/bin/sh

echo "⏳ Waiting for PostgreSQL..."

until nc -z postgres-auth 5432
do
  sleep 1
done

echo "✅ Database is up"

echo "📦 Syncing Prisma schema..."

npx prisma db push --accept-data-loss

if [ $? -ne 0 ]; then
  echo "❌ Prisma db push failed"
  exit 1
fi

echo "🔧 Generating Prisma Client..."

npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Prisma generation failed"
  exit 1
fi

echo "🌱 Running seed..."

if [ -f prisma/seed.js ]; then
  node prisma/seed.js
else
  echo "⚠️ No seed file found, skipping..."
fi

echo "🚀 Starting Auth Service..."

exec node src/server.js