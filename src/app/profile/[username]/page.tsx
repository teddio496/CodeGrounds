"use client";


import { toast } from "sonner";
import { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import BlogList from "../../components/blogPostView";
import TemplateList from "../../components/templateView";
import {
  IconMoodCry
} from "@tabler/icons-react";
import {useRouter, useParams} from "next/navigation";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phoneNumber: string;
  role: string;
  createdAt: Date;
}

interface Tag {
  b_id: number,
  tag: string,
}

interface TemplateTag {
  t_id: number,
  tag: string,
}
interface BlogPost {
  b_id: number;
  title: string;
  description: string;
  content: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  hidden: boolean;
  author: User;
  tags: Tag[]
}

interface Template {
  t_id: number;
  title: string;
  language: string;
  explanation: string;
  user: User;
  createdAt: Date;
  tags: TemplateTag[];
}


const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const username = params?.username;

  const fetchUserData = async () => {
    setLoading(true); // Set loading to true while fetching data
    const res = await fetch(`/api/visitor/get-user?username=${username}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
    //////console.log(data);
    //////console.log(data.author)
    } else {
      console.error("Failed to fetch user data");
    }
    setLoading(false); // Data is fetched, stop loading
  };

  const fetchBlogPosts = async () => {
    try {
      const queryParams = new URLSearchParams({ page: "1" });
      queryParams.append("pageSize", "5");
      queryParams.append("sort_by_date", "true");
      queryParams.append("author", username.toString())

      const response = await fetch(
        `/api/visitor/get-blog?${queryParams.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.blogPosts);
      } else {
        console.error("Error fetching blog posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const queryParams = new URLSearchParams({ page: "1" });
      queryParams.append("pageSize", "5");
      queryParams.append("sort_by_date", "true");
      queryParams.append("author", username.toString())

      const response = await fetch(
        `/api/visitor/get-templates?${queryParams.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      } else {
        console.error("Error fetching blog posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBlogPosts();
      fetchTemplates();
    }
  }, [user]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen light:bg-white dark:text-white">
      <div className="min-h-screen lg:max-w-[80%]">
        {/* Profile Banner */}
        <div className="bg-gray-100 dark:bg-[#292929] dark:text-white shadow-lg rounded-lg p-6 mb-6 mt-10">
          <div className="flex flex-row">
            <div className="w-30 h-30">
              <Avatar initialAvatarUrl={user?.avatar || "/uploads/avatar.jpg"} />
            </div>
            <div className="flex flex-row justify-between w-3/4">
              <div className="ml-3 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{user?.username}</h1>
                  <p>{user?.firstName + " " + user?.lastName}</p>
                  <p>{user?.phoneNumber}</p>
                </div>
              </div>
              <p className="text-sm">
                {"User Since: " + new Date(!user ? "" :user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex gap-6 flex-col max-w-[90%] mx-auto lg:flex-row ">
        {/* Left Section */}
          <div className="flex-1">
            <div className="flex justify-between p-1">
              <div className="text-3xl">Blogs</div>
              <div className="text-md underline my-auto" >View More Blogs</div>
            </div>
            {blogPosts.length > 0 ? (
              <div className="flex-grow bg-gray-100 dark:bg-[#292929] shadow-md rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
                <BlogList blogPosts={blogPosts} mine={false} handleDelete={undefined}/>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-[#292929] shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
                <IconMoodCry className="w-20 h-20 my-10 text-neutral-700 dark:text-neutral-200" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  No blog posts yet.
                </h2>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex-1">
            <div className="flex justify-between p-1">
              <div className="text-3xl">Templates</div>
              <div className="text-md underline my-auto" onClick={() => router.push(`/templates?author=${username}`)}>View More Templates</div>
            </div>
            {templates.length > 0 ? (
              <div className=" flex-grow bg-gray-100 dark:bg-[#292929] shadow-md rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
                <TemplateList templates={templates} mine={false} handleDelete={undefined}/>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-[#292929] shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
                <IconMoodCry className="w-20 h-20 my-10 text-neutral-700 dark:text-neutral-200" />
                <h2 className="text-xl font-semibold dark:text-white mb-2">
                  No code templates yet.
                </h2>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
