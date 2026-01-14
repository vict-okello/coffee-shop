import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Main from '../layout/Main'
import Home from '../pages/Home'
import Menu from '../pages/Menu'
import Product from '../pages/Product'
import Contact from '../pages/Contact'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/menu",
        element: <Menu/>
      },
      {
        path: "/product",
        element: <Product/>
      },
      {
        path: "/contact",
        element: <Contact/>
      },
    ]
  },


]);

export default router