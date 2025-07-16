"use client";
// InitializedMDXEditor.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  Button,
  frontmatterPlugin,
  headingsPlugin,
  InsertFrontmatter,
  insertJsx$,
  JsxComponentDescriptor,
  jsxPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
  usePublisher,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { ImageIcon, MousePointerClickIcon, PlusSquareIcon } from "lucide-react";
import type { ForwardedRef } from "react";
import { CustomMDXProps } from "../types";
import ButtonEditor from "./button-editor";
import MediaEditor from "./media-editor";

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "Image",
    kind: "flow",
    props: [
      { name: "src", type: "string" },
      { name: "mediaType", type: "string" },
    ],
    hasChildren: false,
    Editor: MediaEditor,
  },
  {
    name: "Button",
    kind: "flow",
    props: [],
    hasChildren: true,
    Editor: ButtonEditor,
  },
];

const InsertImage = ({
  quizVersion,
  pageId,
}: {
  quizVersion: string;
  pageId: string;
}) => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      title="Insert Upload"
      className="w-full flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "Image",
          kind: "flow",
          props: {
            quizVersion,
            pageId,
          },
        })
      }
    >
      <ImageIcon className="size-5" />
      Image
    </Button>
  );
};

const InsertButton = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      title="Insert Button"
      className="w-full flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "Button",
          kind: "flow",
          props: {},
        })
      }
    >
      <MousePointerClickIcon className="size-5" />
      Button
    </Button>
  );
};

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  quizVersion,
  pageId,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps &
  CustomMDXProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin({
          allowedHeadingLevels: [1, 2, 3],
        }),
        listsPlugin({
          options: ["bullet", "number"],
        }),
        markdownShortcutPlugin(),
        linkPlugin(),
        quotePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex items-center">
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <InsertFrontmatter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PlusSquareIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <InsertImage quizVersion={quizVersion} pageId={pageId} />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <InsertButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
        jsxPlugin({ jsxComponentDescriptors }),
        frontmatterPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
