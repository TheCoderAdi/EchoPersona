'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'

export default function UpdateProfilePage() {
    const [profile, setProfile] = useState(null)
    const [updatedFields, setUpdatedFields] = useState({})
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('proxy-token')
        const userId = localStorage.getItem('proxy-user_id')

        if (!token || !userId) return

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setProfile(data)
                }
            })
            .catch(err => console.error('Error fetching profile:', err))
            .finally(() => setLoading(false))
    }, [])

    const handleNestedChange = (path, value) => {
        setUpdatedFields((prev) => ({
            ...prev,
            [path]: value
        }))
    }

    const handleUpdate = async () => {
        const token = localStorage.getItem('proxy-token')
        const userId = localStorage.getItem('proxy-user_id')

        if (!token || !userId) return

        try {
            Object.entries(updatedFields).forEach(([key, value]) => {
                const keys = key.split('.')
                let obj = profile

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!obj[keys[i]]) obj[keys[i]] = {}
                    obj = obj[keys[i]]
                }

                obj[keys[keys.length - 1]] = value
            })

            if (Object.keys(updatedFields).length === 0) {
                console.log('No fields updated')
                return
            }

            setUpdating(true)
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, updates: profile }),
            }).finally(() => {
                setUpdating(false)
                router.push('/profile')
            })

        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const renderInputs = (sectionKey, data) =>
        Object.entries(data || {}).map(([key, val]) => (
            <div key={`${sectionKey}.${key}`}>
                <label className="text-md text-muted-foreground capitalize">
                    {sectionKey !== 'base' ? `${sectionKey} - ${key.replaceAll('_', ' ')}` : key}
                </label>
                <Input
                    defaultValue={Array.isArray(val) ? val.join(', ') : val}
                    onChange={(e) => handleNestedChange(
                        sectionKey === 'base' ? key : `${sectionKey}.${key}`,
                        e.target.value
                    )}
                    className="border-gray-300 text-black"
                />
            </div>
        ))

    return (
        <div className="min-h-screen py-10 px-4 flex justify-center items-center">
            <Card className="w-full max-w-5xl">
                <CardHeader>
                    <CardTitle className="text-xl">Update Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground">Loading profile...</p>
                    ) : (
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="bg-gray-100 w-full justify-start mb-6">
                                <TabsTrigger className="cursor-pointer" value="basic">Basic</TabsTrigger>
                                <TabsTrigger className="cursor-pointer" value="communication">Communication</TabsTrigger>
                                <TabsTrigger className="cursor-pointer" value="professional">Professional</TabsTrigger>
                                <TabsTrigger className="cursor-pointer" value="personal">Personal</TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="basic"
                            >
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputs('base', {
                                        name: profile?.name ?? '',
                                        bio: profile?.bio ?? '',
                                        location: profile?.location ?? '',
                                        age: profile?.age ?? '',
                                    })}
                                </form>
                            </TabsContent>

                            <TabsContent
                                value="communication"
                            >
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputs('communication_style', profile?.communication_style)}
                                </form>
                            </TabsContent>

                            <TabsContent
                                value="professional"
                            >
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputs('professional', profile?.professional)}
                                </form>
                            </TabsContent>

                            <TabsContent
                                value="personal"
                            >
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputs('personal', profile?.personal)}
                                </form>
                            </TabsContent>
                        </Tabs>
                    )}

                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpdate} className="w-full cursor-pointer" disabled={!profile || updating}>
                        {
                            updating ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                'Save Changes'
                            )
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
