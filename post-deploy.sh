#!/bin/bash
npm i

npx prisma migrate deploy

npx prisma generate

sudo docker build -t exec-multi -f docker/Dockerfile .

npm run build

pm2 reload ecosystem.config.cjs --env production
