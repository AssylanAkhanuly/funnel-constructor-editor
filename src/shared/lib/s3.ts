import {
  DeleteObjectCommand, GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  requestStreamBufferSize: 32 * 1024,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const quizFolderPath = "quiz";
export const mediaFolderPath = "media";
async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function listFilesInFolder(folderPath = "test") {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET,
    Prefix: folderPath.endsWith("/") ? folderPath : folderPath + "/",
  });

  const response = await s3.send(command);
  const files = (response.Contents || []).map((item) => item.Key);
  const fileContents = [];

  for (const key of files) {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
    const response = await s3.send(getCommand);
    const content = await streamToString(response.Body);

    fileContents.push({ key, content });
  }
  return fileContents;
}

export async function uploadFile(
  filename: string,
  content: string | File | Buffer,
  contentType = "text/markdown"
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: filename, // e.g., "docs/page.mdx"
    Body: content, // string
    ContentType: contentType, // or "text/x-markdown" or "text/plain"
  });

  await s3.send(command);
  console.log("✅ Uploaded:", filename);
}

export async function listSubfolders(folderPath: string) {
  const key = folderPath.endsWith("/") ? folderPath : folderPath + "/";
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET,
    Prefix: key,
    Delimiter: "/",
  });

  const response = await s3.send(command);

  const folders = (response.CommonPrefixes || []).map((p) => p.Prefix);
  return folders as string[];
}
export async function createFolder(folderPath: string) {
  const key = folderPath.endsWith("/") ? folderPath : folderPath + "/";
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: "", // empty content
  });

  await s3.send(command);
  console.log("📁 Folder created:", key);
}

export async function getFile(filePath: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: filePath,
  });
  const response = await s3.send(command);

  const content = await streamToString(response.Body);

  return { key: filePath, content };
}

export async function deleteFile(filePath: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: filePath,
  });

  await s3.send(command);
 
}
