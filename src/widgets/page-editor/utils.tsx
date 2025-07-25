"use client";
// InitializedMDXEditor.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ButtonEditor from "@/features/editor/ui/button-editor";
import HeaderEditor from "@/features/editor/ui/header-editor";
import ImageEditor from "@/features/editor/ui/image-editor";
import LottieEditor from "@/features/editor/ui/lottie-editor";
import MultiSelectCheckboxEditor from "@/features/editor/ui/multi-select-checkbox-editor";
import ProgressEditor from "@/features/editor/ui/progress-editor";
import OptionsEditor from "@/features/editor/ui/single-options-editor";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  frontmatterPlugin,
  headingsPlugin,
  insertJsx$,
  JsxComponentDescriptor,
  jsxPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  rootEditor$,
  toolbarPlugin,
  UndoRedo,
  useCellValue,
  usePublisher,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { $getSelection, $isRangeSelection } from "lexical";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Antenna,
  CircleQuestionMark,
  Film,
  ImageIcon,
  LoaderCircle,
  MousePointerClickIcon,
  PlusSquareIcon,
} from "lucide-react";
import { CSSProperties } from "react";
import { v4 } from "uuid";

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
const InsertSingleQuiz = ({
  label,
  componentName,
  quizVersion,
  pageId,
}: {
  label: string;
  componentName: string;
  quizVersion: string;
  pageId: string;
}) => {
  const insertJsx = usePublisher(insertJsx$);
  return (
    <Button
      variant="ghost"
      title="Insert Single Default Quiz"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: componentName,
          kind: "flow",
          children: [],
          props: {
            options: JSON.stringify([
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]),
            quizVersion,
            pageId,
          },
        })
      }
    >
      <CircleQuestionMark className="size-5" />
      {label}
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
      <Antenna className="size-5" />
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
      <LoaderCircle className="size-5" />
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
            options: JSON.stringify([{ label: "Option 1", value: v4() }]),
          },
        })
      }
    >
      <CircleQuestionMark className="size-5" />
      Multi Select Checkbox
    </Button>
  );
};

const InsertLottie = ({
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
      title="Insert Progress"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() =>
        insertJsx({
          name: "Lottie",
          kind: "flow",
          children: [],
          props: {
            quizVersion,
            pageId,
          },
        })
      }
    >
      <Film className="size-5" />
      Lottie
    </Button>
  );
};

const Align = () => {
  const editor = useCellValue(rootEditor$);

  const alignText = (textAlign: CSSProperties["textAlign"]) => {
    editor?.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // const nodes = selection?.getNodes();
        // nodes?.map((node) => {
        //   if ($isParagraphNode(node) || node.getType() === "heading") {
        //     const parent = node.getParent();
        //     if ($isGenericHTMLNode(parent) && parent.getTag() === "div") {
        //       parent.updateAttributes([
        //         {
        //           type: "mdxJsxAttribute",
        //           name: "className",
        //           value: "text-center",
        //         },
        //       ]);
        //     } else {
        //       const parent = $createGenericHTMLNode(
        //         "div",
        //         "mdxJsxFlowElement",
        //         [
        //           {
        //             type: "mdxJsxAttribute",
        //             name: "className",
        //             value: "text-center",
        //           },
        //         ]
        //       );
        //       parent.set
        //     }
        //   }
        // });
      } else {
        console.log(selection);
      }
    });
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        title="Align Center"
        size={"sm"}
        className="flex items-center gap-0.5"
        onClick={() => alignText("left")}
      >
        <AlignLeft className="size-5" />
      </Button>
      <Button
        variant="ghost"
        title="Align Center"
        size={"sm"}
        className="flex items-center gap-2"
        onClick={() => alignText("center")}
      >
        <AlignCenter className="size-5" />
      </Button>
      <Button
        variant="ghost"
        title="Align Center"
        size={"sm"}
        className="flex items-center gap-2"
        onClick={() => alignText("right")}
      >
        <AlignRight className="size-5" />
      </Button>
    </div>
  );
};
const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "Image",
    kind: "flow",
    props: [
      { name: "src", type: "string" },
      { name: "mediaType", type: "string" },
    ],
    hasChildren: false,
    Editor: ImageEditor,
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
    name: "SingleRatingNumeric",
    kind: "flow",
    props: [],
    hasChildren: false,
    Editor: OptionsEditor,
  },
  {
    name: "SingleSelectRectangle",
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
  {
    name: "Lottie",
    kind: "flow",
    props: [
      {
        name: "options",
        type: "string",
      },
    ],
    hasChildren: false,
    Editor: LottieEditor,
  },
];

export const getPlugins = (quizVersion: string, pageId: string) => [
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
        <Align />
        {/* <InsertFrontmatter /> */}
        <AlertDialog>
          <AlertDialogTrigger>
            <PlusSquareIcon />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-3xl md:max-w-5xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Insert components</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid grid-cols-5 gap-2 items-start">
              <AlertDialogAction asChild>
                <InsertImage quizVersion={quizVersion} pageId={pageId} />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertButton />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertSingleQuiz
                  quizVersion={quizVersion}
                  pageId={pageId}
                  label="Single Default Quiz"
                  componentName="SingleDefaultQuiz"
                />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertSingleQuiz
                  quizVersion={quizVersion}
                  pageId={pageId}
                  label="Single Rating Numeric"
                  componentName="SingleRatingNumeric"
                />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertSingleQuiz
                  quizVersion={quizVersion}
                  pageId={pageId}
                  label="Single Select Rectangle"
                  componentName="SingleSelectRectangle"
                />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertPageHeader />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertProgress />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertMultiSelectCheckbox />
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <InsertLottie quizVersion={quizVersion} pageId={pageId} />
              </AlertDialogAction>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction>Done</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  }),
  jsxPlugin({ jsxComponentDescriptors }),
  frontmatterPlugin(),
];
