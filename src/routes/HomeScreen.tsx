import { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import herolaptop from '../assets/hero/hero-laptop.png'
import heroteddybear from '../assets/hero/hero-teddybear.png'
import heroribbon from '../assets/hero/hero-ribbon.png'
import categoryIcon from '../assets/icons/categories.png'
import locationIcon from '../assets/icons/location.png'
import priceIcon from '../assets/icons/price.png'
import keywordIcon from '../assets/icons/titlename.png'
import { useFavoritesData } from '../store/favouritesStore'
import { supabase } from '../supabase'
import type { Category, Listing, Region } from '../types/listing'
import { useAuthStore } from '../store/authStore'

type PriceSort = 'newest' | 'cheapest' | 'expensive' | 'free'
type Condition = 'used' | 'new' | ''

export default function HomeScreen() {
  // const {user, isLoading: isAuthLoading} = useAuth();
  const user = useAuthStore((s) => s.user);
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [priceSort, setPriceSort] = useState<PriceSort>('newest')
  const [condition, setCondition] = useState<Condition>('')
  const [isLoading, setIsLoading] = useState(true)
  const { likedListingIds, isLoading: areFavoritesLoading, toggleFavorite } = useFavoritesData()

  useEffect(() => {
    let isActive = true

    async function loadListings() {
      setIsLoading(true)
      let listingsQuery = supabase
        .from('Listings')
        .select('id, name, pictures, price, category, created_at, isUsed')
        .limit(30)

      const trimmedKeyword = keyword.trim()
      if (trimmedKeyword) listingsQuery = listingsQuery.or(`name.ilike.%${trimmedKeyword}%,desc.ilike.%${trimmedKeyword}%`)
      if (categoryId) listingsQuery = listingsQuery.eq('category', Number(categoryId))
      if (regionId) {
        const regionIds = [Number(regionId)]
        const regionsToVisit = [Number(regionId)]

        while (regionsToVisit.length) {
          const currentRegionId = regionsToVisit.pop()
          const children = regions.filter((region) => region.parent_id === currentRegionId)
          children.forEach((region) => {
            regionIds.push(region.id)
            regionsToVisit.push(region.id)
          })
        }

        listingsQuery = listingsQuery.in('place_id', regionIds)
      }
      if (priceFrom) listingsQuery = listingsQuery.gte('price', Number(priceFrom))
      if (priceTo) listingsQuery = listingsQuery.lte('price', Number(priceTo))
      if (priceSort === 'free') listingsQuery = listingsQuery.eq('price', 0)
      if (condition) listingsQuery = listingsQuery.eq('isUsed', condition === 'used')

      listingsQuery = priceSort === 'cheapest'
        ? listingsQuery.order('price', { ascending: true })
        : priceSort === 'expensive'
          ? listingsQuery.order('price', { ascending: false })
          : listingsQuery.order('created_at', { ascending: false })

      const [listingsResult, categoriesResult, regionsResult] = await Promise.all([
        listingsQuery,
        supabase.from('subcategories').select('id, name'),
        supabase.from('places').select('id, full_path, parent_id'),
      ])

      if (!isActive) return
      if (listingsResult.error) console.error('Error fetching listings:', listingsResult.error.message)
      if (categoriesResult.error) console.error('Error fetching categories:', categoriesResult.error.message)
      if (regionsResult.error) console.error('Error fetching regions:', regionsResult.error.message)
      setListings(listingsResult.data ?? [])
      setCategories(categoriesResult.data ?? [])
      setRegions(regionsResult.data ?? [])
      setIsLoading(false)
    }

    void loadListings()
    return () => { isActive = false }
  }, [categoryId, condition, keyword, priceFrom, priceSort, priceTo, regionId])

  

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
      <section className="home-listings-layout" aria-label="Listings">
        <aside className="search-parameters" aria-labelledby="search-parameters-title">
          <h2 id="search-parameters-title">Search parameters</h2>
          <label className="filter-field">
            <span className="filter-label"><img src={keywordIcon} alt="" />Keywords</span>
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search listings" />
          </label>
          <label className="filter-field">
            <span className="filter-label"><img src={categoryIcon} alt="" />Category</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Any category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label"><img src={locationIcon} alt="" />Region</span>
            <select value={regionId} onChange={(event) => setRegionId(event.target.value)}>
              <option value="">Any region</option>
              {regions.map((region) => <option key={region.id} value={region.id}>{region.full_path}</option>)}
            </select>
          </label>
          <fieldset className="filter-field">
            <span className="filter-label"><img src={priceIcon} alt="" />Price range</span>
            <div className="price-range-inputs">
              <input type="number" min="0" value={priceFrom} onChange={(event) => setPriceFrom(event.target.value)} placeholder="From" />
              <input type="number" min="0" value={priceTo} onChange={(event) => setPriceTo(event.target.value)} placeholder="To" />
            </div>
          </fieldset>
          <label>
            Sort by price
            <select value={priceSort} onChange={(event) => setPriceSort(event.target.value as PriceSort)}>
              <option value="newest">Newest</option>
              <option value="cheapest">Cheapest</option>
              <option value="expensive">Most expensive</option>
              <option value="free">Free</option>
            </select>
          </label>
          <fieldset>
            <span className="filter-label">Condition</span>
            <div className="filter-options">
              <button className={!condition ? 'selected' : ''} type="button" onClick={() => setCondition('')}>Any</button>
              <button className={condition === 'used' ? 'selected' : ''} type="button" onClick={() => setCondition('used')}>Used</button>
              <button className={condition === 'new' ? 'selected' : ''} type="button" onClick={() => setCondition('new')}>New</button>
            </div>
          </fieldset>
        </aside>
        {isLoading && 
          <main className="route-loading">
            <LoadingSpinner />
          </main>
        }
        {!isLoading &&
          <div className="listings-content">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                category={categories.find((category) => category.id === listing.category)?.name}
                isLiked={likedListingIds.includes(listing.id)}
                onLikePress={(nextIsLiked) => void toggleFavorite(user?.id, listing.id, nextIsLiked)}
              />
            ))}
            {!listings.length && <p className="empty-message">No listings found.</p>}
          </div>
        }
        
      </section>
    </main>
  )
}