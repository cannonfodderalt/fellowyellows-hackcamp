"use client";

import { useRef, useEffect } from "react";

export default function Webcam({ onFrame }: { onFrame: (video: HTMLVideoElement) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setup() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        onFrame(videoRef.current);
      }
    }
    setup();
  }, []);

  return (
    <video
      ref={videoRef}
      style={{ width: "100%", transform: "scaleX(-1)" }}
      playsInline
    />
  );
}
