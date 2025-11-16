"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "@/components/Webcam/Webcam";
import { getHandLandmarker } from "@/lib/mediapipe/hand";
import { classifyGesture } from "@/lib/gestures/classify";

export default function GesturePage() {
  const [gesture, setGesture] = useState("none");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let running = true;

    async function loop() {
      const hand = await getHandLandmarker();

      function processFrame() {
        if (!running || !videoRef.current) return;

        const res = hand.detectForVideo(videoRef.current, performance.now());
        const landmarks = res.landmarks?.[0];

        const g = classifyGesture(landmarks);
        setGesture(g);

        requestAnimationFrame(processFrame);
      }

      processFrame();
    }

    loop();
    return () => { running = false };
  }, []);

  return (
    <div>
      <h1>Gesture: {gesture}</h1>
      <Webcam onFrame={vid => (videoRef.current = vid)} />
    </div>
  );
}
