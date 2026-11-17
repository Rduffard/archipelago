export const creatorPreviewEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_LINEAGE_CREATOR === 'true';

export const characterCreationPath = creatorPreviewEnabled ? '/characters/create' : '/characters/new';
