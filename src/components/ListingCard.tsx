import { useEffect, useState } from 'react'
import favoriteIcon from '../assets/icons/fav.png'
import favoriteFilledIcon from '../assets/icons/favfilled.png'
import type { Listing } from '../types/listing'
import date2string from '../utils/date2string'
import { getListingImage } from '../utils/listingImage'

type ListingCardProps = {
  listing: Listing
  category?: string
  isLiked: boolean
  onLikePress: (nextIsLiked: boolean) => void
}

export default function ListingCard({ listing, category = 'Unknown', isLiked, onLikePress }: ListingCardProps) {
  const [liked, setLiked] = useState(isLiked)

  useEffect(() => setLiked(isLiked), [isLiked])

  function toggleLike() {
    const nextIsLiked = !liked
    setLiked(nextIsLiked)
    onLikePress(nextIsLiked)
  }

  return (
    <article className="listing-card">
      <img className="listing-image" src={getListingImage(listing.pictures)} alt={listing.name} />
      <div className="listing-details">
        <h2>{listing.name || 'UNKNOWN'}</h2>
        <strong>{listing.price} KZT</strong>
        <div className="listing-footer">
          <div className="listing-meta">
            <span>{category}</span>
            <span>{date2string(listing.created_at)}</span>
          </div>
          <button className="like-button" type="button" onClick={toggleLike} aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}>
            <img src={liked ? favoriteFilledIcon : favoriteIcon} alt="" />
          </button>
        </div>
      </div>
    </article>
  )
}