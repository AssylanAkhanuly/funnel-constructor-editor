"use client";
// InitializedMDXEditor.tsx
import { Button } from "@/components/ui/button";
import {
  insertJsx$,
  JsxComponentDescriptor,
  MDXEditor,
  usePublisher,
  type MDXEditorMethods,
  type MDXEditorProps
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import {
  CircleQuestionMark,
  ImageIcon,
  MousePointerClickIcon
} from "lucide-react";
import type { ForwardedRef } from "react";
import { uuidv4 } from "zod";
import { CustomMDXProps } from "../types";
import ButtonEditor from "./button-editor";
import HeaderEditor from "./header-editor";
import MediaEditor from "./media-editor";
import MultiSelectCheckboxEditor from "./multi-select-checkbox-editor";
import ProgressEditor from "./progress-editor";
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
    name: "FooterButton",
    kind: "flow",
    props: [{ name: "text", type: "string" }],
    hasChildren: false,
    Editor: ButtonEditor,
  },
  {
    name: "SingleDefaultQuiz",
    kind: "flow",
    props: [],
    hasChildren: false,
    Editor: OptionsEditor,
  },
  {
    name: "PageHeader",
    kind: "flow",
    props: [
      {
        name: "back",
        type: "number",
      },
      {
        name: "logo",
        type: "number",
      },
      {
        name: "burger",
        type: "number",
      },
    ],
    hasChildren: false,
    Editor: HeaderEditor,
  },
  {
    name: "Progress",
    kind: "flow",
    props: [
      {
        name: "back",
        type: "number",
      },
      {
        name: "logo",
        type: "number",
      },
      {
        name: "burger",
        type: "number",
      },
    ],
    hasChildren: false,
    Editor: ProgressEditor,
  },
  {
    name: "MultiSelectCheckbox",
    kind: "flow",
    props: [
      {
        name: "options",
        type: "string",
      },
    ],
    hasChildren: false,
    Editor: MultiSelectCheckboxEditor,
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
          name: "FooterButton",
          kind: "flow",
          props: {
            text: "Button Text",
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
const InsertPageHeader = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      variant="ghost"
      title="Insert Header"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "PageHeader",
          kind: "flow",
          children: [],
          props: {
            back: "true",
            logo: "true",
            burger: "true",
          },
        })
      }
    >
      <CircleQuestionMark className="size-5" />
      Header
    </Button>
  );
};
const InsertProgress = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      variant="ghost"
      title="Insert Progress"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "Progress",
          kind: "flow",
          children: [],
          props: {},
        })
      }
    >
      <CircleQuestionMark className="size-5" />
      Progress
    </Button>
  );
};
const InsertMultiSelectCheckbox = () => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      variant="ghost"
      title="Insert Progress"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "MultiSelectCheckbox",
          kind: "flow",
          children: [],
          props: {
            options: JSON.stringify([{ label: "Option 1", value: uuidv4() }]),
          },
        })
      }
    >
      <CircleQuestionMark className="size-5" />
      Multi Select Checkbox
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
      {...props}
      ref={editorRef}
    />
  );
}
