import { HfInference } from '@huggingface/inference';

export async function processWithAI(contentUrl, contentType) {
  const HUGGING_FACE_TOKEN = import.meta.env.HUGGING_FACE_TOKEN;
  if (!HUGGING_FACE_TOKEN) {
    console.error('Hugging Face token not found. Please set HUGGING_FACE_TOKEN in .env');
    return contentUrl;
  }

  const inference = new HfInference(HUGGING_FACE_TOKEN);

  if (contentType.startsWith('image')) {
    const img = new Image();
    img.src = contentUrl;
    await img.decode();

    try {
      const response = await inference.textToImage({
        inputs: "A futuristic AR studio with neon lights",
        model: "stabilityai/stable-diffusion-3",
      });

      console.log('AI Enhanced Image:', response);
      return response; // URL یا داده تصویر بهبودیافته
    } catch (error) {
      console.error('Error with Hugging Face inference:', error);
      return contentUrl;
    }
  }
  return contentUrl;
}