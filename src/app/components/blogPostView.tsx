import { useRouter } from "next/navigation";
import UpvoteDownvote from "./upvoteDownvote";
import { IconEdit, IconTrash } from "@tabler/icons-react";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/app/components/ui/alert-dialog"



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

interface BlogListProps {
  blogPosts: BlogPost[];
  mine: boolean;
  handleDelete: any;
}

const BlogList: React.FC<BlogListProps> = ({ blogPosts,mine, handleDelete }) => {
  const router = useRouter();

  return (
    <div>
          {blogPosts.length > 0 ? (blogPosts.map((post) => (
            <div className="space-y-6 dark:text-white">
                <div className="border-t-2 border-gray-500 w-full"></div>
                <div key={post.b_id} className="pl-4   rounded cursor-pointer">
                    {/* Blog Header */}
                    <div className="flex justify-between">
                        <div className="flex items-center space-x-4 dark:hover:bg-[#222222] click:bg-[#111111] hover:bg-gray-200 rounded-full pr-2 " onClick={() => {router.push(`/blogs/${post.b_id}`)}}>
                        <img
                            src={post.author.avatar}
                            alt={`${post.author.username}'s avatar`}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{post.title}</h2>
                            <p className="text-gray-500 text-sm">
                            <strong>By:</strong> {post.author.username} |{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        </div>
                        <div className="pr-2">
                        <UpvoteDownvote initialCount={post.upvotes - post.downvotes} b_id={post.b_id}/>
                        </div>
                    </div>
                    {/* Blog Content */}
                    <div>
                        <p 
                        className="dark:text-gray-300 light:text-gray-700 dark:hover:bg-[#222222] click:bg-[#111111] hover:bg-gray-200 rounded" 
                        onClick={() => {router.push(`/blogs/${post.b_id}`)}}
                        >
                        {post.description}
                        </p>
                    </div>
                    <div className="flex justify-between">
                    <div className="mb-6 mt-2">
                        {post.tags.map((tag) => <span className="my-auto p-2 rounded-lg mr-1 border dark:hover:bg-[#222222] dark:border-gray-100 border-gray-800" onClick={
                          () => router.push(`/blogs?tags=${tag.tag}`)
                        }>{tag.tag}</span>)}
                    </div>
                    <div className="flex gap-3 my-auto dark:text-white">
                    {mine && (
                        <>
                          {post.hidden ? (
                            <div>Hidden by Admin</div>
                          ) : (
                            <IconEdit onClick={() => router.push(`/blogs/edit/${post.b_id}`)}/>
                          )}
                            <AlertDialog>
                            <AlertDialogTrigger>
                                <IconTrash />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:text-white dark:bg-[#222222] bg-white">
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your blog from our server.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel className="hover:dark:bg-[#333333] hover:bg-gray-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(post.b_id) } className="hover:dark:bg-[#333333] hover:bg-gray-200">Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                    </div>
                    </div>

                </div>
            </div>            
          ))) : (
            <div>No Blog Posts are available</div>
          )}
    </div>
  );
};

export default BlogList;
