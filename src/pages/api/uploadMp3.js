import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Set the maximum file size for MP3 files
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio, fileName } = req.body;

    if (!audio || !fileName) {
      return res.status(400).json({ error: 'Audio and fileName are required' });
    }

    // Validate file extension
    if (!fileName.toLowerCase().endsWith('.mp3')) {
      return res.status(400).json({ error: 'Only MP3 files are allowed' });
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
    const base64Data = audio.replace(/^data:audio\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Set up S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: `karaoke/${fileName}`,
      Body: buffer,
      ContentType: 'audio/mpeg',
    };

    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct a virtual-hosted style URL (more reliable)
    const audioUrl = `https://${bucketName}.s3.amazonaws.com/karaoke/${fileName}`;
    
    res.status(200).json({ 
      success: true, 
      url: audioUrl 
    });
  } catch (error) {
    console.error('Error uploading MP3 to S3:', error);
    res.status(500).json({ 
      error: 'Failed to upload MP3',
      details: error.message,
      code: error.Code,
      region: error.$metadata?.region || 'unknown'
    });
  }
}
