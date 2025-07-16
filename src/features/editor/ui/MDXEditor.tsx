"use client";
// InitializedMDXEditor.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
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
import {
  CircleQuestionMark,
  ImageIcon,
  MousePointerClickIcon,
  PlusSquareIcon,
} from "lucide-react";
import type { ForwardedRef } from "react";
import { CustomMDXProps } from "../types";
import ButtonEditor from "./button-editor";
import MediaEditor from "./media-editor";
import OptionsEditor from "./single-default-quiz-editor";

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
  {
    name: "SingleDefaultQuiz",
    kind: "flow",
    props: [],
    hasChildren: true,
    Editor: OptionsEditor,
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
      variant="ghost"
      title="Insert Media"
      size={"sm"}
      className="flex items-center gap-2"
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
      variant="ghost"
      title="Insert Button"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "Button",
          kind: "flow",
          props: {
            children: "Button Text",
          },
        })
      }
    >
      <MousePointerClickIcon className="size-5" />
      Button
    </Button>
  );
};
const InsertSingleDefault = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      variant="ghost"
      title="Insert Single Default Quiz"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "SingleDefaultQuiz",
          kind: "flow",
          children: [],
          props: {
            options: JSON.stringify([
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]),
          },
        })
      }
    >
      <CircleQuestionMark className="size-5" />
      Single Default Quiz
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
                  <DropdownMenuItem>
                    <InsertSingleDefault />
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
