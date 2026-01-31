import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center p-30 gap-4 min-h-screen'>
        <h3 className='text-5xl'>404</h3>
        <h1 className='md:text-7xl text-3xl font-bold'>Cette page n'existe pas.</h1>
        <p className='text-2xl mt-5 font-extralight'>Désolé, nous n'avons pas trouvé la page que vous recherchez.</p>

        <div>
            <button className="btn btn-primary"> <Link to='/'>Primary</Link></button>
        </div>
    </div>
  )
}

export default NotFound