"use client";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DEFAULT_USER } from "./const";
export const useEditor = ({ initalMarkdown }: { initalMarkdown: string }) => {
  const [markdown, setMarkdown] = useState(initalMarkdown);
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

  useEffect(() => {
    const { content } = matter(markdown);
    debouncedMDXSource(content);
  }, [markdown]);
  return { mdxSource, markdown, setMarkdown  };
};
