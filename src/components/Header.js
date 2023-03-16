// global component that will not change during routing

import {Link} from "react-router-dom";



const Header = () => {  // tag header must be lowercase
  return (
    <header>  
        <h1 className="logo" >Blog toolkit</h1>
        <nav className="nav">
            <ul>
                <li><Link to="/">HOME</Link></li>
                <li><Link to="post">POSTS</Link></li>
                <li><Link to="user">USERS</Link></li>
            </ul>
        </nav>
        <div className="toggle-nav">&#9776;</div>
    </header>
  )
}

export default Header