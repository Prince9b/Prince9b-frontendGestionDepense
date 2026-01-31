import React from 'react'
import Navbar from '../components/Navbar'
import Transactions from '../components/Transactions'

function Home() {

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <Transactions/>
    </div>
  )
}

export default Home