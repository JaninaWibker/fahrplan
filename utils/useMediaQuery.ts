import { useEffect, useState } from 'react'

type MediaQueryResult = {
  ready: boolean
  state: boolean
}

// MIT License
// Copyright (c) 2020 Julien CARON
// https://github.com/juliencrn/usehooks-ts
// https://usehooks-ts.com/react-hook/use-media-query
export const useMediaQuery = (query: string): MediaQueryResult => {
  // TODO: this doesn't really actually properly work with SSR
  const getMatches = (query: string): MediaQueryResult => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return { ready: true, state: window.matchMedia(query).matches }
    }
    return { ready: false, state: false }
  }

  const [matches, setMatches] = useState<MediaQueryResult>(getMatches(query))

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
