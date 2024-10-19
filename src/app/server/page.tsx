import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserCard from "../components/UserCard";
import { redirect } from "next/navigation";

export default async function ServerPage() {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server&you-were-rejected-by-server");
  }

  return (
    <section className="flex flex-col gap-6">
      <UserCard user={session?.user} pageType={"Server"} />
    </section>
  );
}