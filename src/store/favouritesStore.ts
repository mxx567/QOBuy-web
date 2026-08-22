import { create } from 'zustand'
import { supabase } from '../supabase';

type favoritesStore = {
  likedListingIds: number[],
  isLoading: boolean,
  updateIsLoading(isLoading : boolean): void,
  setLikedListingIds(likedListingIds : number[]): void,
  refreshFavorites: (userId?:string) => Promise<void>,
  toggleFavorite: (userId: string | undefined, listingId: number, nextIsLiked: boolean) => Promise<void>
}

export const useFavoritesData = create<favoritesStore>((set,get) => ({
  likedListingIds: [],
  isLoading: false,
  updateIsLoading: (isLoading) => set({isLoading}),
  setLikedListingIds: (likedListingIds) => set({ likedListingIds }),
  refreshFavorites: async (userId) =>{
    if (!userId) {
        set({ likedListingIds : [], isLoading: false})
        return
      }
  
      set({isLoading: true})
      const { data, error } = await supabase
        .from('liked')
        .select('listing_id')
        .eq('user_id', userId)
  
      if (error) {
        console.error('Error fetching liked listings:', error.message)
        set({likedListingIds: []})
      } else {
        set({
          likedListingIds: (data ?? []).map((row: { listing_id: number }) => row.listing_id),
          isLoading: false,
        })
      }
  },
  toggleFavorite:  async (userId, listingId, nextIsLiked) => {
    if (!userId) return

    const previous = get().likedListingIds

    set((state) => ({
      likedListingIds: nextIsLiked
        ? [...new Set([...state.likedListingIds, listingId])]
        : state.likedListingIds.filter((id) => id !== listingId),
    }))

    const request = nextIsLiked
      ? supabase.from('liked').insert({ user_id: userId, listing_id: listingId })
      : supabase.from('liked').delete().eq('user_id', userId).eq('listing_id', listingId)

    const { error } = await request
    if (error) {
      console.error("Couldn't update favorite:", error.message)
      set({ likedListingIds: previous })
    }
  },
}))
