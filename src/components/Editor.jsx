import React, { useState, useEffect } from "react";
import { CircularProgress, Tooltip, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { AiOutlineQuestionCircle } from "react-icons/ai";

export function Editor({ setModel }) {
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    if (isDragging) {
      setAiMessage("Your file looks amazing! Try rotating it in AR mode!");
      setTimeout(() => setAiMessage(""), 3000); // Message disappears after 3 seconds
    }
  }, [isDragging]);

  async function handleFile(file) {
    if (!file) {
      setError("No file selected!");
      return;
    }
    setLoading(true);
    setError(null);
    console.log("Handling file:", file.name, file.type);
    const fileType = file.name.split(".").pop().toLowerCase();
    let type;
    if (fileType === "glb") type = "model";
    else if (["mp4", "webm"].includes(fileType)) type = "video";
    else if (["mp3", "wav"].includes(fileType)) type = "audio";
    else if (["png", "jpg", "jpeg"].includes(fileType)) type = "image";
    else {
      setError(
        "Unsupported file type! Use .glb, .mp4, .webm, .mp3, .wav, .png, .jpg, or .jpeg"
      );
      setLoading(false);
      return;
    }

    try {
      const fileURL = URL.createObjectURL(file);
      setFilePreview({ url: fileURL, name: file.name, type });
      setModel(fileURL);
      setAiMessage("File processed successfully – enjoy your AR/VR content!");
    } catch (err) {
      setError("Failed to process file: " + err.message);
      console.error("Processing error:", err);
    }
    setLoading(false);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    console.log('Files dropped:', files);
    handleFile(files[0]);
  };

  const dragVariants = {
    initial: { scale: 1, borderColor: "border-neonPurple", boxShadow: "0 5px 15px rgba(255, 0, 255, 0.5)" },
    dragging: { 
      scale: 1.05, 
      borderColor: "border-neonGreen", 
      boxShadow: "0 5px 30px rgba(0, 255, 204, 0.8), 0 0 40px rgba(255, 0, 255, 0.6)" 
    },
    hover: { scale: 1.02, boxShadow: "0 5px 25px rgba(0, 255, 204, 0.7)" },
  };

  return (
    <motion.div
      className={`editor w-full max-w-5xl backdrop-blur-md bg-darkBase/30 rounded-2xl shadow-glass ${isDragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      variants={dragVariants}
      initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      whileHover="hover"
      whileDrag="dragging"
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {aiMessage && (
        <motion.div
          className="status text-neonGreen mb-12 backdrop-blur-md bg-darkBase/20 rounded-xl shadow-glass p-8"
          initial={{ opacity: 0, y: -10, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -10, rotate: 5 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          {aiMessage}
        </motion.div>
      )}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center"
        >
          <CircularProgress size={60} className="text-neonBlue" />
        </motion.div>
      ) : error ? (
        <motion.div
          className="status error backdrop-blur-md bg-darkBase/20 rounded-xl shadow-glass p-8"
          initial={{ x: -20, opacity: 0, rotate: -10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: 20, opacity: 0, rotate: 10 }}
        >
          {error}
        </motion.div>
      ) : filePreview ? (
        <motion.div
          className="preview backdrop-blur-md bg-darkBase/20 rounded-2xl shadow-glass p-10"
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img
            src={filePreview.url}
            alt={filePreview.name}
            className="max-w-[500px] rounded-2xl shadow-glass hover:scale-105 hover:shadow-[0_0_60px_rgba(0,212,255,0.9)] transition-all duration-800 mx-auto"
          />
          <p className="text-neonGreen text-2xl font-bold text-center mt-12 animate-pulse-slow"> 
            {filePreview.name} ({filePreview.type})
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-12">
          <p className="text-neonGreen text-xl">Drag and drop your models here or</p>
          <motion.button
            className="bg-gradient-to-br from-neonPurple to-neonBlue text-white px-14 py-6 rounded-3xl shadow-glass hover:shadow-[0_0_60px_rgba(0,212,255,0.9)]"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.querySelector('input[type="file"]').click();
            }}
          >
            Browse
          </motion.button>
        </div>
      )}
      <input
        type="file"
        accept=".glb,.mp4,.webm,.mp3,.wav,.png,.jpg,.jpeg"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </motion.div>
  );
}
