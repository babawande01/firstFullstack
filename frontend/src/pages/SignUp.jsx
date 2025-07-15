import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/authStore';


const SignUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useAuthStore();




  const handleSignUp = async (e) => {
    e.preventDefault();
    // Here you would typically send the user data to your backend for registration
    // For example, using fetch or axios to make a POST request
    

    // try and catch block
    try {
      await signup( userName, email, password);
      // After successful registration, you might want to redirect the user
      navigate('/');
    } catch (error) {
      console.log(error);
    }   

    // // After successful registration, you might want to redirect the user
    // navigate('/signin');
  }


  

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/background_banner.jpg')",
    }}>

        <div className='max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto mt-8 '>
            <h1 className='text-3xl font-medium text-white mb-7'>Sign Up</h1>

            <form onSubmit={handleSignUp} className='flex flex-col space-y-4'>
                <input type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder='username' className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base'/>

                <input type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='johndoe@email' className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base'/>



                <input type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password' className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base'/>

                {error && <p className='text-red-500 text-sm'>{error}</p>}

                <button type='submit' disabled= {isLoading} className='w-full h-[50px] bg-[#e50914] text-white rounded text-base font-semibold hover:bg-[#f40612] transition-all duration-300 text-base hover:opacity-90 cursor-pointer'>Sign Up</button>
            </form>

            <div className='mt-10 text-[#737373] text-sm'>
              <p>Aleardy Have An Account{""} <span onClick={() => navigate('/signin')} className='text-white font-medium cursor-pointer ml-2 hover:underline'>Sign In Now</span></p>
            </div>
        </div>

    </div>
  )
}

export default SignUp