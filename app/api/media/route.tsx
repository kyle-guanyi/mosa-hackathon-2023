// @ts-nocheck
import {NextRequest, NextResponse} from "next/server";
import {v4 as uuid} from "uuid";
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

/**
 * This function uploads an image to S3.
 */
const s3Client = new S3Client({
  region: process.env.A_REGION as string,
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});

/**
 * This function uploads an image to S3.
 *
 * @param file - The image file
 * @param fileName - The name of the file
 * @param type - The type of the file
 * @returns url - The URL of the uploaded file
 */
async function uploadImageToS3(
  file: Buffer,
  fileName: string,
  type: string
): Promise<{url: Promise<string>, key: string }> {
  // Upload the file to S3
  const params = {
    Bucket: process.env.A_BUCKET_NAME as string,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: type,
  };
  // Upload the file to the bucket
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  // Get the URL of the uploaded file
  const url = getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { url, key: params.Key };
}

/**
 * This function uploads images to S3.
 *
 * @param request - The incoming request object
 * @param response - The outgoing response object
 * @constructor - The function that is called when the route is visited
 * @returns - The response object
 */
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file"); // Get all files
    
    // Upload all files
    const uploadedData = await Promise.all(files.map(async (file) => {
      const mimeType = file.type;
      const fileExtension = mimeType.split("/")[1];
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload the file to S3
      const { url, key } = await uploadImageToS3(
        buffer,
        uuid() + "." + fileExtension,
        mimeType
      );
      // Return the URL and key of the uploaded file
      return { url: await url, key };
    }));

    const keysArray = uploadedData.map(data => data.key);

    return NextResponse.json({ success: true, uploadedData, keysArray });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json({ message: "Error uploading images" });
  }
}

/**
 * This function fetches images from S3.
 *
 * @param request - The incoming request object
 * @param response - The outgoing response object
 * @constructor - The function that is called when the route is visited
 * @returns - The response object
 */
export async function GET(request: NextRequest, response: NextResponse) {
  try {
    // Get the URL of the uploaded file
    const url = new URL(request.url);
    // Get the keys of the files to fetch
    const keys = url.searchParams.get('keys');
    // Upload all files
    const keysArray = JSON.parse(keys);

    // Fetch all files
    const presignedUrls = await Promise.all(keysArray.map(async (key) => {
      // Upload the file to the bucket
      const command = new GetObjectCommand({
        Bucket: process.env.A_BUCKET_NAME as string,
        Key: key,
      });
      // Get the URL of the uploaded file
      return await getSignedUrl(s3Client, command, {expiresIn: 3600});
    }));
    // Return the URL and key of the uploaded file
    return NextResponse.json({ success: true, urls: presignedUrls });
  } catch (error) {
    console.error("Error fetching S3 images:", error);
    return NextResponse.json({ message: "Error fetching images" });
  }
}