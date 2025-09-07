type PlayStoreBadgeProps = {
  appStoreUrl: string;
  alt?: string;
};

export const PlayStoreBadge: React.FC<PlayStoreBadgeProps> = ({
  appStoreUrl,
  alt = 'Download on Google Play',
}) => {
  return (
    <a
      href={appStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
    >
      <img
        src="/googlePlayBadge.png"
        alt={alt}
        style={{ height: '48px', marginTop: '10px' }}
      />
    </a>
  );
};
