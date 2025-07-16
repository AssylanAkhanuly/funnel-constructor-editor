"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@/features/editor/ui";
import { evaluate } from "@mdx-js/mdx";
import { Edit, SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { saveMdxFile } from "../actions";
function Constructor({
  page,
  quizVersion,
  pageId,
}: {
  page: { key: string; content: string };
  quizVersion: string;
  pageId: string;
}) {
  const [activeTab, setActiveTab] = useState("editor");
  const [markdown, setMarkdown] = useState(page.content);
  const [Preview, setPreview] = useState<React.ComponentType | null>(null);
  const parseMDX = useCallback(async (content: string) => {
    try {
      const { default: Content } = await evaluate(content, {
        ...runtime,
        useMDXComponents: () => ({}),
        remarkPlugins: [remarkGfm],
      });
      setPreview(() => Content);
    } catch (error) {
      console.error("MDX parsing error:", error);
      setPreview(() => () => <div>Error parsing markdown</div>);
    }
  }, []);

  useEffect(() => {
    parseMDX(markdown);
  }, [parseMDX, markdown]);
  return (
    <>
      <Toaster />
      <div className="w-full h-screen flex flex-col bg-gray-50">
        <div className="flex items-center justify-between border-b bg-white p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Quiz</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${quizVersion}`}>
                  {quizVersion}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageId}.mdx</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <Button
              onClick={async () => {
                await saveMdxFile(quizVersion, pageId, markdown);
                toast.success("Saved!");
              }}
            >
              <SaveIcon />
              Save
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="editor">
              <Edit className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 p-4 flex">
            <Editor
              className="flex-1"
              markdown={markdown}
              onChange={setMarkdown}
            />
            <div className="flex-1 p-4">{Preview && <Preview />}</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
export default Constructor;
