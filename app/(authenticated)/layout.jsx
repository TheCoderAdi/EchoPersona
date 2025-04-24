"use client"
import Sidebar from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Loader from '@/components/Loader';

export default function AuthLayout({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('proxy-token');
        if (!token) {
            router.push('/auth');
            return;
        }
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status === 200) {
                router.push('/dashboard');
            }
        }).catch((err) => {
            console.log(err);
            router.push('/auth');
        }).finally(() => {
            setLoading(false);
        });
    }, [router]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64">{children}</main>
        </div>
    )
}
