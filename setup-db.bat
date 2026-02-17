@echo off
echo === Step 1: Baseline first migration ===
cd packages\db
npx prisma migrate resolve --applied 20260210153222_init_schema

echo === Step 2: Apply Translation migration ===
npx prisma migrate deploy

echo === Step 3: Generate Prisma Client ===
npx prisma generate

echo === Step 4: Seed translations ===
npx prisma db seed

echo === Done! ===
cd ..\..
