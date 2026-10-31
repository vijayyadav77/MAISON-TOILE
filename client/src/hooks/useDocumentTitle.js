import { useEffect } from 'react';

export const useDocumentTitle = (title, prefix = 'MAISON ÉTOILE') => {
  useEffect(() => {
    document.title = title ? `${title} | ${prefix}` : `${prefix} | Luxury High-Fashion`;
  }, [title, prefix]);
};
