import { NavLink } from 'react-router-dom'
import favoriteIcon from '../assets/icons/fav.png'
import favoriteFocusedIcon from '../assets/icons/favfilled.png'
import homeIcon from '../assets/icons/home.png'
import homeFocusedIcon from '../assets/icons/homef.png'
import userIcon from '../assets/icons/user.png'
import logo from '../assets/Logo.png'
import { supabase } from '../supabase'
import { use } from 'react'


async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
  }
}

function TabButton({ route, label, activeRoute, icon, activeIcon }: { route: string; label: string; activeRoute: string; icon: string; activeIcon: string }) {
  const isActive = route === activeRoute

  return (
    <NavLink className={`tab-button${isActive ? ' active' : ''}`} to={`/${route}`}>
      <img src={isActive ? activeIcon : icon} alt="" />
      <span>{label}</span>
    </NavLink>
  )
}

function SignOutButton({onClick} : {onClick() : void}) {

  return (
    <button className={'signout-button'} onClick={onClick} >
      <img src={userIcon} alt="" />
      <span>{"Sign Out"}</span>
    </button>
  )
}

export default function TabBar({ activeRoute }: { activeRoute :string }) {
  return (
    <nav className="tab-bar" aria-label="Main navigation">
      <img className="tab-barimage" src={logo} alt="QOBuy" />
      <div className="tab-barleft">
        <TabButton route="" label="Home" activeRoute={activeRoute} icon={homeIcon} activeIcon={homeFocusedIcon} />
        <TabButton route="favourites" label="Favorites" activeRoute={activeRoute} icon={favoriteIcon} activeIcon={favoriteFocusedIcon} />
        <SignOutButton onClick={onSignOutButtonPress} />
      </div>
    </nav>
  )
}