import React, { useState } from "react";
import { Button, CircularProgress, Tooltip, IconButton } from "@mui/material";
import { saveScene } from "./Firebase.js";
import { motion } from "framer-motion";
import { AiOutlineQuestionCircle } from "react-icons/ai";

export function Editor({ setModel }) {
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const sceneId = await saveScene(file, file.name, type);
      const storageRef = firebase.storage().ref(`models/${file.name}_${sceneId}`);
      const url = await storageRef.getDownloadURL();
      setFilePreview({ url, name: file.name, type });
      setModel(url, file.name.split("." + fileType)[0], sceneId, type);
    } catch (err) {
      setError("Failed to upload file: " + err.message);
      console.error("Upload error:", err);
    }
    setLoading(false);
  }

  const dragVariants = {
    initial: { scale: 1, borderColor: "border-neonPurple", boxShadow: "shadow-neon" },
    dragging: { 
      scale: 1.05, 
      borderColor: "border-neonGreen", 
      boxShadow: "shadow-[0_5px_30px_rgba(0,255,204,0.8),0_0_40px_rgba(255,0,255,0.6)]" 
    },
    hover: { scale: 1.02, boxShadow: "shadow-[0_5px_25px_rgba(0,255,204,0.7)]" },
  };

  return (
    <motion.div
      className="editor"
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      variants={dragVariants}
      initial="initial"
      whileHover="hover"
      whileDrag="dragging"
      animate={isDragging ? "dragging" : "initial"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
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
          className="status error"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
        >
          {error}
        </motion.div>
      ) : filePreview ? (
        <motion.div
          className="preview"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <img
            src={filePreview.url}
            alt={filePreview.name}
            className="max-w-[150px] rounded-xl shadow-neon hover:scale-105 transition-all duration-300"
          />
          <p className="text-neonGreen font-bold">
            {filePreview.name} ({filePreview.type})
          </p>
        </motion.div>
      ) : (
        <Tooltip
          title="Drop .glb, video, audio, or image files here, or click Browse to select."
          arrow
          placement="top"
          className="relative"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Drop your content here or{" "}
              <Button
                variant="contained"
                color="secondary"
                className="relative z-10"
                whileHover={{ scale: 1.1, boxShadow: "shadow-[0_5px_20px_rgba(0,212,255,0.7)]" }}
                whileTap={{ scale: 0.95 }}
              >
                Browse
              </Button>
            </motion.div>
            <IconButton
              className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-neonGreen"
              onClick={() => alert("Help: Drag and drop or browse for files like .glb, videos, audio, or images.")}
            >
              <AiOutlineQuestionCircle size={20} />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {!loading && (
        <label className="block mt-4">
          <input
            type="file"
            accept=".glb,.mp4,.webm,.mp3,.wav,.png,.jpg,.jpeg"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
          <Button
            variant="contained"
            color="secondary"
            whileHover={{ scale: 1.1, boxShadow: "shadow-[0_5px_20px_rgba(0,212,255,0.7)]" }}
            whileTap={{ scale: 0.95 }}
          >
            Browse
          </Button>
        </label>
      )}
    </motion.div>
  );
}