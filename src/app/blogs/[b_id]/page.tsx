"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UpvoteDownvote from "../../components/upvoteDownvote";
import ReportBlog from "../../components/report";
import UpvoteDownvoteComment from "../../components/upvoteDownvoteComment";
import ReportComment from "../../components/reportComment";
import { useRouter } from "next/navigation";
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
  templates: Template[];
  tags: Tag[];
}

interface Template {
  t_id: number;
  title: string;
  language: string;
  explanation: string;
  user: User;
  createdAt: Date;
}
interface Comment {
  c_id: number;
  content: string;
  authorName: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  children: Comment[];
}

  const BlogPost = () => {
    const params = useParams();
    const b_id = params?.b_id;
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<number | null>(null); // Track which comment is being replied to
    const [replyContent, setReplyContent] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    useEffect(() => {
      if (b_id) {
        fetch(`/api/visitor/get-blog?b_id=${b_id}`)
          .then((res) => res.json())
          .then((data) => {
            setBlog(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching blog:", error);
            setLoading(false);
          });

        fetch(`/api/visitor/get-comment?postId=${b_id}`)
          .then((res) => res.json())
          .then((data) => setComments(data))
          .catch((error) => console.error("Error fetching comments:", error));
      }
    }, [b_id]);

      const handleCommentSubmit = (parentId: number | null = null) => { 
      const content = parentId ? replyContent : newComment;
      if (!content.trim()) return;

      fetch(`/api/auth/protected/blog/create-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          postId: ~~b_id,
          parentId: !parentId ? null : ~~parentId,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          if (parentId) {
            setReplyContent(""); 
            setReplyingTo(null);
          } else {
            setNewComment("");
            setIsFocused(false); 
          }

          fetch(`/api/visitor/get-comment?postId=${b_id}`)
            .then((res) => res.json())
            .then((data) => setComments(data));
        })
        .catch((error) => console.error("Error adding comment:", error));
    };

    const renderComments = (comments: Comment[], parentId: number | null = null) => {
      return comments.map((comment) => (
        <div key={comment.c_id} className="pl-4 border-l border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-700 dark:text-gray-300 flex">
              <strong>{comment.authorName}</strong> -{" "}
              {new Date(comment.createdAt).toLocaleString()}
              <div className="flex my-auto">
                <UpvoteDownvoteComment c_id={comment.c_id} initialCount={comment.upvotes - comment.downvotes}/>
                <ReportComment c_id={comment.c_id} />
              </div>

          </div>

          <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>

          {/* Reply Button */}
          <button
            className="text-green-800 text-sm"
            onClick={() =>
              setReplyingTo(replyingTo === comment.c_id ? null : comment.c_id)
            }
          >
            {replyingTo === comment.c_id ? "Cancel" : "Reply"}
          </button>

          {/* Reply Input */}
          {replyingTo === comment.c_id && (
            <div className="mt-2">
              <textarea
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button
                className="mt-2 bg-green-800 text-white px-4 py-2 rounded-md"
                onClick={() => handleCommentSubmit(comment.c_id)}
              >
                Post Reply
              </button>
            </div>
          )}

          {/* Render Child Comments */}
          {renderComments(comment.children, comment.c_id)}
        </div>
      ));
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      );
    }

    if (!blog) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg font-semibold">Blog post not found</div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl p-6 space-y-6 text-gray-800 dark:text-white">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{blog.title}</h1>
        <div className="text-gray-600 dark:text-gray-400 text-sm flex justify-between">
          <p>
            <strong>By:</strong> {blog.authorName} -{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        <div className="text-lg my-auto flex">
          <UpvoteDownvote b_id={~~b_id} initialCount={blog.upvotes - blog.downvotes}/>
          <ReportBlog b_id={~~b_id}/>
        </div>
        </div>
        <p className="italic text-lg text-gray-700 dark:text-gray-300">{blog.description}</p>
        <div className="whitespace-pre-wrap bg-transparent text-gray-700 dark:text-gray-300">
            {blog.content}
          </div>
        {/* Templates Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Templates Reference</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" >
            {blog.templates.map((template) => (
              <div
                key={template.t_id}
                className="p-4 border rounded-md shadow-md bg-gray-50 dark:bg-gray-800 hover:dark:bg-gray-700 hover:bg-gray-200"
                onClick={() => router.push(`/templates/${template.t_id}`)}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Author:</strong> {template.user.firstName} {template.user.lastName}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {template.explanation}
                </p>
              </div>
            ))}
          </div>





          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Comments</h2>
        <div className="relative text-gray-800 dark:text-white flex">
          <textarea
            className="w-full border border-gray-300 bg-transparent p-2 rounded-md"
            placeholder="Write a comment..."
            value={newComment}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {if (!newComment.trim()) {setIsFocused(false);}}}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {isFocused && (
            <button className="bg-transparent border dark:border-white dark:text-white px-4 py-2 rounded-md min-w-[px]" onClick={() => handleCommentSubmit(null)}>
              Post Comment
            </button>
          )}
      </div>
          <div className="space-y-4">{renderComments(comments)}</div>
        </div>
      </div>
    );
  };

export default BlogPost;
