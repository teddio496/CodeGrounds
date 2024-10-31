// CHATGPT generated temporary example data for testing

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {


  
  const user = await prisma.user.create({
    data: {
      username: "johndoe",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      role: "User",
    },
  });

  const template1 = await prisma.template.create({
    data: {
      title: "Array Sorting",
      owner: user.username,
      code: "function sortArray() {...}",
      explanation: "Basic array sorting template",
    },
  });

  const template2 = await prisma.template.create({
    data: {
      title: "API Fetch",
      owner: user.username,
      code: "async function fetchAPI() {...}",
      explanation: "Template for API fetching",
    },
  });

  const blogPost1 = await prisma.blogPost.create({
    data: {
      title: "Sorting Techniques in JavaScript",
      description: "An overview of sorting algorithms in JavaScript",
      content: "In this blog, we discuss various sorting techniques...",
      authorName: user.username,
      templates: {
        connect: [{ t_id: template1.t_id }],
      },
    },
  });

  const blogPost2 = await prisma.blogPost.create({
    data: {
      title: "Fetching Data from APIs",
      description: "Learn how to fetch data from APIs in JavaScript",
      content: "This guide explains how to use fetch API...",
      authorName: user.username,
      templates: {
        connect: [{ t_id: template2.t_id }],
      },
    },
  });

  await prisma.blogPostTag.createMany({
    data: [
      { b_id: blogPost1.b_id, tag: "JavaScript" },
      { b_id: blogPost1.b_id, tag: "Sorting" },
      { b_id: blogPost2.b_id, tag: "API" },
      { b_id: blogPost2.b_id, tag: "Networking" },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
