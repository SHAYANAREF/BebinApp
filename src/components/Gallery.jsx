import React, { useEffect, useState } from 'react';
import { db } from '../Firebase.js';

export function Gallery({ subscription }) {
  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    if (subscription !== 'premium') return;
    db.ref('scenes').on('value', (snapshot) => {
      const data = snapshot.val();
      const scenesArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      setScenes(scenesArray);
    });
  }, [subscription]);

  return (
    <div className="gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <h2 className="col-span-full text-center text-2xl font-bold mb-4">Your Creations</h2>
      {scenes.map((scene) => (
        <div key={scene.id} className="bg-darkBase p-4 rounded-lg shadow-md">
          <p>{scene.name} - {scene.type || 'model'}</p>
        </div>
      ))}
    </div>
  );
}