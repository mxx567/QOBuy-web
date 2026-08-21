import { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import herolaptop from '../assets/hero/hero-laptop.png'
import heroteddybear from '../assets/hero/hero-teddybear.png'
import heroribbon from '../assets/hero/hero-ribbon.png'
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
      <section className="home-hero" aria-labelledby="home-hero-title">
        <img
          className="hero-ribbon hero-ribbon-rimage"
          src={heroribbon}
          alt=""
        />
        <img
          className="hero-ribbon hero-ribbon-limage"
          src={heroribbon}
          alt=""
        />
        <img
          className="hero-product hero-teddy"
          src={heroteddybear}
          alt=""
        />
        <img
          className="hero-product hero-laptop"
          src={herolaptop}
          alt=""
        />
        <div className="hero-content">
          <h1 id="home-hero-title">Find what you're looking for. Sell what you don't need.</h1>
          <p>Thousands of listings in one place.</p>
          <SearchBar />
        </div>
      </section>
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