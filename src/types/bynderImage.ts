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
  }>;
