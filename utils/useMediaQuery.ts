import { useEffect, useState } from 'react'

// MIT License
// Copyright (c) 2020 Julien CARON
// https://github.com/juliencrn/usehooks-ts
// https://usehooks-ts.com/react-hook/use-media-query
export const useMediaQueryWithoutSSR = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  }

  const [matches, setMatches] = useState<boolean>(getMatches(query))

  function handleChange() {
    setMatches(getMatches(query))
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query)

    // Triggered at the first client-side load and if query changes
    handleChange()

    // Listen matchMedia
    matchMedia.addEventListener('change', handleChange)

    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return matches
}

export const useMediaQuery = (query: string) => {
  const state = useMediaQueryWithoutSSR(query)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, [state])

  return { ready, state: ready && state }
}
