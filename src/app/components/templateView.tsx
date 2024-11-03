import { useRouter } from "next/navigation";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Icon } from "lucide-react";
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
  
interface TemplateListProps {
  templates: Template[];
  mine: boolean;
  handleDelete: any;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, mine, handleDelete }) => {
  const router = useRouter();
  return (
    <div>
      {templates.length > 0 ? (templates.map((template) => (
        <div key={template.t_id} className="space-y-6 dark:text-white">
          {/* Divider */}
          <div className="border-t-2 border-gray-500 w-full"></div>
          {/* Template */}
          <div className="pl-4  rounded  cursor-pointer">
            {/* Template Header */}
            <div className="flex items-center space-x-4 rounded-full dark:hover:bg-[#222222] hover:bg-gray-200 click:bg-[#111111]" onClick={() => router.push(`/templates/${template.t_id}`)}>
              <img
                src={template.user.avatar}
                alt={`${template.user.username}'s avatar`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{template.title}</h2>
                <p className="text-gray-500 text-sm">
                  <strong>By:</strong> {template.user.username} |{" "}
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Template Explanation */}
            <div>
              <p className="dark:text-gray-300 light:text-gray-700 rounded-lg dark:hover:bg-[#222222] hover:bg-gray-200 click:bg-[#111111] mb-6" onClick={() => router.push(`/templates/${template.t_id}`)}>
                {template.explanation}
              </p>
            </div>
            <div className="flex justify-between">
                <div className="mb-6 mt-2">
                    {template.tags.map((tag) => 
                        <span key={tag.t_id} className="my-auto p-2 rounded-lg mr-1 border dark:hover:bg-[#222222] dark:border-gray-100 border-gray-800" onClick={() => router.push(`/templates?tags=${tag.tag}`)}>{tag.tag}</span>
                    )}
                </div>
                <div className="flex gap-3 my-auto dark:text-white">
                    {mine && (
                        <>
                            <IconEdit onClick={() => router.push(`/templates/edit/${template.t_id}`)}/>
                            <AlertDialog>
                            <AlertDialogTrigger>
                                <IconTrash />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:text-white">
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your code templates from our server.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(template.t_id)}>Continue</AlertDialogAction>
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
        <div>No templates are available</div>
      )}
    </div>
  );
};

export default TemplateList;
