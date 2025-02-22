import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ARButton, VRButton } from 'three/examples/jsm/webxr/ARButton.js';
import { getUserLocation } from '../utils/geoUtils.js';
import { io } from 'socket.io-client';

export function ARScene({ modelUrl, sceneId, contentType, onUpdate }) {
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();
    const modelRef = useRef();
    const [scale, setScale] = useState(1);
    const [isARSupported, setIsARSupported] = useState(false);
    const [isVRSupported, setIsVRSupported] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const socket = io('http://localhost:60677'); // پورت به‌روزرسانی‌شده

    useEffect(() => {
        console.log('ARScene useEffect triggered with:', { modelUrl, contentType });
        checkWebXRSupport().then(({ arSupported, vrSupported }) => {
            setIsARSupported(arSupported);
            setIsVRSupported(vrSupported);
            if (!rendererRef.current) init(arSupported, vrSupported);
            if (modelUrl) loadContent(modelUrl, contentType);
            getUserLocation(loc => setLocation(loc));
        }).catch(err => {
            console.error('WebXR check failed:', err);
            setError('WebXR check failed: ' + err.message);
        });
        return () => {
            if (rendererRef.current) {
                console.log('Cleaning up ARScene renderer');
                rendererRef.current.domElement.remove();
                rendererRef.current.dispose();
            }
            socket.disconnect();
        };
    }, [modelUrl, contentType]);

    async function checkWebXRSupport() {
        if (typeof navigator.xr === 'undefined') {
            console.log('WebXR not supported by this browser');
            return { arSupported: false, vrSupported: false };
        }
        try {
            const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
            const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
            console.log('WebXR AR support:', arSupported ? 'Available' : 'Not Available');
            console.log('WebXR VR support:', vrSupported ? 'Available' : 'Not Available');
            return { arSupported, vrSupported };
        } catch (error) {
            console.error('WebXR check failed:', error);
            return { arSupported: false, vrSupported: false };
        }
    }

    function init(isARSupported, isVRSupported) {
        console.log('Initializing ARScene, AR Supported:', isARSupported, 'VR Supported:', isVRSupported);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#1e1e2f');
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight * 0.55);
        renderer.setClearColor(0x000000, 0);

        const container = document.getElementById('root');
        if (!container) {
            console.error('Root element not found!');
            setError('Root element not found!');
            return;
        }
        container.appendChild(renderer.domElement);
        console.log('Renderer added to DOM:', renderer.domElement);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2.0, 100);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.0);
        scene.add(hemisphereLight);

        let controls;
        if (!isARSupported && !isVRSupported) {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;
            controls.maxPolarAngle = Math.PI / 2;
            controls.minDistance = 0.1;
            controls.maxDistance = 1000;
            controls.target.set(0, 1, 0);
        }

        if (isARSupported) {
            renderer.xr.enabled = true;
            try {
                const arButton = ARButton.createButton(renderer, {
                    requiredFeatures: ['hit-test', 'local-floor'],
                    optionalFeatures: ['dom-overlay'],
                    domOverlay: { root: document.body }
                });
                arButton.style.background = '#fab101';
                arButton.style.borderRadius = '25px';
                arButton.style.padding = '10px 20px';
                container.appendChild(arButton);
            } catch (err) {
                console.error('ARButton initialization failed:', err);
                setError('AR initialization failed: ' + err.message);
                setIsARSupported(false);
            }
        }

        if (isVRSupported) {
            renderer.xr.enabled = true;
            try {
                const vrButton = VRButton.createButton(renderer);
                vrButton.style.background = '#fab101';
                vrButton.style.borderRadius = '25px';
                vrButton.style.padding = '10px 20px';
                container.appendChild(vrButton);
            } catch (err) {
                console.error('VRButton initialization failed:', err);
                setError('VR initialization failed: ' + err.message);
                setIsVRSupported(false);
            }
        }

        camera.position.set(0, 2, 5);
        camera.lookAt(0, 1, 0);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.55);
        });

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        animate(isARSupported || isVRSupported, controls);
    }

    function animate(isXRSupported, controls) {
        if (rendererRef.current) {
            rendererRef.current.setAnimationLoop((time, frame) => {
                if (isXRSupported && frame && rendererRef.current.xr.isPresenting) {
                    if (modelRef.current && contentType === 'model') {
                        modelRef.current.rotation.y += 0.005;
                    }
                } else {
                    if (controls) controls.update();
                    if (modelRef.current && contentType === 'model') {
                        modelRef.current.rotation.y += 0.01;
                    }
                }
                rendererRef.current.render(sceneRef.current, cameraRef.current);
                if (location && modelRef.current) {
                    shareModelPosition();
                }
            });
        }
    }

    function resetModel() {
        if (modelRef.current) {
            modelRef.current.scale.set(1, 1, 1);
            modelRef.current.position.set(0, 1, 0);
            setScale(1);
        }
    }

    function adjustModelScale(model) {
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.5 / maxDim;
        model.scale.set(scale, scale, scale);
        setScale(scale);
        console.log('Adjusted scale:', scale);
    }

    function loadContent(url, type) {
        console.log('Loading content from URL:', url, 'Type:', type);
        if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
            console.log('Removed previous content');
        }

        const errorHandler = (error) => {
            console.error('Load error:', error);
            setError(`Load error: ${error.message}. Try a different file.`);
            document.querySelector('.status').innerText = `Error: ${error.message}. Try a different file.`;
        };

        if (type === 'model') {
            const loader = new GLTFLoader();
            loader.load(
                url,
                (gltf) => {
                    modelRef.current = gltf.scene;
                    adjustModelScale(modelRef.current);
                    modelRef.current.position.set(0, 1, -2);
                    modelRef.current.rotation.set(0, 0, 0);
                    modelRef.current.traverse((child) => {
                        if (child.isMesh) {
                            child.material.side = THREE.DoubleSide;
                            child.material.needsUpdate = true;
                            if (!child.material.map) {
                                child.material.color.set(0xff00ff);
                            }
                        }
                    });
                    sceneRef.current.add(modelRef.current);
                    console.log('Scene children after adding model:', sceneRef.current.children);
                    console.log('Model loaded and added to scene:', modelRef.current);
                    console.log('Model position:', modelRef.current.position);
                    console.log('Model scale:', modelRef.current.scale);
                    setError(null);
                    onUpdate?.(modelUrl);
                },
                (progress) => {
                    console.log('Loading progress:', progress.loaded / progress.total * 100 + '%');
                },
                errorHandler
            );
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = url;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.crossOrigin = 'anonymous';
            video.onerror = () => errorHandler(new Error('Failed to load video'));
            const texture = new THREE.VideoTexture(video);
            const geometry = new THREE.PlaneGeometry(5, 2.8125);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            modelRef.current = new THREE.Mesh(geometry, material);
            modelRef.current.position.set(0, 1, -2);
            sceneRef.current.add(modelRef.current);
            console.log('Video loaded and added to scene');
        } else if (type === 'audio') {
            const audio = new Audio(url);
            audio.autoplay = true;
            audio.loop = true;
            audio.crossOrigin = 'anonymous';
            audio.onerror = () => errorHandler(new Error('Failed to load audio'));
            modelRef.current = null;
            console.log('Audio loaded:', url);
        } else if (type === 'image') {
            const loader = new THREE.TextureLoader();
            loader.load(
                url,
                (texture) => {
                    const geometry = new THREE.PlaneGeometry(5, 3.75);
                    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                    modelRef.current = new THREE.Mesh(geometry, material);
                    modelRef.current.position.set(0, 1, -2);
                    sceneRef.current.add(modelRef.current);
                    console.log('Image loaded and added to scene');
                },
                undefined,
                errorHandler
            );
        }
    }

    function shareModelPosition() {
        if (modelRef.current && location) {
            const position = {
                x: modelRef.current.position.x,
                y: modelRef.current.position.y,
                z: modelRef.current.position.z,
                location: location,
                sceneId: sceneId
            };
            socket.emit('modelPosition', position);
        }
    }

    socket.on('modelPositionUpdate', (data) => {
        if (data.sceneId !== sceneId && data.location) {
            const otherModel = modelRef.current.clone();
            otherModel.position.set(data.x, data.y, data.z);
            otherModel.material.color.set(0x00ff00); // رنگ سبز برای مدل‌های دیگر
            sceneRef.current.add(otherModel);
        }
    });

    return (
        <div onClick={(e) => {
            if ((isARSupported || isVRSupported) && rendererRef.current?.xr.isPresenting) {
                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, cameraRef.current);
                const intersects = raycaster.intersectObjects(sceneRef.current.children);
                // تعامل با مدل‌ها (در آینده می‌تونی تعاملات بیشتری اضافه کنی)
            }
        }}>
            <div className="hud">Scale: {scale.toFixed(2)}</div>
            <button onClick={resetModel}>Reset Model</button>
            {error && <div className="status error">{error}</div>}
            <div className="status">
                {isARSupported ? 'View in AR or rotate with mouse' : isVRSupported ? 'View in VR or rotate with mouse' : 'Rotate with mouse (AR/VR not supported on this device)'}
            </div>
        </div>
    );
}