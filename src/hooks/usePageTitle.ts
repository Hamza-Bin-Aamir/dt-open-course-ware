import { useEffect } from 'react';

const BASE_TITLE = 'GIKI DT Open Courseware';

/**
 * Hook to update the document title
 * @param title - The page-specific title (will be appended to base title)
 * @param standalone - If true, use title as-is without base title
 */
export function usePageTitle(title?: string, standalone = false) {
  useEffect(() => {
    if (!title) {
      document.title = BASE_TITLE;
    } else if (standalone) {
      document.title = title;
    } else {
      document.title = `${title} | ${BASE_TITLE}`;
    }
    
    // Cleanup: reset to base title when component unmounts
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, standalone]);
}
