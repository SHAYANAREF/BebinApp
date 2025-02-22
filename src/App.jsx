import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { Editor } from './Editor.jsx';
import { ARScene } from './ARScene.jsx';
import { loadScenes, saveScene, loginWithGoogle } from './Firebase.js';
import { mintNFT } from './Web3.js';
import { processWithAI } from './utils/aiHandler.js';
import { getUserLocation } from './utils/geoUtils.js';
import { Onboarding } from './components/Onboarding.jsx';
import { BebinAI } from './components/BebinAI.jsx';

export function App() {
    const [state, setState] = useState({
        modelUrl: null,
        modelName: null,
        sceneId: null,
        collabUsers: 0,
        loading: false,
        contentType: 'model',
        subscription: 'free',
        user: null,
        location: null
    });
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        checkAuth();
        loadScenes(
            (id, url, name, type) => setModel(url, name, id, type),
            (count) => setState(prev => ({ ...prev, collabUsers: count }))
        );
        getUserLocation(location => setState(prev => ({ ...prev, location })));
    }, []);

    async function checkAuth() {
        try {
            const user = await loginWithGoogle();
            setState(prev => ({ ...prev, user }));
        } catch (error) {
            console.error('Auth error:', error);
            setToast({ open: true, message: 'Login failed. Try again.', severity: 'error' });
        }
    }

    function setModel(url, name, id, type = 'model') {
        const updatedState = { ...state, modelUrl: url, modelName: name, sceneId: id, contentType: type, loading: false };
        setState(updatedState);
        if (state.location && id) {
            saveSceneWithLocation(url, name, type, id);
        }
    }

    function saveSceneWithLocation(url, name, type, id) {
        const sceneRef = db.ref(`scenes/${id}`);
        sceneRef.update({ location: state.location });
    }

    function setCollabUsers(count) {
        setState(prev => ({ ...prev, collabUsers: count }));
    }

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity });
    };

    async function handleSave() {
        if (!state.modelUrl || !state.modelName) {
            showToast('Please load a model or content first!', 'error');
            return;
        }
        const sceneId = saveScene(state.modelUrl, state.modelName, state.contentType);
        setState(prev => ({ ...prev, sceneId }));
        showToast('Saved successfully to Firebase!', 'success');
    }

    async function handleMint() {
        if (!state.modelUrl || !state.modelName) {
            showToast('Please load a model first!', 'error');
            return;
        }
        setState(prev => ({ ...prev, loading: true }));
        try {
            await mintNFT(state.modelUrl, state.modelName);
            showToast('NFT minted successfully!', 'success');
        } catch (error) {
            showToast(`Failed to mint NFT: ${error.message}`, 'error');
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }

    async function handleAIEnhance(content) {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const enhancedUrl = await processWithAI(content, state.contentType);
            setModel(enhancedUrl, state.modelName + '_enhanced', null, state.contentType);
            showToast('Content enhanced with BebinAI!', 'success');
        } catch (error) {
            showToast(`Failed to enhance with AI: ${error.message}`, 'error');
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }

    function handleLoadModel() {
        if (state.modelUrl && state.modelName) {
            setModel(state.modelUrl, state.modelName, state.sceneId, state.contentType);
            showToast('Model reloaded!', 'success');
        } else {
            showToast('No model or content loaded to retry!', 'error');
        }
    }

    return (
        <Container maxWidth="lg">
            <Onboarding />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h1" color="cyan" align="center" sx={{ mt: 4 }}>
                    BebinApp Studio
                </Typography>
            </motion.div>
            <div className="status">
                Collaborators Online: {state.collabUsers} | Plan: {state.subscription}
            </div>
            <Editor setModel={setModel} />
            <ARScene modelUrl={state.modelUrl} sceneId={state.sceneId} contentType={state.contentType} onUpdate={handleAIEnhance} />
            <BebinAI onEnhance={handleAIEnhance} />
            <div className="toolbar">
                <Button variant="contained" color="secondary" onClick={handleSave} disabled={state.loading}>
                    Save to Firebase
                </Button>
                {state.modelName && !state.loading && (
                    <Button variant="contained" color="secondary" onClick={handleLoadModel} disabled={state.loading}>
                        Retry Load Model
                    </Button>
                )}
                {state.subscription === 'premium' && (
                    <Button variant="contained" color="secondary" onClick={handleMint} disabled={state.loading}>
                        Mint as NFT
                    </Button>
                )}
            </div>
            {state.loading && (
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            )}
            <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
                <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>
            <div className="status">
                {state.modelName ? `Loaded: ${state.modelName} (${state.contentType})` : 'Drop a .glb, video, audio, or image to begin'}
            </div>
        </Container>
    );
}