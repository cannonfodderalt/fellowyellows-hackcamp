import * as tf from "@tensorflow/tfjs";

let model: tf.LayersModel | null = null;

export async function loadModel() {
  if (model) return model;

  model = await tf.loadLayersModel("/models/gesture_model.json");
  console.log("Gesture model loaded!");

  return model;
}

export async function predictGesture(landmarks: any) {
  if (!model) await loadModel();

  // Flatten 21 landmarks * 3 coords each
  const input = landmarks.flatMap((p: any) => [p.x, p.y, p.z]);

  const tensor = tf.tensor([input]);
  const prediction = model!.predict(tensor) as tf.Tensor;

  const index = prediction.argMax(-1).dataSync()[0];

  tensor.dispose();
  prediction.dispose();

  return index; // return gesture ID; e.g. 0=fist, 1=open, etc.
}
