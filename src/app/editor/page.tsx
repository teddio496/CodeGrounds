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
  IconGitFork,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useTheme } from "@/src/context/ThemeContext";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeEditorPage() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("Python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ stdout: "", stderr: "", timeTaken: "" });
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [showForm, setShowForm] = useState(false);
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("vs-light");

  useEffect(() => {
    // Update the Monaco Editor theme based on the app's current theme
    setEditorTheme(theme === "dark" ? "vs-dark" : "vs-light");
  }, [theme]);

  useEffect(() => {
    const updateLayout = () => {
      setDirection(window.innerWidth < 768 ? "vertical" : "horizontal");
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    console.log(language);
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
        setCode("console.log(\"Hello, World!\");");
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
      case "TypeScript":
        setCode("console.log(\"Hello, World!\");");
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


  const runCode = async () => {
    try {
      console.log("CODE IS RUNNING");
      const response = await fetch("/api/visitor/execution", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, input, language }),
      });
      const result = await response.json();
      console.log(result);
      setOutput(result.output || {});
      if (result.output.stdout && !result.output.stderr) {
        toast.success("Code execution was successful!", { duration: 10000 });
      } else if (result.output.stdout && result.output.stderr) {
        toast.error("Code execution failed during execution", { duration: 10000 });
      } else if (!result.output.stdout && result.output.stderr) {
        toast.error("Code execution was NOT successful :(", { duration: 10000 });
      } else {
        toast.success("Code execution was successful, but no outputs. ", { duration: 10000 });
      }
    } catch (error) {
      setOutput({ ...output, stderr: "Error executing code." });
      console.log("here is the error", error);
    }
  };

  const handleSaveClick = () => {
    setShowForm(true);
  };

  interface FormComponentProps {
    code: string;
    language: string;
    onClose: () => void;
  }

  const FormComponent: React.FC<FormComponentProps> = ({ code, language }) => {
    const [title, setTitle] = useState("");
    const [explanation, setExplanation] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const addTag = () => {
      if (newTag.trim() && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag.trim()]);
        setNewTag("");
      }
    };

    const removeTag = (tagToRemove: string) => {
      setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async (e: any) => {
      e.preventDefault();

      try {
        const payload = {
          title,
          explanation,
          tags,
          language,
          code,
          isPublic,
        };

        const response = await fetch("/api/auth/protected/template/save-template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          toast("Template saved successfully!");
          setShowForm(false);
        } else {
          console.error(result.error);
          if (result.error.includes("jwt")) {
            toast("You must he logged in to save a template!");
          } else {
            toast(result.error);
          }
        }
      } catch (error) {
        toast("An unexpected error occurred.");
      }
    };

    return (
      <div className="p-4 dark:bg-[#1e1e1e] text-black dark:text-white rounded relative overflow-y-auto">
        <button
          className="absolute top-2 right-4 text-xl hover:text-gray-300"
          onClick={() => setShowForm(false)}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Save Code Template</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-b border-gray-200 bg-transparent"
              placeholder="Enter a title for your code"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="explanation" className="block text-sm font-medium">
              Explanation
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="mt-1 block w-full rounded-md bg-transparent border border-gray-200"
              placeholder="Enter a brief explanation"
              rows={4}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium">
              Tags
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="mt-1 block w-full border-b border-gray-200 bg-transparent"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-400 dark:bg-transparent dark:border dark:hover:bg-[#333333]"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="dark:bg-transparent dark:border bg-gray-200 px-2 py-1 rounded flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="isPublic" className="text-sm font-medium mr-2">
              Make Public
            </label>
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="form-checkbox"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-400  rounded hover:bg-gray-700 dark:bg-transparent dark:border dark:hover:bg-[#333333]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400  rounded hover:bg-gray-700 dark:bg-transparent dark:border dark:hover:bg-[#333333]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };


  return (
    <div className="dark:text-white min-h-screen flex flex-col text-black">
      <ResizablePanelGroup direction={direction} className="flex-grow">
        <ResizablePanel
          defaultSize={50}
          className="m-2 mr-1 flex flex-col rounded-lg dark:bg-[#1e1e1e] bg-gray-100"
        >
          {!showForm ? (
            <>
              <div className="flex justify-between">
                <div className="my-auto ml-3">
                  <IconCode className="inline my-auto" /> Code
                </div>
                <div className="flex items-center gap-2">
                  <IconPlayerPlay className="rounded-lg text-black hover:bg-gray-200 dark:hover:bg-[#222222] dark:text-white" onClick={runCode} />
                  <div className="h-[20px] bg-gray-500 l w-[1px]"></div>
                  <IconDeviceFloppy onClick={handleSaveClick} />
                  <div className="h-[20px] bg-gray-500  w-[1px]"></div>
                  <Select onValueChange={(value) => setLanguage(value)} value={language}>
                    <SelectTrigger className="w-[180px] bg-gray-100">
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
                  className="border border-gray-500 rounded-lg h-full pt-2 dark:bg-[#1e1e1e] bg-white"
                />

              </div>
            </>
          ) : (
            <FormComponent code={code} language={language} onClose={() => setShowForm(false)} />
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
