"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { ComboboxDemo } from "../../components/ui/combobox";
import TemplateList from "../../components/templateView";
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

interface TemplateTag {
  t_id: number,
  tag: string,

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


interface FilterBubble {
  type: string;
  value: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchType, setSearchType] = useState<string>("title");
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterBubbles, setFilterBubbles] = useState<FilterBubble[]>([]);
  const [tags, setTags] = useState<{ value: string; label: string; img: string }[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const pageSize = 5;
  const router = useRouter();
  const searchParams = useSearchParams();


  useEffect(() => {
    const initializeFilters = async () => {
      const pageParam = searchParams.get("page");
      const filters: Array<[string, string]> = [];


      searchParams.forEach((value, key) => {
        if (key === "page" || key === "pageSize") return;
        filters.push([key, value]);
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
  }, [searchParams]);

  const fetchTemplates = async () => {
    try {
      const queryParams = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      filterBubbles.forEach((bubble) => {
        queryParams.append(bubble.type, bubble.value);
      });
      //console.log(queryParams.toString())
      router.replace(`?${queryParams.toString()}`);
      const response = await fetch(`/api/auth/protected/template/get-templates?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        setTotalPages(data.totalPages);
      } else {
        console.error("Error fetching templates:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/visitor/get-template-tags`);
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

  const handleTagSelect = (tag: string) => {
    setFilterBubbles((prevBubbles) => [...prevBubbles, { type: "tags", value: tag }]);
  };

  const handleAuthorSelect = (author: string) => {
    setFilterBubbles((prevBubbles) => [
      ...(prevBubbles.filter((bubble) => bubble.type !== "author")),
      { type: "author", value: author },
    ]);
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
    fetchTemplates();
  }, [page, filterBubbles]);

  useEffect(() => {
    fetchTags();
  }, []);
  
  const handleDelete = async (t_id: number) => {
    try {
      const response = await fetch(`/api/auth/protected/template/delete-template`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ t_id }),
      });
      if (response.ok) {
        await fetchTemplates(); 
      } else {
        console.error("Error deleting template:", response.statusText);
      }
        } catch (error) {
      console.error("Error deleting template:", error);
        }
  }


  return (
    <div className="dark:text-white">
      <div className="flex flex-col lg:w-3/5">
        {/* Search Section */}
        <div className="sticky top-0 pl-3 dark:bg-[#333333] bg-white z-40">
          <div className="flex justify-between">
            <h1 className="text-2xl p-3 font-bold ">My Code Templates</h1>
          </div>
          <div className="flex items-center p-4 gap-2 ">
            <div className="border dark:border-white border-black rounded">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-3 bg-transparent mr-2"
            >
              <option value="title">Title</option>
              <option value="code">Code</option>
              <option value="explanation">Explanation</option>
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

        {/* Blogs Section */}
        <div className="p-4 pt-0 space-y-4">
          <TemplateList templates={templates} mine={true} handleDelete={handleDelete}/>
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

export default Templates;
