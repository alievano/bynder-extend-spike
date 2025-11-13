export type BynderElementImage =
  & Omit<BynderImage, "url" | "derivatives">
  & Readonly<{
    bynderUrl: string;
    previewUrl: string | undefined;
    webUrl: string | undefined;
    crop?: {
      unit: '%' | 'px';
      x: number;
      y: number;
      width: number;
      height: number;
    };
    focalPoint?: {
      x: number; // 0-1 relative to width
      y: number; // 0-1 relative to height
    };
  }>;
