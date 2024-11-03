"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select";
import {
  ResizableHandle,

  ResizablePanel,
  ResizablePanelGroup,
} from "@/src/app/components/ui/resizable";
import {
  IconCode,
  IconPlayerPlay,
  IconGitFork
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/src/app/components/ui/dialog"
  import { useTheme } from "@/src/context/ThemeContext";


const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

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
  b_id: number;
  tag: string;
}

interface TemplateTag {
  t_id: number;
  tag: string;
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
  forkedFrom: number;
  code: string;
  tags: TemplateTag[];
  blogs: BlogPost[];
}

export default function CodeEditorPage() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("Python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ stdout: "", stderr: "", timeTaken: "" });
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();
  const params = useParams();
  const t_id = params?.t_id;
  const [content, setContent] = useState<Template | null>(null);
  const [showForkDialog, setShowForkDialog] = useState(false);
  const [newForkTitle, setNewForkTitle] = useState("");
  const [isForking, setIsForking] = useState(false);
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("vs-light");
  
  //editor theme setter
  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "vs-light");
  }, [theme]);

  //responsive resizable
  useEffect(() => {
    const updateLayout = () => {
      setDirection(window.innerWidth < 768 ? "vertical" : "horizontal");
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  //boilerplate setter
  useEffect(() => {
    //console.log(language);
    switch (language) {
      case "C":
        setCode("#include<stdio.h>\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}");
        break;
      case "C++":
        setCode("#include<iostream>\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}");
        break;
      case "Java":
        setCode("//The class name has to be Main\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}");
        break;
      case "JavaScript":
        setCode("//console.log(\"Hello, World!\");");
        break;
      case "Python":
        setCode("print(\"Hello, World!\")");
        break;
      case "Bash":
        setCode("echo \"Hello, World!\"");
        break;
      case "Ruby":
        setCode("puts \"Hello, World!\"");
        break;
      case "Go":
        setCode("package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}");
        break;
      case "PHP":
        setCode("<?php\necho \"Hello, World!\";\n?>");
        break;
      case "Kotlin":
        setCode("fun main() {\n    println(\"Hello, World!\")\n}");
        break;
      case "TypeScript":
        setCode("//console.log(\"Hello, World!\");");
        break;
      case "Swift":
        setCode("import Foundation\nprint(\"Hello, World!\")");
        break;
      case "Perl":
        setCode("print \"Hello, World!\\n\";");
        break;
      case "Haskell":
        setCode("main = putStrLn \"Hello, World!\"");
        break;
      case "Rust":
        setCode("fn main() {\n    println!(\"Hello, World!\");\n}");
        break;
      default:
        setCode("// Select a language to see the starter code");
    }
  }, [language]);

  //details setter
  useEffect(() => {
    fetchTemplate();
  }, [showContent])

  const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/visitor/get-templates?t_id=${t_id}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data.templates);
          setCode(data.templates.code);
          console.log(data)
        } else {
          console.error("Error fetching template:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
  };

  const fork = async () => {
    if (!newForkTitle.trim()) {
      toast("Please provide a title for the forked template.");
      return;
    }
  
    setIsForking(true);


    try {
      const response = await fetch("/api/auth/protected/template/fork-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t_id: ~~t_id, title: newForkTitle }),
      });
      
      const data = await response.json()
      //console.log(response.status)

      if (response.status === 201){
        router.push(`/templates/edit/${data.fork.t_id}`)
      }
      if (response.ok) {
        toast("Template forked successfully!");
        setShowForkDialog(false);
      } else if (response.status === 401) {
        toast("Invalid title: You already have a template with this title.");
      } else if (response.status === 400) {
        toast("You must be logged in to fork.")
      } else {
        toast("An error occurred while forking the template.");
      }
    } catch (error) {
      console.error("Error forking template:", error);
      toast("An unexpected error occurred.");
    } finally {
      setIsForking(false);
    }
  };

  const runCode = async () => {
    try {
      const response = await fetch("/api/visitor/execution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, input, language }),
      });
      const result = await response.json();
      setOutput(result.output || {});
      if (result.output.stdout && !result.output.stderr) {
        toast.success("Code execution was successful!", {duration: 20000});
      } else if (result.output.stdout && result.output.stderr) {
        toast.error("Code execution failed during execution", {duration: 20000});
      } else if (!result.output.stdout && result.output.stderr) {
        toast.error("Code execution was NOT successful :(", {duration: 20000});
      } else {
        toast.success("Code execution was successful, but no outputs. ", {duration: 20000});
      }
    } catch (error) {
      setOutput({ ...output, stderr: "Error executing code." });
      console.error(error);
    }
  };

  const handleViewDetailsClick = () => {
    setShowContent(true);
  };
  
  interface ContentProps {
    content: Template | null;
    setShowContent: (show: boolean) => void;
  }
  
  // Fix Tag Key in the ContentComponent
  const ContentComponent: React.FC<ContentProps> = ({ content, setShowContent }) => {
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setShowContent(false);
        }
      };
  
      window.addEventListener("keydown", handleEscape);
      return () => {
        window.removeEventListener("keydown", handleEscape);
      };
    }, [setShowContent]);
  
    return (
      <div className="p-6 dark:bg-[#1e1e1e] relative overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-2 right-4 dark:text-white hover:text-gray-300 text-xl"
          onClick={() => setShowContent(false)}
        >
          ✕
        </button>
  
        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-500 pb-3">
          Code Template Details
        </h2>
  
        {/* Content details */}
        <div>
          {/* Title */}
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">
              {content?.title || "No title provided"}
            </h3>
            <p className="pr-4">
              {content?.language || "Unknown language"}
            </p>
          </div>
  
          <div className="">
            By: {content?.user?.username || "Unknown user"}
          </div>
          <div className="">
            Forked From:{" "}
            {content?.forkedFrom ? content?.forkedFrom : "Original Template"}
          </div>
  
          {/* Explanation */}
          <div>
            <p className="">
              {content?.explanation || "No explanation provided"}
            </p>
          </div>
  
          {/* Code snippet */}
          <div>
            <h3 className="text-lg font-semibold mt-4">Code</h3>
            <pre className="bg-[#333333] hover:bg-[#222222] text-gray-300 p-4 rounded overflow-x-auto max-h-64" onClick={() => setShowContent(false)}>
              {content?.code || "No code provided"}
            </pre>
          </div>
  
          {/* Tags */}
          <div className="mt-3">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
            {content?.tags && content.tags.length > 0 ? (
              content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-800 text-gray-300 py-1 px-2 rounded text-sm"
                >
                  {tag.tag}
                </span>
              ))
            ) : (
              <p className="text-gray-300">No tags</p>
            )}
            </div>
          </div>

          {/* Blogs */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Referred at:</h3>
            {content?.blogs ? (
              content.blogs.map((blog) => (
              <div className="bg-gray-800 text-gray-300 p-4 rounded hover:bg-gray-700" onClick={() => router.push(`/blogs/${blog.b_id}`)}>
                <p>
                  <strong>Blog ID:</strong> {blog.b_id}
                </p>
                <p>
                  <strong>Title:</strong> {blog.title || "No title provided"}
                </p>
                <p>
                  <strong>Author:</strong> {blog.authorName || "Unknown"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {content.createdAt
                    ? new Date(content.createdAt).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>
              ))
            ) : (
              <p className="text-gray-300">No blog reference available.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  
  return (
   <div className="dark:text-white min-h-screen flex flex-col text-black">
      {/* Fork Template Dialog */}
      <Dialog open={showForkDialog} onOpenChange={setShowForkDialog}>
        <DialogContent className="dark:bg-[#333333] bg-gray-100 dark:text-white text-black">
          <DialogHeader>
            <DialogTitle>Enter a title for new forked template</DialogTitle>
          </DialogHeader>
          <div >
            <input
              type="text"
              placeholder="Enter new title"
              value={newForkTitle}
              onChange={(e) => setNewForkTitle(e.target.value)}
              className="w-full p-2 border border-gray-500 bg-transparent rounded"
            />
            <button onClick={fork} disabled={isForking} className="mt-4 px-4 py-2 border dark:border-white border-black rounded">
              {isForking ? "Forking..." : "Fork"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Resizable Panels */}
      <ResizablePanelGroup direction={direction} className="flex-grow">
        <ResizablePanel defaultSize={50} className="m-2 mr-1 flex flex-col rounded-lg dark:bg-[#1e1e1e] bg-gray-100">
          {!showContent ? (
            <>
              <div className="flex justify-between">
                <div className="my-auto ml-3">
                  <IconCode className="inline my-auto" /> Code
                </div>
                <div className="flex items-center gap-2">
                  <div onClick={handleViewDetailsClick}>View Details</div>
                  <div className="h-[20px] bg-gray-300 w-[1px]"></div>
                  <IconPlayerPlay onClick={runCode} />
                  <div className="h-[20px] bg-gray-300 w-[1px]"></div>
                  <IconGitFork onClick={() => setShowForkDialog(true)} />
                  <div className="h-[20px] bg-gray-300 w-[1px]"></div>
                  <Select onValueChange={(value) => setLanguage(value)} value={language}>
                    <SelectTrigger className="w-[180px] bg-gray-100 border-0 focus:border-0 active:border-0">
                      <SelectValue placeholder="Python" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="C++">C++</SelectItem>
                      <SelectItem value="Java">Java</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="Bash">Bash</SelectItem>
                      <SelectItem value="Ruby">Ruby</SelectItem>
                      <SelectItem value="Go">Go</SelectItem>
                      <SelectItem value="PHP">PHP</SelectItem>
                      <SelectItem value="Kotlin">Kotlin</SelectItem>
                      <SelectItem value="Rust">Rust</SelectItem>
                      <SelectItem value="TypeScript">TypeScript</SelectItem>
                      <SelectItem value="Swift">Swift</SelectItem>
                      <SelectItem value="Perl">Perl</SelectItem>
                      <SelectItem value="Haskell">Haskell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-grow">
                <MonacoEditor
                  height="100%"
                  language={language === "C++" ? 'cpp' : (language.toLowerCase())}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme={editorTheme}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                  }}
                  className="border border-gray-500 rounded-lg h-full pt-2  bg-white dark:bg-[#1e1e1e]"
                />
              </div>
            </>
          ) : (
            <ContentComponent content={content} setShowContent={setShowContent} />
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} className="m-2 ml-1">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25} className="mb-1 rounded-lg">
              <div className="flex flex-col h-full items-center justify-center dark:bg-[#1e1e1e] bg-gray-100">
                <div className="flex flex-row w-full">
                  <div className="text-left p-2"> &gt; Stdin</div>
                  <div></div>
                </div>
                <textarea
                  placeholder="Enter input for the program"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-lg p-3 resize-none dark:bg-[#1e1e1e] dark:text-white border  border-gray-500 w-full h-full"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} className="mt-1 rounded-lg">
              <div className="flex flex-col h-full dark:bg-[#1e1e1e] items-center justify-center bg-gray-100 dark:text-white text-black">
                <div className="flex flex-row justify-between w-full">
                  <div className="text-left p-2"> &lt; Stdout/Stderr</div>
                  <div className="my-auto pr-2">{output.timeTaken}</div>
                </div>
                <div className="rounded-lg p-3 dark:bg-[#1e1e1e] bg-white dark:text-white overflow-auto text-sm whitespace-pre-wrap border border-gray-500 w-full h-full">
                  <pre>{output.stdout + output.stderr}</pre>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
