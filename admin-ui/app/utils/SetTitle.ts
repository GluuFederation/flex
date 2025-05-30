// @ts-nocheck
import { useEffect } from 'react'

function useSetTitle(title = 'Dashboard') {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pageTitle = document.getElementById('page-title');
      if (pageTitle) {
        pageTitle.innerHTML = title;
      }
    }
  }, [title])  
}

export default useSetTitle
