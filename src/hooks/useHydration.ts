import { useEffect, useRef } from 'react'

export function useHydration() {
  const hydratedRef = useRef(false)
  
  useEffect(() => {
    hydratedRef.current = true
  }, [])
  
  // Return true after initial render on client
  return hydratedRef.current || typeof window !== 'undefined'
}
