"use client";
// InitializedMDXEditor.tsx
import {
  BoldItalicUnderlineToggles,
  frontmatterPlugin,
  headingsPlugin,
  InsertFrontmatter,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import type { ForwardedRef } from "react";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        markdownShortcutPlugin(),
        listsPlugin(),
        linkPlugin(),
        quotePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex items-center">
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <InsertFrontmatter />
            </div>
          ),
        }),
        frontmatterPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
