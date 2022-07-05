import { useEffect } from 'react'

function useSetTitle(title = 'Dashboard') {
  useEffect(() => {
    document.getElementById('page-title').innerHTML = title
  }, [title])
}

export default useSetTitle
