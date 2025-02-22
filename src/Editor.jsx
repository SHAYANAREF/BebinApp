import React, { useState } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { saveScene } from './Firebase.js';

export function Editor({ setModel }) {
    const [isDragging, setIsDragging] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleFile(file) {
        if (!file) {
            setError('No file selected!');
            return;
        }
        setLoading(true);
        setError(null);
        console.log('Handling file:', file.name, file.type);
        const fileType = file.name.split('.').pop().toLowerCase();
        const url = URL.createObjectURL(file);
        console.log('Generated URL:', url);
        let type;
        if (fileType === 'glb') type = 'model';
        else if (['mp4', 'webm'].includes(fileType)) type = 'video';
        else if (['mp3', 'wav'].includes(fileType)) type = 'audio';
        else if (['png', 'jpg', 'jpeg'].includes(fileType)) type = 'image';
        else {
            setError('Unsupported file type! Use .glb, .mp4, .webm, .mp3, .wav, .png, .jpg, or .jpeg');
            setLoading(false);
            return;
        }
        setFilePreview({ url, name: file.name, type });
        const sceneId = saveScene(url, file.name, type); // ذخیره در Firebase
        setModel(url, file.name.split('.' + fileType)[0], sceneId, type);
        setLoading(false);
    }

    return (
        <div
            className={`editor ${isDragging ? 'dragging' : ''}`}
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
        >
            {loading ? (
                <CircularProgress size={50} />
            ) : error ? (
                <div className="status error">{error}</div>
            ) : filePreview ? (
                <div className="preview">
                    <img src={filePreview.url} alt={filePreview.name} style={{ maxWidth: '100px' }} />
                    <p>{filePreview.name} ({filePreview.type})</p>
                </div>
            ) : (
                <Tooltip title="Drop .glb, video, audio, or image files here, or click Browse to select.">
                    <div>Drop your content here or <Button variant="contained" color="secondary">Browse</Button></div>
                </Tooltip>
            )}
            {!loading && (
                <label>
                    <input
                        type="file"
                        accept=".glb,.mp4,.webm,.mp3,.wav,.png,.jpg,.jpeg"
                        onChange={(e) => handleFile(e.target.files[0])}
                        style={{ display: 'none' }}
                    />
                    <Button variant="contained" color="secondary">Browse</Button>
                </label>
            )}
        </div>
    );
}