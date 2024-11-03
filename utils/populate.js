import { PrismaClient } from '@prisma/client';
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

const saltRounds = 10;

async function main() {
    // Create Users
    const users = [];
    for (let i = 1; i <= 10; i++) {
        const avatarUrl = `/uploads/avatar.jpg`;
        users.push(await prisma.user.create({
            data: {
                username: `user${i}`,
                password: await bcrypt.hash(`password${i}`, saltRounds),
                firstName: `FirstName${i}`,
                lastName: `LastName${i}`,
                phoneNumber: `123456789${i}`,
                role: i === 1 ? "Admin" : "User",
                avatar: avatarUrl,
            },
        }));
    }

    // Create Templates
    const templates = [];
    for (let i = 1; i <= 50; i++) {
        templates.push(await prisma.template.create({
            data: {
                title: `Template ${i}`,
                owner: users[i % users.length].username,
                code: `print("Hello from Template ${i}")`,
                language: "Python",
                explanation: `This is explanation for Template ${i}`,
                public: i % 2 === 0,
            },
        }));
    }

    // Create Blog Posts
    const blogs = [];
    for (let i = 1; i <= 50; i++) {
        blogs.push(await prisma.blogPost.create({
            data: {
                title: `Blog Post ${i}`,
                description: `Description for Blog Post ${i}`,
                content: `Content of Blog Post ${i}`,
                authorName: users[i % users.length].username,
            },
        }));
    }

    // Create Blog Post Tags
    for (let i = 1; i <= 50; i++) {
        await prisma.blogPostTag.create({
            data: {
                b_id: blogs[i - 1].b_id,
                tag: `Tag${i}`,
            },
        });
    }

    // Create Comments
    const comments = [];
    for (let i = 1; i <= 100; i++) {
        comments.push(await prisma.comment.create({
            data: {
                content: `Comment ${i} content`,
                postId: blogs[i % blogs.length].b_id,
                authorName: users[i % users.length].username,
                parentId: i > 10 ? comments[Math.floor(Math.random() * (i - 1))].c_id : null,
            },
        }));
    }

    // Create Comment UpDownVotes
    for (let i = 1; i <= 100; i++) {
        await prisma.commentUpDownVotes.create({
            data: {
                isUp: i % 2 === 0,
                username: users[i % users.length].username,
                c_id: comments[i - 1].c_id,
            },
        });
    }

    // Create Blog Post UpDownVotes
    for (let i = 1; i <= 50; i++) {
        await prisma.upDownVotes.create({
            data: {
                isUp: i % 2 === 0,
                username: users[i % users.length].username,
                b_id: blogs[i - 1].b_id,
            },
        });
    }

    // Create Reported Blogs
    for (let i = 1; i <= 10; i++) {
        await prisma.reportedBlog.create({
            data: {
                b_id: blogs[i].b_id,
                username: users[i % users.length].username,
                explanation: `Blog ${i} is reported for being inappropriate.`,
            },
        });
    }

    // Create Reported Comments
    for (let i = 1; i <= 10; i++) {
        await prisma.reportedComment.create({
            data: {
                c_id: comments[i].c_id,
                username: users[i % users.length].username,
                explanation: `Comment ${i} is reported for being spam.`,
            },
        });
    }

    // Create Template Tags
    for (let i = 1; i <= 50; i++) {
        await prisma.templateTag.create({
            data: {
                t_id: templates[i - 1].t_id,
                tag: `TemplateTag${i}`,
            },
        });
    }

    // Update Blog Post upvotes and downvotes
    for (const blog of blogs) {
        const upvotes = await prisma.upDownVotes.count({
            where: { b_id: blog.b_id, isUp: true },
        });
        const downvotes = await prisma.upDownVotes.count({
            where: { b_id: blog.b_id, isUp: false },
        });
        await prisma.blogPost.update({
            where: { b_id: blog.b_id },
            data: { upvotes, downvotes },
        });
    }

    // Update Comment upvotes and downvotes
    for (const comment of comments) {
        const upvotes = await prisma.commentUpDownVotes.count({
            where: { c_id: comment.c_id, isUp: true },
        });
        const downvotes = await prisma.commentUpDownVotes.count({
            where: { c_id: comment.c_id, isUp: false },
        });
        await prisma.comment.update({
            where: { c_id: comment.c_id },
            data: { upvotes, downvotes },
        });
    }

    console.log("Database seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
