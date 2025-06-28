import React, { useRef, useEffect, useState } from 'react';

interface ChromaKeyTestProps {
  threshold?: number;
}

export const ChromaKeyTest: React.FC<ChromaKeyTestProps> = ({ threshold = 90 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    // Get user camera for testing
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isProcessing || !hasCamera) return;

    const renderCanvas = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!canvas || !video || video.videoWidth === 0 || video.videoHeight === 0) {
        return requestAnimationFrame(renderCanvas);
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        
        if (isCloseToGreen([red, green, blue])) {
          data[i + 3] = 0; // Set alpha channel to 0 (transparent)
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      return requestAnimationFrame(renderCanvas);
    };

    const isCloseToGreen = (color: number[]) => {
      const [red, green, blue] = color;
      return green > threshold && red < threshold && blue < threshold;
    };

    const animationFrameId = renderCanvas();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isProcessing, hasCamera, threshold]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Chroma Key Background Removal Test</h2>
      <p>This component tests the chroma key functionality using your camera. 
         Position yourself in front of a green background to see the effect.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setIsProcessing(!isProcessing)}
          disabled={!hasCamera}
          style={{
            padding: '10px 20px',
            backgroundColor: isProcessing ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: hasCamera ? 'pointer' : 'not-allowed'
          }}
        >
          {isProcessing ? 'Stop Processing' : 'Start Chroma Key'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3>Original Video</h3>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '320px',
              height: '240px',
              border: '1px solid #ccc',
              display: hasCamera ? 'block' : 'none'
            }}
          />
          {!hasCamera && (
            <div style={{
              width: '320px',
              height: '240px',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f9fa'
            }}>
              Camera not available
            </div>
          )}
        </div>

        <div>
          <h3>Chroma Key Result</h3>
          <canvas
            ref={canvasRef}
            style={{
              width: '320px',
              height: '240px',
              border: '1px solid #ccc',
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>
          Green Detection Threshold: {threshold}
          <input
            type="range"
            min="50"
            max="150"
            value={threshold}
            onChange={(e) => {
              // This would need to be passed from parent component
              console.log('Threshold changed to:', e.target.value);
            }}
            style={{ marginLeft: '10px', width: '200px' }}
          />
        </label>
      </div>
    </div>
  );
};
