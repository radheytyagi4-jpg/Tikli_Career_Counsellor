import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className='bg-gray-800 text-2xl p-5 text-white'>
      <ul className='flex gap-8 justify-center items-center'>
        <li><Link to="/TikliAI">Tikli AI</Link></li>
        <li><Link to="/Chats">Chats</Link></li>
        <li
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        >Logout</li>
      </ul>
    </div>
  )
}

export default Header
