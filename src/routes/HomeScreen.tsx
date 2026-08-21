import { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useFavorites } from '../hooks/useFavorites'
import { supabase } from '../supabase'
import type { Category, Listing } from '../types/listing'

export default function HomeScreen() {
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { likedListingIds, isLoading: areFavoritesLoading, toggleFavorite } = useFavorites()

  useEffect(() => {
    let isActive = true

    async function loadListings() {
      setIsLoading(true)
      const [listingsResult, categoriesResult] = await Promise.all([
        supabase.from('Listings').select('id, name, pictures, price, category, created_at').order('created_at', { ascending: false }).limit(30),
        supabase.from('subcategories').select('id, name'),
      ])

      if (!isActive) return
      if (listingsResult.error) console.error('Error fetching listings:', listingsResult.error.message)
      if (categoriesResult.error) console.error('Error fetching categories:', categoriesResult.error.message)
      setListings(listingsResult.data ?? [])
      setCategories(categoriesResult.data ?? [])
      setIsLoading(false)
    }

    void loadListings()
    return () => { isActive = false }
  }, [])

  if (isLoading || areFavoritesLoading) return <main className="route-loading"><LoadingSpinner /></main>

  return (
    <main className="listings-page">
      <SearchBar />
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
        {!listings.length && <p className="empty-message">No listings found.</p>}
      </section>
    </main>
  )
}