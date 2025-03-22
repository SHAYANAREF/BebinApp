import React, { useState } from 'react';
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_TOKEN);

const AIContentGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt2');
  const [generatedImage, setGeneratedImage] = useState('');

  const generateContent = async () => {
    const result = await hf.textGeneration({
      model: selectedModel,
      inputs: inputText,
    });
    setGeneratedContent(result.generated_text);
  };

  const generateImage = async () => {
    const result = await hf.imageGeneration({
      model: 'stabilityai/stable-diffusion-2',
      inputs: inputText,
    });
    const url = URL.createObjectURL(result);
    setGeneratedImage(url);
  };

  return (
    <div>
      <h1>AI Content Generator</h1>
      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="gpt2">gpt2</option>
        <option value="distilgpt2">distilgpt2</option>
        <option value="google/flan-t5-small">google/flan-t5-small</option>
      </select>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={generateContent}>Generate Text</button>
      <button onClick={generateImage}>Generate Image</button>
      <button>Generate 3D Model (Not Supported)</button>
      <p>{generatedContent}</p>
      {generatedImage && <img src={generatedImage} alt="Generated Image" />}
    </div>
  );
};

export default AIContentGenerator;
