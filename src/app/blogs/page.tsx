"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { ComboboxDemo } from "../components/ui/combobox";
import BlogList from "../components/blogPostView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/app/components/ui/pagination"
import { useRouter, useSearchParams } from "next/navigation";

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

interface Tag {
  b_id: number,
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
}

interface FilterBubble {
  type: string;
  value: string;
}

const BlogPosts: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchType, setSearchType] = useState<string>("title");
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterBubbles, setFilterBubbles] = useState<FilterBubble[]>([]);
  const [tags, setTags] = useState<{ value: string; label: string; img: string }[]>([]);
  const [authors, setAuthors] = useState<{ value: string; label: string; img: string }[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [sortBy, setSortBy] = useState<string>("most_controversial");
  const pageSize = 10;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializeFilters = async () => {
      const pageParam = searchParams.get("page");
      const filters: Array<[string, string]> = [];

      // Fetch templates once if needed
      if (searchParams.get("templates")) {
        await fetchTemplates();
      }

      // Dynamically extract search params
      searchParams.forEach((value, key) => {
        if (key === "page" || key === "pageSize") return; // Skip "page" and "pageSize"

        if (key === "template") {
          const template = templates.find((t) => t.t_id === Number(value));
          if (template) {
            filters.push(["template",  `#${value}-${template.title}`]);
          }
        } else {
          filters.push([key, value]);
        }
      });

      if (pageParam) setPage(Number(pageParam));

      setFilterBubbles(
        filters.map(([key, value]) => ({
          type: key,
          value,
        }))
      );
    };

    initializeFilters();
  }, [searchParams, templates]);

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      const queryParams = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });

      filterBubbles.forEach((bubble) => {
        queryParams.append(bubble.type, bubble.type === "template" ? bubble.value.split("-")[0].split("#")[1] : bubble.value);
      });
      router.replace(`?${queryParams.toString()}`);
      queryParams.append(sortBy, "true");

      const response = await fetch(
        `/api/visitor/get-blog?${queryParams.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.blogPosts);
        setTotalPages(data.totalPages);
      } else {
        console.error("Error fetching blog posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/visitor/get-templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      } else {
        console.error("Error fetching templates:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/visitor/get-blog-tags`);
      if (response.ok) {
        const data = await response.json();
        const formattedTags = data.tags.map((tag: string) => ({
          value: tag,
          label: tag,
        }));
        setTags(formattedTags);
      } else {
        console.error("Error fetching tags:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Fetch authors
  const fetchAuthors = async () => {
    try {
      const response = await fetch(`/api/visitor/get-authors`);
      if (response.ok) {
        const data = await response.json();
        const formattedAuthors = data.map((author: any) => ({
          value: author.username,
          label: author.username,
          img: author.avatar,
        }));
        setAuthors(formattedAuthors);
      } else {
        console.error("Error fetching authors:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleTagSelect = (tag: string) => {
    setFilterBubbles((prevBubbles) => [...prevBubbles, { type: "tags", value: tag }]);
  };

  const handleAuthorSelect = (author: string) => {
    setFilterBubbles((prevBubbles) => [
      ...(prevBubbles.filter((bubble) => bubble.type !== "author")),
      { type: "author", value: author },
    ]);
  };

  const handleTemplateSelect = (t_id: string) => {
    const selected = templates.find((template) => template.t_id.toString() === t_id);
    if (selected) {
      setFilterBubbles((prevBubbles) => [...prevBubbles, { type: "template", value: "#"+t_id.toString() + "-" + selected.title }]);
    }
  };

  const handleRemoveBubble = (index: number) => {
    setFilterBubbles((prevBubbles) =>
      prevBubbles.filter((_, i) => i !== index)
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      if (value.trim()) {
        setFilterBubbles((prevBubbles) => {
          const filteredBubbles = prevBubbles.filter(
            (bubble) => bubble.type !== searchType
          );
          return [...filteredBubbles, { type: searchType, value }];
        });
        setSearchValue("");
      }
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [page, filterBubbles, sortBy]);
  
  useEffect(() => {
    fetchTags();
    fetchAuthors();
    fetchTemplates();
  }, []);

  return (
    <div className="dark:text-white">
      <div className="flex flex-col lg:w-3/5">
        {/* Search Section */}
        <div className="sticky top-0 pl-3 dark:bg-[#333333] bg-white z-40">
          <div className="flex justify-between">
          <h1 className="text-2xl p-3 font-bold ">Blog Posts</h1>
          <div className="p-3 " onClick={() => router.push('/blogs/write')}><span className="dark:hover:bg-[#222222] p-3 rounded hover:bg-gray-100 text-xl">✏ Write a Blog</span>	</div>
          </div>
          <div className="flex items-center p-4 gap-2 ">
            <div className="border dark:border-white border-black rounded">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-3 bg-transparent mr-2"
            >
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="description">Description</option>
            </select> 
            <span className="h-full w-[1px] bg-white"></span>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
              className="p-3 bg-transparent rounded"
            />
            </div>
          </div>
          <div className="pl-4 flex gap-2 flex-wrap">
            <ComboboxDemo tags={tags} onTagSelect={handleTagSelect} object="tags" />
            <ComboboxDemo tags={authors} onTagSelect={handleAuthorSelect} object="authors" />
            <ComboboxDemo 
              tags={templates.map((template) => ({ value: template.t_id.toString(), label: `#${template.t_id}-${template.title} (${template.language})`, img: undefined }))}
              onTagSelect={handleTemplateSelect}
              object="templates"
            />
          </div>
        
        
        <div className="flex flex-wrap p-4 space-x-2">
          {filterBubbles.map((bubble, index) => (
            <div key={index} className="flex items-center bg-gray-100 dark:bg-[#222222] p-2 rounded">
              <span>
                {bubble.type}: {bubble.value}
              </span>
              <button onClick={() => handleRemoveBubble(index)} className="ml-2 text-red-500 hover:text-red-700">
                &times;
              </button>
            </div>
          ))}
        </div>
        </div>

        {/* Sort Section */}
        <div className="flex justify-between z-40">
          <div></div>
        <Select onValueChange={(value) => setSortBy(value)} defaultValue={"most_controversial"}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="most_controversial">Controversial</SelectItem>
                        <SelectItem value="most_value">Valuable</SelectItem>
                    </SelectContent>
                </Select>
        </div>

        {/* Blogs Section */}
        <div className="p-4 pt-0 space-y-4">
          <BlogList blogPosts={blogPosts} mine={false} handleDelete={undefined}/>
          <div className="border-t-2 border-gray-500 my-4 w-full"></div>
        {/* Pagination Section */}
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        </div>
      </div>
      </div>
  );
};

export default BlogPosts;
