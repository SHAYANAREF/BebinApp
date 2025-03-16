import { HfInference } from "@huggingface/inference";

const hf = new HfInference("YOUR_HUGGING_FACE_TOKEN"); // Replace with your Hugging Face token

export async function processWithAI(content, type = "text") {
  try {
    if (type === "text") {
      const response = await hf.textGeneration({
        model: "distilgpt2",
        inputs: content,
        parameters: { max_length: 50 },
      });
      return response.generated_text;
    } else if (type === "model") {
      // Simulate AI enhancement for 3D models (custom logic can be added)
      return content + "_enhanced";
    }
    return content;
  } catch (error) {
    console.error("AI processing error:", error);
    throw error;
  }
}
