"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ComboboxDemo } from "@/src/app/components/ui/combobox";

interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phoneNumber: string;
  role: string;
  createdAt: Date;
}

interface Template {
  t_id: number;
  title: string;
  language: string;
  explanation: string;
  user: User;
  createdAt: Date;
}

const EditBlog: React.FC<{ params: { b_id: string } }> = ({ params }) => {
  const { b_id } = params; // Extract blog ID from dynamic route
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [codeTemplates, setCodeTemplates] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/auth/protected/blog/get-my-blog?b_id=${b_id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.hidden) {
            toast("You may not edit hidden post!");
            router.push(`/blogs/${data.b_id}`);
          }
          setTitle(data.title);
          setDescription(data.description);
          setContent(data.content);
          setTags(data.tags.map((tag: any) => tag.tag) || []);
          setCodeTemplates(data.codeTemplates.map((temp: any) => temp.t_id) || []);
        } else {
          console.error("Failed to fetch blog data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred while fetching the blog data:", error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/visitor/get-templates-title`);
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        } else {
          console.error("Failed to fetch templates:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred while fetching templates:", error);
      }
    };

    fetchBlog();
    fetchTemplates();
  }, [b_id]);

  const handleTagAdd = () => {
    if (tagInput) {
      setTags((prevTags) => [...prevTags, tagInput]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTemplateAdd = (t_id: string) => {
    const selected = templates.find((template) => template.t_id.toString() === t_id);
    if (selected) {
      setCodeTemplates((prevTemplates) => [...prevTemplates, `#${t_id}-${selected.title}`]);
    }
  };

  const handleTemplateRemove = (templateToRemove: string) => {
    setCodeTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template !== templateToRemove)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/auth/protected/blog/edit-blog`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          b_id: ~~b_id,
          title,
          description,
          content,
          tags,
          codeTemplates: codeTemplates.map((template) =>
            parseInt(template.split("-")[0].substring(1))
          ),
        }),
      });

      if (response.ok) {
        router.push(`/blogs/${b_id}`);
      } else {
        console.error("Failed to update blog post:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while updating the blog:", error);
    }
  };

  return (
    <div className="max-w-3xl p-6 dark:text-white ">
      <h1 className="text-3xl font-semibold mb-6">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col text-2xl">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 border border-t-0 border-r-0 border-l-0 bg-transparent focus:border-b-4 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <textarea
            value={description}
            placeholder="Description"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 border rounded-md focus:ring-2 bg-transparent focus:border-4 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <textarea
            value={content}
            placeholder="Content"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            rows={10}
            required
            className="mt-1 p-2 border min-h-11 rounded-md focus:ring-2 bg-transparent focus:border-4 focus:outline-none"
          />
        </div>

        <div className="flex flex-row justify-between">
          {/* Tags Section */}
          <div className="flex flex-col">
            <div className="flex items-center mt-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none bg-transparent focus:border-4"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="ml-2 p-2 bg-gray-100 dark:bg-[#222222] dark:text-white rounded-md hover:bg-gray-500"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 p-1 bg-gray-100 text-gray-700 rounded flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Templates Section */}
          <div className="flex flex-col">
            <ComboboxDemo
              tags={templates.map((template) => ({
                value: template.t_id.toString(),
                label: `#${template.t_id}-${template.title} (${template.language})`,
                img: undefined
              }))}
              onTagSelect={handleTemplateAdd}
              object="templates"
            />
            <div className="flex flex-wrap mt-2">
              {codeTemplates.map((template, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 p-1 bg-gray-100 text-gray-700 rounded flex items-center"
                >
                  {template}
                  <button
                    type="button"
                    onClick={() => handleTemplateRemove(template)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="p-3 mt-4 bg-gray-100 dark:bg-[#222222] dark:text-white font-semibold rounded-md hover:bg-gray-500"
        >
          Update Blog Post
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
