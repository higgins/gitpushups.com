import React from 'react';

type AppStoreBadgeProps = {
  appStoreUrl: string;
  alt?: string;
};

export const AppStoreBadge: React.FC<AppStoreBadgeProps> = ({
  appStoreUrl,
  alt = 'Download on the App Store',
}) => {
  return (
    <a
      href={appStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
    >
      <img
        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
        alt={alt}
        style={{ height: '48px', marginTop: '10px' }}
      />
    </a>
  );
};
