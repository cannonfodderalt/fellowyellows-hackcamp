// lib/gestures/classify.ts
export function classifyGesture(landmarks: any[]) {
    if (!landmarks) return "none";
  
    const [thumb, index, middle] = [
      landmarks[4],   // thumb tip
      landmarks[8],   // index tip
      landmarks[12],  // middle tip
    ];
  
    // Example: pinch gesture
    const pinchDistance = Math.hypot(
      thumb.x - index.x,
      thumb.y - index.y
    );
  
    if (pinchDistance < 0.04) {
      return "pinch";
    }
  
    // Example: open hand
    if (index.y < middle.y && thumb.x < index.x) {
      return "open";
    }
  
    return "unknown";
  }
  