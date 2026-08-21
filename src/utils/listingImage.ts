export function getListingImage(pictures: string[] | null) {
  if (!pictures?.length) return 'https://i.ibb.co.com/9mGCjPYY/notfound.png'

  try {
    const picture = JSON.parse(pictures[0]) as { uri?: string }
    return picture.uri ?? 'https://i.ibb.co.com/9mGCjPYY/notfound.png'
  } catch {
    return 'https://i.ibb.co.com/9mGCjPYY/notfound.png'
  }
}