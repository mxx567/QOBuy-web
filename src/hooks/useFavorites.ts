import { useEffect, useState } from 'react'
import { useAuth } from '../auth'
import { supabase } from '../supabase'

export function useFavorites() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [likedListingIds, setLikedListingIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function refreshFavorites() {
    if (!user) {
      setLikedListingIds([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from('liked')
      .select('listing_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching liked listings:', error.message)
      setLikedListingIds([])
    } else {
      setLikedListingIds((data ?? []).map((row: { listing_id: number }) => row.listing_id))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isAuthLoading) void refreshFavorites()
  }, [isAuthLoading, user?.id])

  async function toggleFavorite(listingId: number, nextIsLiked: boolean) {
    if (!user) return

    const previous = likedListingIds
    setLikedListingIds((current) => nextIsLiked
      ? [...new Set([...current, listingId])]
      : current.filter((id) => id !== listingId))

    const request = nextIsLiked
      ? supabase.from('liked').insert({ user_id: user.id, listing_id: listingId })
      : supabase.from('liked').delete().eq('user_id', user.id).eq('listing_id', listingId)
    const { error } = await request

    if (error) {
      console.error("Couldn't update favorite:", error.message)
      setLikedListingIds(previous)
    }
  }

  return { likedListingIds, isLoading: isAuthLoading || isLoading, toggleFavorite, refreshFavorites }
}