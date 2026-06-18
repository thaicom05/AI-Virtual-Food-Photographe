
import React, { useState, useEffect } from 'react';
import { getImage } from '../services/indexedDBService';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ imageId, className, alt, ...rest }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (imageId) {
      setLoading(true);
      setImageUrl(null); // Reset on id change
      getImage(imageId).then(url => {
        if (isMounted && url) {
          setImageUrl(url);
        }
        setLoading(false);
      }).catch(() => {
        if(isMounted) setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [imageId]);

  if (loading) {
    return (
      <div className={`${className || ''} bg-gray-700 flex items-center justify-center`}>
        <div className="w-8 h-8 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!imageUrl) {
    return <div className={`${className || ''} bg-gray-700 flex items-center justify-center text-xs text-gray-400 p-2 text-center`}>Image not found</div>;
  }

  return <img src={imageUrl} className={className} alt={alt} {...rest} />;
};

export default ImageWithLoader;
