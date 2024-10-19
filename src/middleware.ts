// without a defined matcher this one line will apply next-auth protection to the entire project
// middleware must also always export a `default` or `middleware` function
export { default } from "next-auth/middleware";

// applies next-auth only to matching routes - can be regex
// ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

export const config = { matcher: ["/extra"] };
// export const config = { matcher: [] };