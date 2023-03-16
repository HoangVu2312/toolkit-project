// layout component that no related to pots or users specifically

import { Outlet } from "react-router-dom";  // Outlet represent all of the children components
import Header from "./Header.js";


// rafce
const Layout = () => {
  return (
    <>
    <Header/>

    <main className="App">  
      <Outlet/> 
    </main>
    </>
  )
}

export default Layout