## CodeGrounds : Code Execution Platform  
This is a web application that allows visitors to execute code in a variety of programming languages and create accounts to store their code templates and blogs.  

Deployment on an AWS EC2 instance: [http://18.119.118.164](http://18.119.118.164)

## Technologies
- Next.js was used for the front and backend
- Code execution happens securely within a Docker container
- User sessions are implemented using JWT tokens stored inside of cookies
- Data (users, templates, blogs) modelled using a Prisma schema and stored inside a SQLite database

## Features
- Blogging platform: create, edit, comment, and vote on blogs as a registered user
- Code Templates: create, edit, and fork templates as a registered user
- Admin and moderation tools (reporting, hiding, deleting content)
- Responsive UI made with Tailwind CSS and `shadcn` components

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for code execution)

## Setup

1. **Install dependencies:**
```bash
npm install
# or
yarn install
```

2. **Set up the database:**
- Update your database connection string in `prisma/schema.prisma` if needed.
- Run Prisma migrations:
```bash
npx prisma migrate dev
```
      
3. **Build docker image**
```bash
docker build -t exec-multi -f Dockerfile .
```

4. **Start the development server:**
```bash
npm run dev
# or
yarn dev
```
And the app will be running on [http://localhost:3000](http://localhost:3000).
