import { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useFavorites } from '../hooks/useFavorites'
import { supabase } from '../supabase'
import type { Category, Listing } from '../types/listing'

export default function FavoritesScreen() {
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isListingsLoading, setIsListingsLoading] = useState(true)
  const { likedListingIds, isLoading: areFavoritesLoading, toggleFavorite } = useFavorites()

  useEffect(() => {
    let isActive = true

    async function loadFavoriteListings() {
      setIsListingsLoading(true)
      if (!likedListingIds.length) {
        if (isActive) {
          setListings([])
          setIsListingsLoading(false)
        }
        return
      }

      const [listingsResult, categoriesResult] = await Promise.all([
        supabase.from('Listings').select('id, name, pictures, price, category, created_at').in('id', likedListingIds),
        supabase.from('subcategories').select('id, name'),
      ])

      if (!isActive) return
      if (listingsResult.error) console.error('Error fetching favorite listings:', listingsResult.error.message)
      if (categoriesResult.error) console.error('Error fetching categories:', categoriesResult.error.message)
      setListings(listingsResult.data ?? [])
      setCategories(categoriesResult.data ?? [])
      setIsListingsLoading(false)
    }

    void loadFavoriteListings()
    return () => { isActive = false }
  }, [likedListingIds])

  if (areFavoritesLoading || isListingsLoading) return <main className="route-loading"><LoadingSpinner /></main>

  return (
    <main className="favorites-page">
      <h1>Favorites</h1>
      <section className="listings-content">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            category={categories.find((category) => category.id === listing.category)?.name}
            isLiked={likedListingIds.includes(listing.id)}
            onLikePress={(nextIsLiked) => void toggleFavorite(listing.id, nextIsLiked)}
          />
        ))}
        {!listings.length && <p className="empty-message">No favorite listings yet.</p>}
      </section>
    </main>
  )
}