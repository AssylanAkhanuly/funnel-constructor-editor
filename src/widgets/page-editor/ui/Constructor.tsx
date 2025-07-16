"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@/features/editor/ui";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Constructor({
  pages,
}: {
  pages: { key: string; content: string }[];
}) {
  const [activeTab, setActiveTab] = useState("editor");
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    // uploadMdxFile("test/1.mdx", markdown);
  }, [markdown]);
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Funnel Constructor Editor</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Page
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

        <TabsContent value="editor" className="flex-1 p-4">
          <Editor markdown={markdown} onChange={setMarkdown} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
