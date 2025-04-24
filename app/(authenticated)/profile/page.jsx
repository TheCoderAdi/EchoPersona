'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('proxy-token')
        const userId = localStorage.getItem('proxy-user_id')

        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setProfile(data))
            .finally(() => setLoading(false))
    }, [])

    const renderField = (key, value) => (
        <div key={key} className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">{key.replace(/_/g, ' ')}</span>
            <span className="text-base text-gray-900">
                {value && value.length > 0
                    ? Array.isArray(value)
                        ? value.join(', ')
                        : String(value)
                    : 'Not set'}
            </span>
        </div>
    )

    const renderSection = (section) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(section).map(([key, value]) => renderField(key, value))}
        </div>
    )

    if (loading)
        return (
            <div className="min-h-screen py-10 px-4 flex justify-center items-center">
                <Card className="flex flex-col w-full max-w-4xl shadow-md rounded-lg">
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2 bg-gray-300" />
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Skeleton className="h-6 w-32 bg-gray-300" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-24 bg-gray-300" />
                                    <Skeleton className="h-6 w-full bg-gray-300" />
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            </div>
        )


    return (
        <div className="min-h-screen py-10 px-4 flex justify-center items-center">
            {!profile ? (
                <div className="flex flex-col items-center justify-center text-black">
                    <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
                    <p className="text-gray-600 mb-4">It looks like you have not set up your profile yet.</p>
                    <Button
                        onClick={() => router.push('/profile/update')}
                        className="px-4 py-2 bg-black text-white hover:bg-gray-800"
                    >
                        Set Up Profile
                    </Button>
                </div>
            ) : (
                <Card className="flex justify-around w-full max-w-4xl shadow-md rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">Your Persona Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="bg-gray-100 w-full justify-start mb-6">
                                <TabsTrigger className={"cursor-pointer"} value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger className={"cursor-pointer"} value="communication">Communication Style</TabsTrigger>
                                <TabsTrigger className={"cursor-pointer"} value="professional">Professional</TabsTrigger>
                                <TabsTrigger className={"cursor-pointer"} value="personal">Personal</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic"
                                className="transition-all duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2 data-[state=active]:opacity-100 data-[state=active]:translate-y-0"

                            >
                                <div className="space-y-4">
                                    {renderSection(
                                        Object.fromEntries(
                                            Object.entries(profile).filter(
                                                ([key]) =>
                                                    !['communication_style', 'professional', 'personal'].includes(key)
                                            )
                                        )
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="communication"
                                className="transition-all duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2 data-[state=active]:opacity-100 data-[state=active]:translate-y-0"
                            >
                                {renderSection(profile.communication_style || {})}
                            </TabsContent>

                            <TabsContent value="professional"
                                className="transition-all duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2 data-[state=active]:opacity-100 data-[state=active]:translate-y-0"
                            >
                                {renderSection(profile.professional || {})}
                            </TabsContent>

                            <TabsContent value="personal"
                                className="transition-all duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2 data-[state=active]:opacity-100 data-[state=active]:translate-y-0"
                            >
                                {renderSection(profile.personal || {})}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex justify-end" >
                            <Button
                                onClick={() => router.push('/profile/update')}
                                className="cursor-pointer w-full"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
