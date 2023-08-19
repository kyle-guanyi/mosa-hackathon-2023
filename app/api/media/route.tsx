import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
): Promise<string> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const url = getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return url;
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file"); // Get all files

    const uploadedUrls = await Promise.all(files.map(async (file) => {
      const mimeType = file.type;
      const fileExtension = mimeType.split("/")[1];
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const url = await uploadImageToS3(
        buffer,
        uuid() + "." + fileExtension,
        mimeType
      );

      return url;
    }));

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json({ message: "Error uploading images" });
  }
}