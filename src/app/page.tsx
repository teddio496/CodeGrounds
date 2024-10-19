import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import UserCard from "./components/UserCard";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <>
      {session ? (
        <UserCard user={session?.user} pageType={"Home"} />
      ) : (
        <h1 className="text-5xl">No active session (not logged in). You shall not pass! <br /><br /> (protection in place)</h1>
      )}
    </>
  );
}
