import 'react-image-crop/dist/ReactCrop.css';

import React, { useRef,useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';


interface ImageEditModalProps {
  imageUrl: string;
  initialCrop?: Crop;
  initialFocalPoint?: { x: number; y: number };
  onSave: (crop: Crop, focalPoint: { x: number; y: number }) => void;
  onClose: () => void;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({
  imageUrl,
  initialCrop,
  initialFocalPoint,
  onSave,
  onClose,
}) => {
  // Default crop: 80% width, centered, 16:9 aspect
  const defaultCrop: Crop = initialCrop || { unit: '%', x: 10, y: 10, width: 80, height: 45 };
  const [crop, setCrop] = useState<Crop>(defaultCrop);
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>(initialFocalPoint || { x: 0.5, y: 0.5 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setFocalPoint({ x, y });
  };

  return (
    <div
      className="image-edit-modal"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, position: 'relative' }}>
        <h2>Edit Image</h2>
        <div
          style={{ position: 'relative', display: 'inline-block' }}
          onClick={handleImageClick}
        >
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            aspect={16 / 9}
            style={{ maxWidth: 400, maxHeight: 300 }}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Edit"
              style={{ maxWidth: 400, maxHeight: 300, display: 'block' }}
            />
          </ReactCrop>
          {imgRef.current && (
            <div
              style={{
                position: 'absolute',
                left: `${focalPoint.x * 100}%`,
                top: `${focalPoint.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'red', border: '2px solid #fff' }} />
            </div>
          )}
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave(crop, focalPoint)}>Save</button>
        </div>
      </div>
    </div>
  );
};
