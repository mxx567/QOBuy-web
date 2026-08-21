import searchIcon from '../assets/icons/search.png'

export default function SearchBar() {
  return (
    <div className="search-bar-container">
      <button className="search-bar" type="button" aria-label="Search listings">
        <span>Find a...</span>
        <img src={searchIcon} alt="" />
      </button>
    </div>
  )
}