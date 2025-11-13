import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";

import { AssetsPickerButton } from "./AssetsPickerButton";
import { PoweredByLogo } from "./PoweredByLogo";
import { SelectedImages } from "./SelectedImages";
import { BynderElementImage } from "./types/bynderImage";
import { useImageEditModal } from "./useImageEditModal";

const defaultPreviewDerivative = "thumbnail";
const defaultWebDerivative = "webImage";

export const BynderImageSelector: FC = () => {
  const [currentValue, setCurrentValue] = useState<ReadonlyArray<BynderElementImage> | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [config, setConfig] = useState<null | Config>(null);
  const [fixedSize, setFixedSize] = useState<number | null>(null);
  const { showModal, modal } = useImageEditModal();

  const updateSize = useCallback((providedSize?: number) => {
    const newSize = providedSize ?? Math.max(document.documentElement.offsetHeight, 100);
    setFixedSize(providedSize ?? null);

    CustomElement.setHeight(Math.ceil(newSize));
  }, []);

  const updateValue = useCallback((newValue: ReadonlyArray<BynderElementImage>) => {
    // send null for [] so that the element fails validation when it should not be empty
    CustomElement.setValue(newValue.length ? JSON.stringify(newValue) : null);
    setCurrentValue(newValue);
  }, []);

  useLayoutEffect(() => {
    updateSize();
  }, [updateSize, currentValue]);

  useEffect(() => {
    CustomElement.init((el) => {
      setConfig(el.config ?? {});
      setCurrentValue(JSON.parse(el.value || "[]"));
      setIsDisabled(el.disabled);
      updateSize();
    });
  }, [updateSize]);

  useEffect(() => {
    CustomElement.onDisabledChanged(setIsDisabled);
  }, []);

  useEffect(() => {
    const listener = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth !== window.innerWidth && fixedSize === null) {
        updateSize();
      }
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [updateSize, windowWidth, fixedSize]);

  if (currentValue === null) {
    return null;
  }

  const removeImage = (id: string) => {
    if (isDisabled) {
      return;
    }
    const newValue = currentValue.filter(image => image.id !== id);

    updateValue(newValue);
  };

  const openPicker = () => {
    if (config === null) {
      return;
    }
    updateSize(800);
    openBynderPicker(config, assets => {
      if (!assets.length) return;
      // Only allow one image (SingleSelect mode)
      const newImage = convertBynderImage(config)(assets[0]);
      showModal(newImage, (editedImage) => {
        // Add the edited image to the list (replace if already exists)
        const newValue = [...currentValue.filter(img => img.id !== editedImage.id), editedImage];
        updateValue(newValue);
      });
    });
  };

  return (
    <>
      <div style={{ padding: 10 }}>
        <AssetsPickerButton
          isDisabled={isDisabled}
          onClick={openPicker}
        />
      </div>
      <SelectedImages
        images={currentValue}
        isDisabled={isDisabled}
        removeImage={removeImage}
      />
      {modal}
      <PoweredByLogo />
    </>
  );
};
type Config = Readonly<{
  bynderUrl?: string;
  previewDerivative?: string;
  webDerivative?: string;
}>;

const openBynderPicker = (config: Config, onSuccess: (assets: ReadonlyArray<BynderImage>) => void) => {
  BynderCompactView.open({
    portal: config.bynderUrl ? { url: config.bynderUrl } : undefined,
    mode: "SingleSelect",
    assetTypes: ["image"],
    onSuccess,
  });
};


const convertBynderImage = (config: Config) => (asset: BynderImage): BynderElementImage => ({
  id: asset.id,
  bynderUrl: asset.url,
  databaseId: asset.databaseId,
  updatedAt: asset.updatedAt,
  description: asset.description,
  files: asset.files,
  name: asset.name,
  previewUrl: asset.derivatives[config.previewDerivative ?? defaultPreviewDerivative],
  webUrl: asset.derivatives[config.webDerivative || defaultWebDerivative],
});
