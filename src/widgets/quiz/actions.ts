"use server";

import {
  createFolder,
  listFilesInFolder,
  listSubfolders,
  quizFolderPath,
  uploadMdxFile,
} from "@/shared/lib/s3";
import matter from "gray-matter";
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
  await uploadMdxFile(filename, frontmatter);
  console.log("success");
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
    }));
  return quizPages;
};
