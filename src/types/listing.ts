export type Listing = {
  id: number
  name: string
  pictures: string[] | null
  price: number | string
  category: number | null
  created_at: string
}

export type Category = {
  id: number
  name: string
}