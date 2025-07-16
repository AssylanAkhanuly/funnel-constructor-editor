"use client";
// InitializedMDXEditor.tsx
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
import { ImageIcon } from "lucide-react";
import type { ForwardedRef } from "react";
import { CustomMDXProps } from "../types";
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
              <InsertImage quizVersion={quizVersion} pageId={pageId} />
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
