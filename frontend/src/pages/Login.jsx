import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = "http://localhost:4000/api/v2/user";

function Login() {
  // "login" | "signup" | "verify"
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState(""); // email waiting for OTP verification

  const navigate = useNavigate();

  // ----- LOGIN -----
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "login failed");
      }

      // save access token locally too, in case you want header-based auth as a fallback
      localStorage.setItem("accessToken", data.data.accessToken);

      navigate("/TikliAI");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----- SIGNUP -----
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "registration failed");
      }

      setPendingEmail(signUpData.email);
      setMode("verify"); // move to OTP step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----- VERIFY OTP -----
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "verification failed");
      }

      setMode("login"); // send them to login after successful verification
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
      <div className='w-full max-w-sm p-8 bg-gray-800 rounded-2xl'>

        {mode === "login" && (
          <>
            <h1 className='text-3xl font-bold mb-6 text-center'>Login</h1>
            <form onSubmit={handleLogin} className='flex flex-col gap-4'>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className='bg-white text-black p-3 rounded-xl'
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className='bg-white text-black p-3 rounded-xl'
                required
              />
              {error && <p className='text-red-400 text-sm'>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-bold disabled:opacity-50'
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className='mt-4 text-center text-gray-400'>
              Don't have an account?{" "}
              <button onClick={() => { setMode("signup"); setError(""); }} className='text-blue-400 underline'>
                Sign up
              </button>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <h1 className='text-3xl font-bold mb-6 text-center'>Sign Up</h1>
            <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
              <input
                type="text"
                placeholder="Username"
                value={signUpData.userName}
                onChange={(e) => setSignUpData({ ...signUpData, userName: e.target.value })}
                className='bg-white text-black p-3 rounded-xl'
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className='bg-white text-black p-3 rounded-xl'
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className='bg-white text-black p-3 rounded-xl'
                required
              />
              {error && <p className='text-red-400 text-sm'>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-bold disabled:opacity-50'
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
            <p className='mt-4 text-center text-gray-400'>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className='text-blue-400 underline'>
                Login
              </button>
            </p>
          </>
        )}

        {mode === "verify" && (
          <>
            <h1 className='text-3xl font-bold mb-2 text-center'>Verify Email</h1>
            <p className='text-gray-400 text-center mb-6'>
              Enter the OTP sent to {pendingEmail}
            </p>
            <form onSubmit={handleVerify} className='flex flex-col gap-4'>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='bg-white text-black p-3 rounded-xl text-center tracking-widest text-xl'
                maxLength={6}
                required
              />
              {error && <p className='text-red-400 text-sm'>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-bold disabled:opacity-50'
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  )
}

export default Login