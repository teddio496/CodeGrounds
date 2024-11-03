echo ACCESS_TOKEN_SECRET=B2k9Xv8fH4aWyJQ | cat > .env 
echo REFRESH_TOKEN_SECRET=p7Zr1NhQs0GbLxM | cat >> .env
npm i
npx prisma generate dev
npx prisma migrate dev --name "init"
node utils/create-admin.js

