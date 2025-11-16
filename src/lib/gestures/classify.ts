// src/lib/gestures/classify.ts

export type Gesture =
  | "open"
  | "fist"
  | "pinch"
  | "point"
  | "thumbs_up"
  | "unknown"
  | "none"
  | "thumbs_down";

/**
 * Euclidean distance between two points
 */
function distance(a: any, b: any) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Check if a finger is extended
 * @param tip - fingertip landmark index
 * @param mcp - finger MCP landmark index
 * @param landmarks - array of 21 MediaPipe landmarks
 */
function isFingerExtended(tip: number, mcp: number, landmarks: any[]) {
  return landmarks[tip].y < landmarks[mcp].y;
}

/**
 * Main rule-based gesture classifier
 */
export function classifyGesture(landmarks: any[] | null): Gesture {
  if (!landmarks) return "none";

  // Thumb tip and IP
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  // Index tip and MCP
  const indexTip = landmarks[8];
  const indexMCP = landmarks[5];
  // Middle tip and MCP
  const middleTip = landmarks[12];
  const middleMCP = landmarks[9];
  // Ring tip and MCP
  const ringTip = landmarks[16];
  const ringMCP = landmarks[13];
  // Pinky tip and MCP
  const pinkyTip = landmarks[20];
  const pinkyMCP = landmarks[17];
  // Wrist
  const wrist = landmarks[0];

  // --- Pinch detection (thumb + index) ---
  const pinchDistance = distance(thumbTip, indexTip);
  if (pinchDistance < 0.1) return "pinch"; // tune threshold if needed
  // --- Open hand detection ---
  const fingersExtended = [
    isFingerExtended(8, 5, landmarks),   // index
    isFingerExtended(12, 9, landmarks),  // middle
    isFingerExtended(16, 13, landmarks), // ring
    isFingerExtended(20, 17, landmarks), // pinky
    isFingerExtended(4, 2, landmarks),   // thumb
  ];
  if (fingersExtended.every(Boolean)) return "open";

  // --- Fist detection ---
  if (fingersExtended.every(f => !f)) return "fist";

  // --- Point detection (index extended only) ---
  if (
    fingersExtended[0] && // index
    !fingersExtended[1] && // middle
    !fingersExtended[2] && // ring
    !fingersExtended[3] && // pinky
    !fingersExtended[4]    // thumb
  )
    return "point";

  // --- Thumbs up detection ---
  // thumb above wrist, other fingers curled
  if (
    fingersExtended[4] && // thumb extended
    !fingersExtended[0] &&
    !fingersExtended[1] &&
    !fingersExtended[2] &&
    !fingersExtended[3] &&
    thumbTip.y < wrist.y
  )
    return "thumbs_up";


  return "unknown";
}
