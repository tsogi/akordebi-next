import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set the maximum file size
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, fileName } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: 'Image and fileName are required' });
    }

    // Always use us-east-1 region for authorization
    const region = 'us-east-1';
    const bucketName = process.env.S3_BUCKET_NAME;
    
    // Configure S3 client with the specific endpoint and fixed region
    const s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      // Don't use force path style as it can cause issues
      forcePathStyle: false
    });

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Set up S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: `tabs/${fileName}`,
      Body: buffer,
      ContentType: getImageMimeType(image),
    };

    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct a virtual-hosted style URL (more reliable)
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/tabs/${fileName}`;
    
    res.status(200).json({ 
      success: true, 
      url: imageUrl 
    });
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message,
      code: error.Code,
      region: error.$metadata?.region || 'unknown'
    });
  }
}

function getImageMimeType(base64String) {
  // Extract the MIME type from the base64 string
  const match = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  return match ? match[1] : 'image/jpeg'; // Default to image/jpeg if no match
} 