import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

function getClient() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
  contentDisposition?: string
) {
  if (!BUCKET || !PUBLIC_URL) {
    throw new Error(
      "R2 is not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in .env"
    );
  }

  await getClient().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      ...(contentDisposition
        ? { ContentDisposition: contentDisposition }
        : {}),
    })
  );

  return `${PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}

export async function listR2Objects(prefix: string) {
  if (!BUCKET || !PUBLIC_URL) return [];

  const base = PUBLIC_URL.replace(/\/$/, "");
  const objects: { key: string; url: string; filename: string }[] = [];
  let continuationToken: string | undefined;

  do {
    const result = await getClient().send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of result.Contents ?? []) {
      if (!obj.Key || obj.Key.endsWith("/")) continue;
      objects.push({
        key: obj.Key,
        url: `${base}/${obj.Key}`,
        filename: obj.Key.split("/").pop() ?? obj.Key,
      });
    }
    continuationToken = result.IsTruncated
      ? result.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return objects;
}

export async function deleteFromR2(url: string) {
  if (!BUCKET || !PUBLIC_URL) return;

  const prefix = `${PUBLIC_URL.replace(/\/$/, "")}/`;
  if (!url.startsWith(prefix)) return;
  const key = url.slice(prefix.length);

  try {
    await getClient().send(
      new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
    );
  } catch {
    // Object already gone — nothing left to clean up.
  }
}
