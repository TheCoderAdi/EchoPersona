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

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!userId || !password) {
      toast.error("All fields are required");
      return;
    }

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
        toast.success("Signup successful, you can now log in");
        setIsLogin(true);
      }
    }
    catch (error) {
      console.log(error)
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


  return (
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
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input
              className="border-gray-300 text-black"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your username"
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
          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              className="underline cursor-pointer font-bold text-black"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
