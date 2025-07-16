"use server";

import {
  createFolder,
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
    .filter((file) => file.key !== `${quizFolderPath}/${version}/`)
    .map((file) => ({
      key: file.key as string,
      frontmatter: matter(file.content).data as { id: string; order: string },
    }))
    .sort((a, b) => Number(a.frontmatter.order) - Number(b.frontmatter.order));
  return quizPages;
};
export const getPage = async  (quizVersion:string, pageId:string) => { 
  const page = await getFile(`${quizFolderPath}/${quizVersion}/${pageId}.mdx`)
  return page 
}