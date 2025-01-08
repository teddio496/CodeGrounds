#!/bin/bash
echo ACCESS_TOKEN_SECRET=B2k9Xv8fH4aWyJQ | cat > .env 
echo REFRESH_TOKEN_SECRET=p7Zr1NhQs0GbLxM | cat >> .env

npm i

npx prisma migrate deploy

npx prisma generate

sudo docker build -t exec-multi -f docker/Dockerfile .

npm run build