"use client";

import { forwardRef, useEffect } from "react";

type Props = {};

const Webcam = forwardRef<HTMLVideoElement, Props>((props, ref) => {
  useEffect(() => {
    const video = ref as React.RefObject<HTMLVideoElement | null>;
    if (!video.current) return;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        video.current!.srcObject = stream;
        await video.current!.play();
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    init();
  }, [ref]);

  return <video ref={ref} autoPlay playsInline muted width={640} height={480} />;
});

Webcam.displayName = "Webcam";

export default Webcam;
