"use server";

import { quizFolderPath, uploadMdxFile } from "@/shared/lib/s3";

export const saveMdxFile = async (
  quizVersion: string,
  pageId: string,
  content: string
) => {
  await uploadMdxFile(
    `${quizFolderPath}/${quizVersion}/${pageId}.mdx`,
    content
  );

  return;
};
