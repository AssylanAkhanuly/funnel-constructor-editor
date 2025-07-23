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
import matter from "gray-matter";
import { Globe, Monitor, SaveIcon, Smartphone, Split } from "lucide-react";
import { MDXRemote } from "next-mdx-remote";
import { useState } from "react";
import { toast } from "sonner";
import { saveMdxFile } from "../actions";
import { COMPONENTS } from "../const";
import { useEditor as useConstructorEditor } from "../hooks";
import { getPlugins } from "../utils";

const extractChildren = (markdown: string, tagName: string) => {
  const regex = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = regex.exec(markdown);
  return match?.[1]?.trim() || "";
};

function Constructor({
  page,
  quizVersion,
  pageId,
}: {
  page: { key: string; content: string };
  quizVersion: string;
  pageId: string;
}) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  const {
    markdown: desktopMarkdown,
    mdxSource: desktopMdxSource,
    setMarkdown: setDesktopMarkdown,
  } = useConstructorEditor({
    initalMarkdown: extractChildren(page.content, "Desktop"),
  });
  const {
    markdown: mobileMarkdown,
    mdxSource: mobileMdxSource,
    setMarkdown: setMobileMarkdown,
  } = useConstructorEditor({
    initalMarkdown: extractChildren(page.content, "Mobile"),
  });
  const {
    markdown: sharedMarkdown,
    mdxSource: sharedMdxSource,
    setMarkdown: setSharedMarkdown,
  } = useConstructorEditor({
    initalMarkdown: desktopMarkdown && mobileMarkdown ? "" : page.content,
  });
  const [viewMode, setViewMode] = useState<"shared" | "split">(
    sharedMarkdown ? "shared" : "split"
  );

  const handleSave = async () => {
    if (viewMode === "split") {
      const { data: frontmatter } = matter(page.content);
      const frontmatterString = Object.entries(frontmatter)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      const newMarkdown = `---\n${frontmatterString}\n---\n\n<Desktop>\n${desktopMarkdown}\n</Desktop>\n\n<Mobile>\n${mobileMarkdown}\n</Mobile>`;
      await saveMdxFile(quizVersion, pageId, newMarkdown);
      toast.success("Saved!");
    } else {
      await saveMdxFile(quizVersion, pageId, sharedMarkdown);
      toast.success("Saved!");
    }
  };
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
            <Button onClick={handleSave}>
              <SaveIcon />
              Save
            </Button>
          </div>
        </div>

        <Tabs
          value={viewMode}
          onValueChange={(e) => setViewMode(e as "split" | "shared")}
          className="flex-1 flex flex-col"
        >
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="shared">
              <Globe className="w-4 h-4 mr-2" />
              Shared
            </TabsTrigger>
            <TabsTrigger value="split">
              <Split className="w-4 h-4 mr-2" />
              Split
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shared" className="flex-1 p-4 flex">
            <Editor
              plugins={getPlugins(quizVersion, pageId)}
              quizVersion={quizVersion}
              pageId={pageId}
              className="flex-1"
              markdown={sharedMarkdown}
              onChange={setSharedMarkdown}
            />
            <div className="flex-1 p-4">
              {sharedMdxSource && (
                <MDXRemote {...sharedMdxSource} components={COMPONENTS} />
              )}
            </div>
          </TabsContent>
          <TabsContent value="split">
            <Tabs
              value={deviceMode}
              onValueChange={(e) => setDeviceMode(e as "desktop" | "mobile")}
            >
              <TabsList className="mx-4 ">
                <TabsTrigger value="desktop">
                  <Monitor />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="mobile">
                  <Smartphone />
                  Mobile
                </TabsTrigger>
              </TabsList>
              <TabsContent value="desktop" className="flex-1 p-4 flex">
                <Editor
                  plugins={getPlugins(quizVersion, pageId)}
                  quizVersion={quizVersion}
                  pageId={pageId}
                  className="flex-1"
                  markdown={desktopMarkdown}
                  onChange={setDesktopMarkdown}
                />
                <div className="flex-1 p-4">
                  {desktopMdxSource && (
                    <MDXRemote {...desktopMdxSource} components={COMPONENTS} />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="mobile" className="flex-1 p-4 flex">
                <Editor
                  quizVersion={quizVersion}
                  pageId={pageId}
                  plugins={getPlugins(quizVersion, pageId)}
                  className="flex-1"
                  markdown={mobileMarkdown}
                  onChange={setMobileMarkdown}
                />
                <div className="flex-1 p-4">
                  {mobileMdxSource && (
                    <MDXRemote {...mobileMdxSource} components={COMPONENTS} />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
export default Constructor;
