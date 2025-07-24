"use server";
import { quizFolderPath, uploadFile } from "@/shared/lib/s3";

export const uploadMedia = async (
  quizVersion: string,
  pageId: string,
  file: File
) => {
  const url = `${quizFolderPath}/${quizVersion}/media/${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await uploadFile(
    `${quizFolderPath}/${quizVersion}/media/${file.name}`,
    buffer,
    file.type
  );
  console.log(file.type, file.name)
  const fullURL = `${process.env.AWS_BASE_URL}/${url}`;
  return fullURL;
};
