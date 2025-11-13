import { FC } from "react";

import { BynderElementImage } from "./types/bynderImage";

type Props = Readonly<{
  images: ReadonlyArray<BynderElementImage>;
  isDisabled: boolean;
  removeImage: (imageId: string) => void;
}>;

export const SelectedImages: FC<Props> = props => (
  <div className="selected">
    {props.images.map(image => (
      <div
        key={image.id}
        className="asset-thumbnail"
      >
        <div className="asset-preview">
          <div className="asset-thumbnail__actions-pane">
            {!!image.webUrl && (
              <a
                className="asset-action"
                title="Download"
                href={image.webUrl}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-arrow-down-line" />
              </a>
            )}
            {!props.isDisabled && (
              <button
                className="asset-action asset-action--remove"
                title="Remove"
                onClick={() => props.removeImage(image.id)}
              >
                <i className="icon-times" />
              </button>
            )}
          </div>
          {renderImage(image)}
          <div className="asset-thumbnail__bottom">{image.name}</div>
        </div>
      </div>
    ))}
  </div>
);

SelectedImages.displayName = "SelectedImages";

const renderImage = (image: BynderElementImage) => {
  if (!image.previewUrl) {
    return <div className="noimage">No image available</div>;
  }

  // Crop preview logic
  let style: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  let wrapperStyle: React.CSSProperties = { width: 120, height: 68, overflow: 'hidden', position: 'relative', display: 'inline-block', background: '#eee' };
  if (image.crop) {
    // Calculate crop as percent
    const { x, y, width, height, unit } = image.crop;
    if (unit === '%') {
      style = {
        ...style,
        objectPosition: `${50 - x - width / 2}% ${50 - y - height / 2}%`,
        width: `${100 / (width / 100)}%`,
        height: `${100 / (height / 100)}%`,
      };
      wrapperStyle = {
        ...wrapperStyle,
        aspectRatio: `${width}/${height}`,
      };
    }
    // px support could be added if needed
  }

  return (
    <a
      href={image.bynderUrl}
      target="_blank"
      rel="noreferrer"
    >
      <div style={wrapperStyle}>
        <img
          className="asset-thumbnail__image"
          src={image.previewUrl}
          alt={image.description}
          style={style}
        />
        {image.focalPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${image.focalPoint.x * 100}%`,
              top: `${image.focalPoint.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'red', border: '2px solid #fff' }} />
          </div>
        )}
      </div>
    </a>
  );
};
