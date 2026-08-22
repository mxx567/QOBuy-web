export type Listing = {
  id: number
  name: string
  pictures: string[] | null
  price: number | string
  category: number | null
  created_at: string
  isUsed?: boolean | null
}

export type Category = {
  id: number
  name: string
}

export type Region = {
  id: number
  full_path: string
  parent_id: number | null
}