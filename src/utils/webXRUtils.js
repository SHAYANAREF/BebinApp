export function checkWebXRSupport() {
    if (typeof navigator.xr === "undefined") {
      console.log("WebXR not supported by this browser");
      return { arSupported: false, vrSupported: false };
    }
    return Promise.all([
      navigator.xr.isSessionSupported("immersive-ar"),
      navigator.xr.isSessionSupported("immersive-vr"),
    ])
      .then(([arSupported, vrSupported]) => ({
        arSupported: !!arSupported,
        vrSupported: !!vrSupported,
      }))
      .catch((error) => {
        console.error("WebXR check failed:", error);
        return { arSupported: false, vrSupported: false };
      });
  }
  