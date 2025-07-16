"use server";

import { quizFolderPath, uploadFile } from "@/shared/lib/s3";

export const saveMdxFile = async (
  quizVersion: string,
  pageId: string,
  content: string
) => {
  await uploadFile(
    `${quizFolderPath}/${quizVersion}/${pageId}.mdx`,
    content
  );

  return;
};
