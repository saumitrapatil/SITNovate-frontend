"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

export default function WebcamCapture() {
  const [imageData, setImageData] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the webcam", err)
    }
  }, [])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480)
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg")
        setImageData(imageDataUrl)
      }
    }
  }, [])

  const uploadImage = useCallback(async () => {
    if (imageData) {
      try {
        // In a real scenario, we would call an API to get a presigned URL here
        const presignedUrl = "https://dummy-s3-presigned-url.com"

        // Mock upload - in reality, this would be a PUT request to the presigned URL
        console.log("Uploading image to:", presignedUrl)

        // Simulating a successful upload
        alert("Image uploaded successfully!")
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("Failed to upload image")
      }
    }
  }, [imageData])

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={startWebcam}>Start Webcam</Button>
      <video ref={videoRef} autoPlay className="w-full max-w-md border border-gray-300" />
      <Button onClick={captureImage}>Capture Image</Button>
      <canvas ref={canvasRef} width={640} height={480} className="hidden" />
      {imageData && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <img
            src={imageData || "/placeholder.svg"}
            alt="Captured"
            className="w-full max-w-md border border-gray-300"
          />
          <Button onClick={uploadImage}>Upload to S3</Button>
        </div>
      )}
    </div>
  )
}