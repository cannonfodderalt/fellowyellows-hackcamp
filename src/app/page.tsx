"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "@/components/Webcam/Webcam";
import { getHandLandmarker } from "@/lib/mediapipe/hand";
import { classifyGesture, Gesture } from "@/lib/gestures/classify";

export default function GesturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gesture, setGesture] = useState<Gesture>("none");

  useEffect(() => {
    let running = true;
    let handLandmarker: any;

    async function init() {
      handLandmarker = await getHandLandmarker();
      console.log("Hand Landmarker initialized:", handLandmarker);

      // Wait until the video is ready
      const waitForVideo = () =>
        new Promise<HTMLVideoElement>((resolve) => {
          const interval = setInterval(() => {
            if (videoRef.current && videoRef.current.readyState >= 4) {
              clearInterval(interval);
              resolve(videoRef.current);
            }
          }, 100);
        });

      const video = await waitForVideo();
      console.log("Video ready:", video);

      function drawLandmarks(landmarks: any[]) {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const width = video.videoWidth;
        const height = video.videoHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "red";
        landmarks.forEach((lm) => {
          ctx.beginPath();
          ctx.arc(lm.x * width, lm.y * height, 5, 0, 2 * Math.PI);
          ctx.fill();
        });

        ctx.font = "24px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(gesture, 10, 30);
      }

      async function loop() {
        if (!running || !videoRef.current) return;

        const res = handLandmarker.detectForVideo(videoRef.current, performance.now());
        const landmarks = res.landmarks?.[0];

        if (landmarks) {
          const g = classifyGesture(landmarks);
          setGesture(g);
          drawLandmarks(landmarks);
        }

        requestAnimationFrame(loop);
      }

      loop();
    }

    init();

    return () => {
      running = false;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <Webcam ref={videoRef} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
      <h1>Detected Gesture: {gesture}</h1>
    </div>
  );
}
