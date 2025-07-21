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
import Media from "@/features/editor/ui/media";
import PageMobileHeader from "@/features/funnel-components/Header/PageMobileHeader";
import { Progress } from "@/features/funnel-components/Progress/Progress";
import MultiSelectCheckbox from "@/features/funnel-components/Select/ui/MultiSelectMain";
import SingleSelectMain from "@/features/funnel-components/Select/ui/SingleSelectMain";
import { evaluate } from "@mdx-js/mdx";
import matter from "gray-matter";
import { Edit, SaveIcon } from "lucide-react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { saveMdxFile } from "../actions";
import { DEFAULT_USER } from "../const";
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
  const parseMDX = async (content: string) => {
    try {
      const { default: Content } = await evaluate(content, {
        ...runtime,
        useMDXComponents: () => ({
          Image: Media,
          FooterButton: (props) => {
            return <Button>{props.text}</Button>;
          },
          Button: () => {
            return <Button>sdf</Button>;
          },
          SingleDefaultQuiz: (props: { options: string }) => {
            const options = JSON.parse(props.options) as {
              label: string;
              value: string;
            }[];
            return (
              <SingleSelectMain
                options={options.map((option) => ({
                  title: option.label,
                  custom_id: option.value,
                }))}
                selectedOptionId={undefined}
                onChangeOption={() => {}}
              />
            );
          },
        }),
        remarkPlugins: [remarkGfm],
      });
      setPreview(() => Content);
    } catch (error) {
      console.error("MDX parsing error:", error);
      setPreview(() => () => <div>Error parsing markdown</div>);
    }
  };
  const debounced = useDebouncedCallback(parseMDX, 2000);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  > | null>(null);
  const getMDXSource = async (content: string) => {
    const mdxSource = await serialize(content, {
      scope: { user: DEFAULT_USER },
    });
    setMdxSource(mdxSource);
  };
  const debouncedMDXSource = useDebouncedCallback(getMDXSource, 1000);
  // useEffect(() => {
  //   const { content } = matter(markdown);
  //   debounced(content);
  // }, [markdown]);
  useEffect(() => {
    const { content } = matter(markdown);
    debouncedMDXSource(content);
  }, [markdown]);
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
              quizVersion={quizVersion}
              pageId={pageId}
              className="flex-1"
              markdown={markdown}
              onChange={setMarkdown}
            />
            <div className="flex-1 p-4">
              {/* {Preview && createElement(Preview)} */}
              {mdxSource && (
                <MDXRemote
                  {...mdxSource}
                  components={{
                    Desktop: (props) => {
                      return <div className="hidden md:block">{props.children}</div>;
                    },
                    Image: Media,
                    FooterButton: (props) => {
                      return <Button>{props.text}</Button>;
                    },
                    PageHeader: PageMobileHeader,
                    Progress: Progress,
                    SingleDefaultQuiz: (props: { options: string }) => {
                      const options = JSON.parse(props.options) as {
                        label: string;
                        value: string;
                      }[];
                      return (
                        <SingleSelectMain
                          options={options.map((option) => ({
                            title: option.label,
                            custom_id: option.value,
                          }))}
                          selectedOptionId={undefined}
                          onChangeOption={() => {}}
                        />
                      );
                    },
                    MultiSelectCheckbox: (props: { options: string }) => {
                      const options = JSON.parse(props.options) as {
                        label: string;
                        value: string;
                      }[];
                      return (
                        <MultiSelectCheckbox
                          options={options.map((option) => ({
                            title: option.label,
                            custom_id: option.value,
                          }))}
                          selectedOptionIds={[]}
                          onChangeOption={() => {}}
                        />
                      );
                    },
                  }}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
export default Constructor;
