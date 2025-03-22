import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Editor } from './components/Editor';
import { motion } from 'framer-motion';
import routes from './routes';
import NeonMenu from './components/NeonMenu';
import { fetchModels, getModelUrl } from './supabaseClient';

export default function ARScene() {
  const sceneRef = useRef(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arSupported, setArSupported] = useState(true);
  
  // Reference objects to persist between renders
  const threejsObjectsRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    arButton: null,
    model: null
  });

  // Fetch models list from Supabase
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        const models = await fetchModels();
        setAvailableModels(models);
        
        // Select the first model by default
        if (models.length > 0) {
          setSelectedModelId(models[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Failed to load models. Please try again.');
        setLoading(false);
      }
    };
    
    loadModels();
  }, []);

  // Fetch URL of the selected model
  useEffect(() => {
    const loadSelectedModel = async () => {
      if (!selectedModelId) return;
      
      try {
        const url = await getModelUrl(selectedModelId);
        if (url) {
          setModelUrl(url);
        } else {
          setError('Error fetching model URL.');
        }
      } catch (err) {
        console.error('Error loading model URL:', err);
        setError('Error loading model. Please try again.');
      }
    };
    
    loadSelectedModel();
  }, [selectedModelId]);

  // Initialize Three.js and AR
  useEffect(() => {
    // Check WebXR support
    if (!navigator.xr) {
      console.warn('WebXR not supported by this browser');
      setArSupported(false);
      return;
    }

    // Initialize Three.js objects
    const objects = threejsObjectsRef.current;
    
    // Create scene
    objects.scene = new THREE.Scene();
    
    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    objects.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 0);
    objects.scene.add(directionalLight);

    // Create camera
    objects.camera = new THREE.PerspectiveCamera(
      70, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      100
    );

    // Create renderer
    objects.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    objects.renderer.setSize(window.innerWidth, window.innerHeight);
    objects.renderer.setPixelRatio(window.devicePixelRatio);
    objects.renderer.xr.enabled = true; // Enable AR
    
    // Add renderer to DOM
    if (sceneRef.current) {
      // Clear previous content
      while (sceneRef.current.firstChild) {
        sceneRef.current.removeChild(sceneRef.current.firstChild);
      }
      sceneRef.current.appendChild(objects.renderer.domElement);
    }

    // Create AR button
    try {
      objects.arButton = ARButton.createButton(objects.renderer, { 
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'light-estimation'],
        domOverlay: { root: document.body } 
      });
      document.body.appendChild(objects.arButton);
    } catch (error) {
      console.error('Error creating AR button:', error);
      setArSupported(false);
    }

    // Add a temporary cube to display scene functionality
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00ff00,
      metalness: 0.3,
      roughness: 0.4
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -0.5); // Place in front of the camera
    objects.scene.add(cube);

    // Animation loop
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      objects.renderer.render(objects.scene, objects.camera);
    };

    // Start AR session
    objects.renderer.setAnimationLoop(animate);

    // Handle window resize
    const handleResize = () => {
      objects.camera.aspect = window.innerWidth / window.innerHeight;
      objects.camera.updateProjectionMatrix();
      objects.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (objects.arButton && document.body.contains(objects.arButton)) {
        document.body.removeChild(objects.arButton);
      }
      if (objects.renderer) {
        objects.renderer.setAnimationLoop(null);
        objects.renderer.dispose();
      }
    };
  }, []); // Empty dependency array - runs only once on mount

  // Load 3D model when URL is available
  useEffect(() => {
    if (!modelUrl || !threejsObjectsRef.current.scene) return;

    const loader = new GLTFLoader();
    const objects = threejsObjectsRef.current;
    
    setLoading(true);
    loader.load(
      modelUrl, 
      (gltf) => {
        // Remove previous model if it exists
        if (objects.model) {
          objects.scene.remove(objects.model);
        }
        
        objects.model = gltf.scene;
        
        // Scale and position the model appropriately
        objects.model.scale.set(0.1, 0.1, 0.1);
        objects.model.position.set(0, 0, -0.3);
        
        objects.scene.add(objects.model);
        console.log('Model loaded successfully');
        setLoading(false);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Error loading 3D model.');
        setLoading(false);
      }
    );
  }, [modelUrl]);

  // Handle selected model change
  const handleModelChange = (modelId) => {
    setSelectedModelId(modelId);
  };

  return (
    <div className="bg-gradient-to-br from-[#1e1e2f] via-[#2a2a4a] to-[#3a3a5a] min-h-screen text-white font-poppins overflow-x-hidden relative">
      {!arSupported && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-darkBase/90 p-8 rounded-xl max-w-lg text-center">
            <h2 className="text-3xl text-neonRed mb-4">AR Not Supported</h2>
            <p className="text-xl mb-6">
              Your device or browser does not support WebXR Augmented Reality.
              Please use a compatible browser such as Chrome on Android.
            </p>
            <button 
              className="bg-neonBlue px-6 py-3 rounded-xl"
              onClick={() => setArSupported(true)} // Hide message to show normal content
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-4 h-4 bg-neonBlue rounded-full animate-pulse opacity-20 top-10 left-10"></div>
        <div className="absolute w-3 h-3 bg-neonGreen rounded-full animate-pulse opacity-20 top-20 right-20"></div>
        <div className="absolute w-5 h-5 bg-neonPurple rounded-full animate-pulse opacity-20 bottom-20 left-20"></div>
      </div>
      
      <header className="bg-darkBase/40 backdrop-blur-md shadow-glass p-12 text-center sticky top-0 z-40 w-full">
        <motion.h1
          className="text-6xl font-bold text-neonBlue animate-neonPulse"
          initial={{ opacity: 0, y: -50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          BebinApp Studio
        </motion.h1>
        <NeonMenu routes={routes} />
      </header>
      
      <main className="min-h-screen flex flex-col items-center justify-center p-16 pt-48">
        {/* Model selector */}
        {availableModels.length > 0 && (
          <div className="w-full max-w-2xl mb-8 bg-darkBase/30 backdrop-blur-md p-4 rounded-xl shadow-glass">
            <h3 className="text-xl text-neonGreen mb-4">Select AR Model:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedModelId === model.id
                      ? 'bg-neonBlue/50 shadow-[0_0_15px_rgba(0,212,255,0.7)]'
                      : 'bg-darkBase/50 hover:bg-darkBase/80'
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="w-full max-w-2xl mb-8 bg-red-900/30 text-red-200 backdrop-blur-md p-4 rounded-xl shadow-glass">
            <p>{error}</p>
            <button 
              className="mt-2 bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        )}
        
        {/* AR scene container */}
        <div 
          ref={sceneRef} 
          className="w-full h-[400px] rounded-xl overflow-hidden mb-10 bg-gray-900/50 relative"
        >
          {/* AR loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neonBlue"></div>
              <p className="text-neonBlue mr-4">Loading AR Experience...</p>
            </div>
          )}
        </div>
        
        <motion.div
          className="text-center max-w-5xl mb-24 backdrop-blur-md bg-darkBase/30 rounded-2xl shadow-glass p-12"
          initial={{ opacity: 0, y: 50, rotateY: 10 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ delay: 0.2, duration: 1.0, ease: "easeInOut" }}
        >
          <motion.p
            className="text-3xl text-neonGreen mb-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
          >
            Welcome to BebinApp Studio – Create, upload, and explore AR/VR content with ease!
          </motion.p>
          <motion.button
            className="bg-gradient-to-br from-neonPurple to-neonBlue text-white px-16 py-6 rounded-3xl text-2xl font-bold shadow-glass hover:shadow-[0_0_50px_rgba(0,212,255,0.9)] transition-all"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Get started with BebinApp Studio!")}
          >
            Get Started
          </motion.button>
        </motion.div>
        
        {/* Editor to adjust model or upload new model */}
        <Editor setModel={setModelUrl} />
        
        {/* Display sample models */}
        <motion.div
          className="mt-32 w-full max-w-7xl flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.0, ease: "easeInOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
            {availableModels.slice(0, 3).map((model, index) => (
              <motion.div
                key={model.id}
                className="bg-darkBase/30 backdrop-blur-md p-6 md:p-14 rounded-2xl shadow-glass hover:shadow-[0_0_50px_rgba(0,255,204,0.9)] transition-all cursor-pointer"
                whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModelChange(model.id)}
              >
                <div className="w-full h-64 md:h-96 bg-gray-800/50 rounded-xl mb-6 md:mb-12 flex items-center justify-center">
                  {model.thumbnail_url ? (
                    <img 
                      src={model.thumbnail_url} 
                      alt={model.name} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <p className="text-gray-400">Preview {model.name}</p>
                  )}
                </div>
                <p className="text-neonGreen text-xl md:text-2xl font-semibold text-center animate-pulse-slow">
                  {model.name}
                </p>
              </motion.div>
            ))}
            
            {/* If less than 3 models are available, display placeholders */}
            {Array(Math.max(0, 3 - availableModels.length)).fill(0).map((_, index) => (
              <motion.div
                key={`placeholder-${index}`}
                className="bg-darkBase/30 backdrop-blur-md p-6 md:p-14 rounded-2xl shadow-glass"
              >
                <div className="w-full h-64 md:h-96 bg-gray-800/50 rounded-xl mb-6 md:mb-12 flex items-center justify-center">
                  <p className="text-gray-400">Add New AR Model</p>
                </div>
                <p className="text-gray-400 text-xl md:text-2xl font-semibold text-center">
                  Empty
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <footer className="bg-darkBase/40 backdrop-blur-md shadow-glass p-12 text-center mt-32 w-full">
        <motion.p
          className="text-neonGreen text-xl mb-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
        >
          © 2025 BebinApp Studio. All rights reserved.
        </motion.p>
        <ul className="flex flex-wrap justify-center gap-8 md:space-x-16 text-neonGreen">
          <motion.li whileHover={{ scale: 1.1, color: "#00d4ff", y: -5 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <a href="#contact" className="text-xl md:text-2xl hover:text-neonBlue transition-all">Contact Us</a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#00d4ff", y: -5 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <a href="#privacy" className="text-xl md:text-2xl hover:text-neonBlue transition-all">Privacy Policy</a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#00d4ff", y: -5 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <a href="#terms" className="text-xl md:text-2xl hover:text-neonBlue transition-all">Terms of Service</a>
          </motion.li>
        </ul>
      </footer>
    </div>
  );
}
