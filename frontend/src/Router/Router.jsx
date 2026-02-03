import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Main from '../layout/Main'
import Home from '../pages/Home'
import Menu from '../pages/Menu'
import Product from '../pages/Product'
import Contact from '../pages/Contact'
import Auth from '../pages/Auth'
import Payment from '../pages/Payment'
import Review from '../pages/Review'
import Admin from '../pages/Admin'
import AdminLogin from '../pages/AdminLogin'
import AdminProtected from '../components/AdminProtected'
import OrderTracking from '../pages/OrderTracking'

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
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/payment",
        element: <Payment />
      },
      {
        path: "/review",
        element: <Review />
      },
      {
        path: "/track-order",
        element: <OrderTracking />
      },
      {
        path: "/admin",
        element: (
          <AdminProtected>
            <Admin />
          </AdminProtected>
        )
      },
      {
        path: "/admin-login",
        element: <AdminLogin />
      },
    ]
  },


]);

export default router
