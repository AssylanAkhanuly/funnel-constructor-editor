"use server";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StreamingBlobPayloadOutputTypes } from "@smithy/types/dist-types/streaming-payload/streaming-blob-payload-output-types";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
function readableStreamToString(stream: StreamingBlobPayloadOutputTypes) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}
export const getFile = async () => {
  const command = new GetObjectCommand({
    Bucket: "jobescapebackend",
    Key: "media/3.2.5/2000-5000.json",
  });
  const response = await s3.send(command);

  const body = await readableStreamToString(response.Body);
  return body; // string or Buffer
};
export async function uploadMdxFile(filename: string, mdxContent: string) {
  const command = new PutObjectCommand({
    Bucket: "jobescapebackend",
    Key: filename, // e.g., "docs/page.mdx"
    Body: mdxContent, // string
    ContentType: "text/markdown", // or "text/x-markdown" or "text/plain"
  });

  await s3.send(command);
  console.log("✅ Uploaded:", filename);
}
