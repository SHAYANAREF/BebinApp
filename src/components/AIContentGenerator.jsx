import React, { useState } from 'react';
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const AIContentGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    const result = await hf.textGeneration({
      model: 'gpt2',
      inputs: inputText,
    });
    setGeneratedContent(result.generated_text);
  };

  return (
    <div>
      <h1>AI Content Generator</h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={generateContent}>Generate</button>
      <p>{generatedContent}</p>
    </div>
  );
};

export default AIContentGenerator;
