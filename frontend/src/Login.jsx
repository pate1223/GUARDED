import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";
import ForgotPassword from "./ForgotPassword";
import { signInWithEmail, signInWithGoogle } from "./services/firebase";
import { apiService } from "./services/api";
  import { signInWithFacebook } from "./services/firebase"; 

export default function Login({ onBack, onCloseParent }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // show ForgotPassword screen when requested
  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} onCloseParent={onCloseParent} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        // Get Firebase token
        const token = await result.user.getIdToken();
        
        // Verify user in backend database
        const verifyResult = await apiService.verifyUser(token);
        
        if (verifyResult.success) {
          // Store token and redirect
          localStorage.setItem('firebase_token', token);
          console.log('Login successful:', verifyResult.user);
          // TODO: Redirect to dashboard based on user role
          window.location.href = '/dashboard';
        } else {
          setError('User not found in database. Please contact support.');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        // Get Firebase token
        const token = await result.user.getIdToken();
        
        // Verify user in backend database
        const verifyResult = await apiService.verifyUser(token);
        
        if (verifyResult.success) {
          // Store token and redirect
          localStorage.setItem('firebase_token', token);
          console.log('Google login successful:', verifyResult.user);
          // TODO: Redirect to dashboard based on user role
          window.location.href = '/dashboard';
        } else {
          setError('User not found in database. Please register first.');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };



const handleFacebookSignIn = async () => {
  setLoading(true);
  setError("");

  try {
    const result = await signInWithFacebook();

    if (result.success) {
      const token = await result.user.getIdToken();
      const verifyResult = await apiService.verifyUser(token);

      if (verifyResult.success) {
        localStorage.setItem("firebase_token", token);
        console.log("Facebook login successful:", verifyResult.user);
        window.location.href = "/dashboard";
      } else {
        setError("User not found in database. Please register first.");
      }
    } else {
      setError(result.error);
    }
  } catch (error) {
    setError("Facebook sign-in failed. Please try again.");
    console.error("Facebook sign-in error:", error);
  } finally {
    setLoading(false);
  }
};


  

return (
  <div className="w-full min-h-screen flex items-center justify-center bg-white">
    {/* Outer container now fills full screen */}
    <div className="w-full h-full min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Illustration */}
      <div className="w-full md:w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative p-6">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-purple-100 transition"
          aria-label="Back"
          type="button"
        >
          <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <img
            src={Undraw}
            alt="Illustration"
            className="w-[320px] max-w-full h-auto object-contain mb-6"
            style={{ filter: 'drop-shadow(0 12px 24px rgba(92,82,255,0.12))' }}
          />
          <div className="text-4xl font-handwritten text-[#44425a] text-center mb-8 px-4">
            Every click matters.<br />Learn to click smart.
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
            <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back!</h2>
          <div className="text-gray-400 text-lg mb-6 text-center">Sign in to continue</div>
        </div>

          {error && (
            <div className="w-[80%] mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Id"
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full py-4 pl-12 pr-12 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff] focus:outline-none"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 1l22 22M17.94 17.94A10.94 10.94 0 0 1 12 19.5c-5 0-9.27-3.11-11-7.5a10.97 10.97 0 0 1 5.17-5.92M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-5.97" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setShowForgot(true)} className="text-[#5c52ff] font-semibold hover:underline text-base">Forgot password?</button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl font-bold shadow hover:bg-[#4335d1] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center w-full my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="mx-4 text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

<div className="flex gap-4 mb-4">
  {/* Google Sign-In */}
  <button 
    onClick={handleGoogleSignIn}
    disabled={loading}
    className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {/* Google "G" Placeholder */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="w-6 h-6">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.5h147c-6.3 33.9-25.3 62.7-53.9 82.1l87.1 67.7c50.9-46.9 81.3-116 81.3-194.9z"/>
      <path fill="#34A853" d="M272 544.3c72.7 0 133.7-24.1 178.2-65.1l-87.1-67.7c-24.1 16.2-55 25.7-91.1 25.7-69.9 0-129.2-47.2-150.5-110.7l-92.6 71.6c44.8 88.5 137 146.2 243.1 146.2z"/>
      <path fill="#FBBC05" d="M121.5 326.5c-5.5-16.2-8.6-33.6-8.6-51.5s3.1-35.3 8.6-51.5l-92.6-71.6C10.2 192.9 0 233.3 0 275s10.2 82.1 28.9 122.1l92.6-71.6z"/>
      <path fill="#EA4335" d="M272 107.7c39.6 0 75.1 13.6 103.1 40.4l77.4-77.4C405.7 24.1 344.7 0 272 0 166 0 73.8 57.7 28.9 153l92.6 71.6C142.8 154.9 202.1 107.7 272 107.7z"/>
    </svg>
  </button>

{/* Facebook Sign-In */}
<button 
  onClick={handleFacebookSignIn}
  disabled={loading}
  className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {/* Facebook Icon */}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-5 h-5" fill="#1877F2">
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 
      12.42-50.06 52.24-50.06h40.42V6.26S293.48 0 
      269.5 0c-73.06 0-121.5 44.38-121.5 
      124.72v70.62H86.41V288h61.59v224h92.66V288z"/>
  </svg>
</button>




  {/* Placeholder button */}
  <button 
    disabled={loading}
    className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {/* Placeholder Circle */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  </button>
</div>



        </div>
      </div>
    </div>
  );
}