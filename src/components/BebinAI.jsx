import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';
import { processWithAI } from '../utils/aiHandler.js';

export function BebinAI({ onEnhance }) {
    const [open, setOpen] = useState(false);
    const [idea, setIdea] = useState('');
    const [response, setResponse] = useState('');
    const [isSurprise, setIsSurprise] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            // سورپرایز با پیشنهاد ترندهای هوش مصنوعی
            const trends = ['sustainable design', 'futuristic city', 'AI-powered art'];
            const randomTrend = trends[Math.floor(Math.random() * trends.length)];
            const enhancedContent = await processWithAI(`${idea} inspired by ${randomTrend}`, 'text');
            setResponse(`BebinAI enhanced your idea with ${randomTrend}: ${enhancedContent}`);
            onEnhance(enhancedContent); // فراخوانی تابع اصلی برای به‌روزرسانی
            setIsSurprise(true);
            setTimeout(() => setIsSurprise(false), 3000); // انیمیشن سورپرایز
            handleClose();
        } catch (error) {
            console.error('BebinAI error:', error);
            setResponse('Failed to generate idea: ' + error.message);
        }
    };

    return (
        <>
            <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ mt: 2 }}>
                Ask BebinAI for Ideas
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>BebinAI - Future Builder</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Share your idea for AR/VR content, and BebinAI will enhance it with trending AI innovations!
                    </Typography>
                    <TextField
                        fullWidth
                        label="Your Idea"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    {response && <Typography>{response}</Typography>}
                    {isSurprise && (
                        <Typography color="gold" className="surprise" sx={{ mt: 2 }}>
                            Surprise! Your idea is now trending with AI!
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="secondary">
                        Generate
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}