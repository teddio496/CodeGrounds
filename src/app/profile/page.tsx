"use client";


import { toast } from "sonner";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import BlogList from "../components/blogPostView";
import TemplateList from "../components/templateView";
import { useRouter } from "next/navigation";

import {
  IconMoodCry
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/app/components/ui/dialog";

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
  const [editForm, setEditForm] = useState({
    newFirstName: "",
    newLastName: "",
    newPhoneNumber: "",
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    setLoading(true); // Set loading to true while fetching data
    const res = await fetch("/api/auth/protected/profile/get-user", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setEditForm({
        newFirstName: data.user.firstName || "",
        newLastName: data.user.lastName || "",
        newPhoneNumber: data.user.phoneNumber || "",
      }
    );
     //console.log(data.user);
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

      const response = await fetch(
        `/api/auth/protected/blog/get-my-blog?${queryParams.toString()}`
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

      const response = await fetch(
        `/api/auth/protected/template/get-templates?${queryParams.toString()}`
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/protected/profile/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser.updatedUser);
        //console.log("Profile updated successfully");
        toast("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
      }
      setLoading(false);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

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
                <Dialog>
                  <DialogTrigger>Edit Profile</DialogTrigger>
                  <DialogContent className=" bg-gray-100 dark:bg-[#222222] ">
                    <DialogHeader>
                      <DialogTitle className="text-white">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleProfileUpdate();
                      }}
                      className="flex flex-col gap-4"
                    >
                      <input
                        type="text"
                        name="newFirstName"
                        value={editForm.newFirstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                      />
                      <input
                        type="text"
                        name="newLastName"
                        value={editForm.newLastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                      />
                      <input
                        type="text"
                        name="newPhoneNumber"
                        value={editForm.newPhoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 rounded bg-gray-700 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded bg-blue-500 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
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
              <div className="text-md underline my-auto" >View All Blogs</div>
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
              <div className="text-md underline my-auto darkhover:bg-[#222222] hover:bg-gray-200" onClick={() => router.push('/profile/my-templates')}>View All Templates</div>
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
