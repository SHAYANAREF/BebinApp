import React, { useState } from 'react';

export function Onboarding() {
    const [show, setShow] = useState(!localStorage.getItem('onboarding_seen'));

    if (!show) return null;

    return (
        <div className="onboarding">
            <h2>Welcome to BebinApp!</h2>
            <p>1. Drop a file in the editor below.</p>
            <p>2. Use the toolbar to save or mint your creation.</p>
            <button onClick={() => {
                setShow(false);
                localStorage.setItem('onboarding_seen', 'true');
            }}>Got it!</button>
        </div>
    );
}