import React, { useState } from "react";
import { Crop } from "react-image-crop";

import { ImageEditModal } from "./ImageEditModal";
import { BynderElementImage } from "./types/bynderImage";

interface UseImageEditModalResult {
  showModal: (image: BynderElementImage, onSave: (image: BynderElementImage) => void) => void;
  modal: React.ReactNode;
}

export function useImageEditModal(): UseImageEditModalResult {
  const [modalState, setModalState] = useState<{
    image: BynderElementImage;
    onSave: (image: BynderElementImage) => void;
  } | null>(null);

  const showModal = (image: BynderElementImage, onSave: (image: BynderElementImage) => void) => {
    setModalState({ image, onSave });
  };

  const handleSave = (crop: Crop, focalPoint: { x: number; y: number }) => {
    if (!modalState) return;
    const updated: BynderElementImage = {
      ...modalState.image,
      crop: { ...crop },
      focalPoint,
    };
    modalState.onSave(updated);
    setModalState(null);
  };

  const handleClose = () => setModalState(null);

  const modal = modalState ? (
    <ImageEditModal
      imageUrl={modalState.image.previewUrl || modalState.image.bynderUrl}
      initialCrop={modalState.image.crop}
      initialFocalPoint={modalState.image.focalPoint}
      onSave={handleSave}
      onClose={handleClose}
    />
  ) : null;

  return { showModal, modal };
}
