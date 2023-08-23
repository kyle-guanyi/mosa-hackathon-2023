import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { String } from "aws-sdk/clients/cloudhsm";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

async function uploadImageToS3(
  file: Buffer,
  fileName: string,
  type: string
): Promise<{url: Promise<string>, key: string }> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const url = getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { url, key: params.Key };
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file"); // Get all files

    const uploadedData = await Promise.all(files.map(async (file) => {
      const mimeType = file.type;
      const fileExtension = mimeType.split("/")[1];
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const { url, key } = await uploadImageToS3(
        buffer,
        uuid() + "." + fileExtension,
        mimeType
      );

      return { url: await url, key };
    }));

    const keysArray = uploadedData.map(data => data.key);

    return NextResponse.json({ success: true, uploadedData, keysArray });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json({ message: "Error uploading images" });
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const url = new URL(request.url);
    const keys = url.searchParams.get('keys');

    const keysArray = JSON.parse(keys);

    const presignedUrls = await Promise.all(keysArray.map(async (key) => {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: key,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return url;
    }));

    return NextResponse.json({ success: true, urls: presignedUrls });
  } catch (error) {
    console.error("Error fetching S3 images:", error);
    return NextResponse.json({ message: "Error fetching images" });
  }
}