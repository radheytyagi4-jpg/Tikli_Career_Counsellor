import { Link } from 'react-router-dom'
import { useState } from 'react'

function LandingPage() {
  const [userIsVerified, setUserIsVerified] = useState(false)


  return (
    <>
      <main className='min-h-screen flex text-white items-center justify-center bg-gray-900'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold'>Tikli AI Counsellor</h1>
          <p className='mt-4 text-gray-400'>Discover your potential of what you can become</p>
          <button className='border-none rounded-3xl text-2xl mt-5 p-4 bg-blue-950'><Link to={userIsVerified ? "/TikliAI" : "/Login"}>Get Started</Link></button>
        </div>
      </main>
    </>
  )
}

export default LandingPage
