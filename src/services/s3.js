import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Always use us-east-1 region for authorization
const region = 'us-east-1';
const bucketName = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Don't use force path style as it can cause issues
  forcePathStyle: false
});

export async function uploadImageToS3(base64Image, fileName) {
  // Extract the actual base64 data (remove the data:image/xxx;base64, part)
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, 'base64');
  
  const params = {
    Bucket: bucketName,
    Key: `tabs/${fileName}`,
    Body: buffer,
    ContentType: getImageMimeType(base64Image),
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct a virtual-hosted style URL (more reliable)
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/tabs/${fileName}`;
    
    return imageUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

function getImageMimeType(base64String) {
  // Extract the MIME type from the base64 string
  const match = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  return match ? match[1] : 'image/jpeg'; // Default to image/jpeg if no match
}

export default {
  uploadImageToS3
}; 