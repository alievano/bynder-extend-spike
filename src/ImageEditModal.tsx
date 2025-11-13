import 'react-image-crop/dist/ReactCrop.css';

import React, { useRef, useState } from 'react';
import { Crop, ReactCrop } from 'react-image-crop';


interface ImageEditModalProps {
  imageUrl: string;
  initialCrop?: Crop;
  onSave: (crop: Crop) => void;
  onClose: () => void;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({
  imageUrl,
  initialCrop,
  onSave,
  onClose,
}) => {
  // Default crop: 80% width, centered, 16:9 aspect
  const defaultCrop: Crop = initialCrop || { unit: '%', x: 10, y: 10, width: 80, height: 45 };
  const [crop, setCrop] = useState<Crop>(defaultCrop);
  const imgRef = useRef<HTMLImageElement | null>(null);

  return (
    <div
      className="image-edit-modal"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, position: 'relative' }}>
        <h2>Edit Image</h2>
        <div style={{ position: 'relative', display: 'inline-block' }}>
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
          
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave(crop)}>Save</button>
        </div>
      </div>
    </div>
  );
};
