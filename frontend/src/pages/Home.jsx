import React from 'react'
import Banner from './Banner'
import Story from './Story'
import HomeService from './HomeService'
import Offer from './Offer'
import Reserve from './Reserve'
import Recommendation from './Recommendation'



function Home() {
  return (
    <>
    <Banner/>
    <Story/>
    <HomeService />
    <Offer />
    <Reserve />
    <Recommendation />
    </>
  )
}

export default Home
