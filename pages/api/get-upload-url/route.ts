import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dotenv from 'dotenv'; 
dotenv.config();
const ACCESS_KEY=process.env.AWS_ACCESS_KEY
const SECRET_ACCESS_KEY=process.env.SECRET_AWS_ACCESS_KEY

export async function GET() {
  // In a real scenario, these would be environment variables
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: `${ACCESS_KEY}`,
      secretAccessKey: `${SECRET_ACCESS_KEY}`,
    },
  })

  const command = new PutObjectCommand({
    Bucket: "YOUR_BUCKET_NAME",
    Key: `uploads/${Date.now()}.jpg`,
    ContentType: "image/jpeg",
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return new Response(JSON.stringify({ url: signedUrl }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return new Response(JSON.stringify({ error: "Failed to generate upload URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}