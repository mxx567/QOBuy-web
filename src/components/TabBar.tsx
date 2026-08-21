import favoriteIcon from '../assets/icons/fav.png'
import favoriteFocusedIcon from '../assets/icons/favfilled.png'
import homeIcon from '../assets/icons/home.png'
import homeFocusedIcon from '../assets/icons/homef.png'
import logo from '../assets/Logo.png'

export type TabRoute = 'home' | 'favorites'

type TabBarProps = {
  activeRoute: TabRoute
}

function TabButton({ route, label, activeRoute, icon, activeIcon }: { route: TabRoute; label: string; activeRoute: TabRoute; icon: string; activeIcon: string }) {
  const isActive = route === activeRoute

  return (
    <a className={`tab-button${isActive ? ' active' : ''}`} href={`#/${route}`}>
      <img src={isActive ? activeIcon : icon} alt="" />
      <span>{label}</span>
    </a>
  )
}

export default function TabBar({ activeRoute }: TabBarProps) {
  return (
    <nav className="tab-bar" aria-label="Main navigation">
      <img className="tab-barimage" src={logo} alt="QOBuy" />
      <div className="tab-barleft">
        
        <TabButton route="home" label="Home" activeRoute={activeRoute} icon={homeIcon} activeIcon={homeFocusedIcon} />
        <TabButton route="favorites" label="Favorites" activeRoute={activeRoute} icon={favoriteIcon} activeIcon={favoriteFocusedIcon} />
      </div>
    </nav>
  )
}