"use server";

import {
  createFolder,
  deleteFile,
  getFile,
  listFilesInFolder,
  listSubfolders,
  quizFolderPath,
  uploadFile,
} from "@/shared/lib/s3";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { PageType } from "./types";
export const createQuizVersion = async (name: string) => {
  await createFolder(`${quizFolderPath}/${name}`);
  return;
};

export const createQuizPage = async (
  quizVersion: string,
  {
    id,
    order,
    type,
  }: {
    id: string;
    order: string;
    type: PageType;
  }
) => {
  const frontmatter = `---
id: ${id}
order: ${order}
type: ${type}
---
`;
  const filename = `${quizFolderPath}/${quizVersion}/${id}.mdx`;
  await uploadFile(filename, frontmatter);
  revalidatePath(`/${quizVersion}`);
  return;
};
export const listQuizVersions = async () => {
  const folders = await listSubfolders(quizFolderPath);
  const quizVersions = folders.map((folder) => folder.replace(/^quiz\//, ""));
  return quizVersions;
};
export const listQuizPages = async (version: string) => {
  const files = await listFilesInFolder(`${quizFolderPath}/${version}`);
  const quizPages = files
    // Only include files directly in the version folder (no subfolders) and skip folders (no content)
    .filter((file) => {
      const relativePath = file.key?.replace(
        `${quizFolderPath}/${version}/`,
        ""
      );
      // Exclude folders (no content or no .mdx extension)
      return (
        !relativePath?.includes("/") &&
        file.content &&
        file.key?.endsWith(".mdx")
      );
    })
    .map((file) => ({
      key: file.key as string,
      frontmatter: matter(file.content).data as { id: string; order: string },
      content: file.content,
    }))
    .sort((a, b) => Number(a.frontmatter.order) - Number(b.frontmatter.order));
  return quizPages;
};
export const getPage = async (quizVersion: string, pageId: string) => {
  const page = await getFile(`${quizFolderPath}/${quizVersion}/${pageId}.mdx`);
  return page;
};

export const updateQuizPageFrontmatter = async (
  quizVersion: string,
  pageId: string,
  updates: Partial<Record<string, any>>
) => {
  const filePath = `${quizFolderPath}/${quizVersion}/${pageId}.mdx`;
  const file = await getFile(filePath);
  const parsed = matter(file.content);

  // Update only the given properties
  const newData = { ...parsed.data, ...updates };
  const newContent = matter.stringify(parsed.content, newData);
  await uploadFile(filePath, newContent);
  revalidatePath(`/${quizVersion}`);
  return;
};

export const deleteQuizPage = async (quizVersion: string, pageId: string) => {
  const filePath = `${quizFolderPath}/${quizVersion}/${pageId}.mdx`;
  await deleteFile(filePath);
  revalidatePath(`/${quizVersion}`);
  return;
};
