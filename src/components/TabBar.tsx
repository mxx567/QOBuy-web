import { NavLink } from 'react-router-dom'
import favoriteIcon from '../assets/icons/fav.png'
import favoriteFocusedIcon from '../assets/icons/favfilled.png'
import homeIcon from '../assets/icons/home.png'
import homeFocusedIcon from '../assets/icons/homef.png'
import logo from '../assets/Logo.png'




function TabButton({ route, label, activeRoute, icon, activeIcon }: { route: string; label: string; activeRoute: string; icon: string; activeIcon: string }) {
  const isActive = route === activeRoute

  return (
    <NavLink className={`tab-button${isActive ? ' active' : ''}`} to={`/${route}`}>
      <img src={isActive ? activeIcon : icon} alt="" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function TabBar({ activeRoute }: { activeRoute :string }) {
  return (
    <nav className="tab-bar" aria-label="Main navigation">
      <img className="tab-barimage" src={logo} alt="QOBuy" />
      <div className="tab-barleft">
        <TabButton route="" label="Home" activeRoute={activeRoute} icon={homeIcon} activeIcon={homeFocusedIcon} />
        <TabButton route="favourites" label="Favorites" activeRoute={activeRoute} icon={favoriteIcon} activeIcon={favoriteFocusedIcon} />
      </div>
    </nav>
  )
}