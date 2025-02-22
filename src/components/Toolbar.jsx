import React from 'react';

export function Toolbar({ onSave, onMint, onAIEnhance, subscription, loading }) {
  return (
    <div className="toolbar">
      <button onClick={onSave} disabled={loading}>Save Locally</button>
      {subscription === 'premium' && (
        <>
          <button onClick={onMint} disabled={loading}>Mint as NFT</button>
          <button onClick={onAIEnhance} disabled={loading}>Enhance with AI</button>
        </>
      )}
    </div>
  );
}