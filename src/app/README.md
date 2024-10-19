Here will be notes regarding the project for members working on the code.  

"Protection" refers to prohibiting unauthenticated users from accessing resources that require appropriate authentication.
There are 3 different ways to enforce protection of resources.
1) Grab the current session using getServerSession() and check whether the session is null.
Conditionally render components based on session. See scriptorium/src/app/page.tsx
2) Grab the current session using getServerSession() and if it's null use redirect(). See scriptorium/src/app/server/page.tsx
3) Use nextauth middleware that automically enforces protection. See scriptorium/src/middleware.ts

When signing in through Github using OAuth, your profile pic is included inside the `image` prop of session.user
Note session = getServerSession(), the session object.
Hover over it to see its properties.
image? has a ? because let's say you use credentials instead of Github, then you will not have an image.