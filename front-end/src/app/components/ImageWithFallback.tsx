import { useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackColor?: string;
}

export function ImageWithFallback({ src, alt, fallbackColor = '#1a1a30', className, style, ...props }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={className}
        style={{ backgroundColor: fallbackColor, ...style }}
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
