import React, { useEffect, useState } from 'react';
import { db } from '../Firebase.js';

export function Gallery({ subscription }) {
  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    if (subscription !== 'premium') return;
    db.ref('scenes').on('value', (snapshot) => {
      const data = snapshot.val();
      setScenes(Object.entries(data || {}).map(([id, scene]) => ({ id, ...scene })));
    });
  }, [subscription]);

  return (
    <div className="gallery">
      <h2>Your Creations</h2>
      {scenes.map((scene) => (
        <p key={scene.id}>{scene.name} - {scene.type || 'model'}</p>
      ))}
    </div>
  );
}