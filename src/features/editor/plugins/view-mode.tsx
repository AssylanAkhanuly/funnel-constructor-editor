import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cell,
  insertJsx$,
  NestedLexicalEditor,
  realmPlugin,
  rootEditor$,
  useCellValue,
  usePublisher,
} from "@mdxeditor/editor";
import { Globe, Monitor, Smartphone, Split } from "lucide-react";
import type { PhrasingContent, Root } from "mdast";
import { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import { useEffect } from "react";
import { visit } from "unist-util-visit";
function hasComponent(tree: Root, componentName: string): boolean {
  let found = false;

  visit(tree, "mdxJsxFlowElement", (node) => {
    if (node.name === componentName) {
      found = true;
    }
  });

  return found;
}

export const deviceMode$ = Cell<"mobile" | "desktop">("desktop");
export const viewMode$ = Cell<"split" | "shared">("shared");
export const viewModePlugin = realmPlugin({
  init(realm) {
    realm.pub(viewMode$, "shared");
    realm.pub(deviceMode$, "desktop");
  },
});

export const ViewMode = () => {
  const viewMode = useCellValue(viewMode$);
  const updateViewMode = usePublisher(viewMode$);
  const deviceMode = useCellValue(deviceMode$);
  const updateDeviceMode = usePublisher(deviceMode$);
  const mdast = useCellValue(rootEditor$);
  const insertJsx = usePublisher(insertJsx$);
  useEffect(() => {
    if (viewMode === "split") {
      insertJsx({
        name: "Desktop",
        props: {},
        children: [],
        kind: "flow",
      });
    } else {
    }
  }, [viewMode, deviceMode]);
  return (
    <>
      <Tabs
        value={viewMode}
        onValueChange={(e) => updateViewMode(e as "split" | "shared")}
      >
        <TabsList>
          <TabsTrigger value="shared">
            <Globe /> Shared
          </TabsTrigger>
          <TabsTrigger value="split">
            <Split />
            Split
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {viewMode == "split" && (
        <Tabs
          value={deviceMode}
          onValueChange={(e) => updateDeviceMode(e as "desktop" | "mobile")}
        >
          <TabsList>
            <TabsTrigger value="desktop">
              <Monitor />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone /> Mobile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </>
  );
};

export const DesktopEditor = () => {
  const viewMode = useCellValue(deviceMode$);
  return (
    <div className="hidden md:block">
      Desktop
      <NestedLexicalEditor<MdxJsxTextElement | MdxJsxFlowElement>
        getContent={(node) => node.children as PhrasingContent[]}
        getUpdatedMdastNode={(mdastNode, children) =>
          ({
            ...mdastNode,
            children,
          } as any)
        }
      />
    </div>
  );
};
