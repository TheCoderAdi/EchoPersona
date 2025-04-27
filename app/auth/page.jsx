'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSendVerification, setIsSendVerification] = useState(false);


  const handleAuthCheck = (userId, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userId.length < 3) {
      toast.error("User ID must be at least 3 characters ");
      return false;
    } else if (!emailRegex.test(userId)) {
      toast.error("User ID must be a valid email");
      return false;
    } else if (!userId.endsWith('gmail.com')) {
      toast.error("User ID must be a google email");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    } else if (!password.match(/[0-9]/)) {
      toast.error("Password must contain at least one number");
      return false;
    }
    else if (!password.match(/[a-z]/)) {
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }
    else if (!password.match(/[A-Z]/)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    else if (!password.match(/[^a-zA-Z0-9]/)) {
      toast.error("Password must contain at least one special character");
      return false;
    }
    else if (password.includes(userId)) {
      toast.error("Password must not contain User ID");
      return false;
    }
    else if (password.includes(' ')) {
      toast.error("Password must not contain spaces");
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!userId || !password) {
      toast.error("All fields are required");
      return;
    }

    if (handleAuthCheck(userId, password) === false) return;
    try {
      setLoading(true);
      const endpoint = isLogin ? '/login' : '/register';
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Something went wrong");
        return;
      }

      if (isLogin) {
        toast.success("Login successful");
        const token = data.access_token;

        localStorage.setItem('proxy-token', token);

        router.push('/dashboard');
      } else {
        toast.success("Check your email to verify your account(Also check spam folder)");
        setIsLogin(true);
      }
    }
    catch (error) {
      console.log(error)
      toast.error(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    let token = localStorage.getItem('proxy-token');
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status === 200) {
        router.push('/dashboard');
      }
    }).catch((err) => {
      router.push('/auth');
    })
  }, [])

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'verified') {
      toast.success("Email successfully verified! 🎉");
      const url = new URL(window.location.href);
      url.searchParams.delete('message');
      window.history.replaceState({}, document.title, url);
    }
  }, [searchParams]);


  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin h-10 w-10 text-gray-900" /></div>}>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>

        <Card className="w-full z-10 max-w-md shadow-2xl text-black bg-white/80 dark:bg-slate-900 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Welcome Back 👋' : 'Create an Account'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSendVerification ? (
              <>
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input
                    className="border-gray-300 text-black"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <Button
                  className="cursor-pointer w-full"
                  onClick={async () => {
                    if (!userId) {
                      toast.error("Please enter your email");
                      return;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(userId) || !userId.endsWith('gmail.com')) {
                      toast.error("Please enter a valid Google email");
                      return;
                    }
                    try {
                      setLoading(true);
                      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: userId.trim() }),
                      });
                      const data = await res.json();
                      if (res.status !== 200) {
                        toast.error(data.detail || "Something went wrong");
                        return;
                      }
                      setIsSendVerification(false);
                      toast.success("Verification email sent!");
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to send verification email");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    "Send Verification Email"
                  )}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  <button
                    className="underline cursor-pointer font-bold text-black"
                    onClick={() => setIsSendVerification(false)}
                  >
                    Back to Login/Register
                  </button>
                </p>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input
                    className="border-gray-300 text-black"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      className="border-gray-300 text-black pr-10"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-xs text-gray-900 cursor-pointer"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <Button className="cursor-pointer w-full" onClick={handleSubmit}>
                  {loading ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : isLogin ? (
                    'Login'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
                <div className="flex flex-col space-y-2">
                  <p className="text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      className="underline cursor-pointer font-bold text-black"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                  </p>
                  <button
                    className="text-xs underline text-center text-gray-500 cursor-pointer"
                    onClick={() => setIsSendVerification(true)}
                  >
                    Send Verification Email
                  </button>
                </div>
              </>
            )}
          </CardContent>

        </Card>
      </div>
    </Suspense>
  );
}
