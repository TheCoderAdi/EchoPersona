'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
    const [userId, setUserId] = useState(null)
    const [awayMode, setAwayMode] = useState(false)
    const [mode, setMode] = useState('Professional')
    const [awayLoading, setAwayLoading] = useState(false)
    const [modeLoading, setModeLoading] = useState(false)
    const [plan, setPlan] = useState('Basic')

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('proxy-token')
        const storedUserId = localStorage.getItem('proxy-user_id')

        if (!token || !storedUserId) return

        setUserId(storedUserId)

        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-plan/${storedUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json()),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-profile/${storedUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json()),
        ])
            .then(([planData, profileData]) => {
                setPlan(planData.plan)
                setAwayMode(profileData.away)
                setMode(profileData.mode.slice(0, 1).toUpperCase() + profileData.mode.slice(1))
            })
            .catch((err) => console.error('Error fetching data:', err))
    }, [router])

    const handleToggleAwayMode = () => {
        const newAway = !awayMode
        setAwayLoading(true)

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/set-away`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('proxy-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                away: newAway,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                setAwayMode(newAway)
                toast.success(
                    newAway
                        ? 'Away mode activated. Please set your bot token.'
                        : 'Away mode deactivated. You are back online.'
                )
            })
            .catch((err) => console.error('Error toggling away mode:', err))
            .finally(() => setAwayLoading(false))
    }

    const handleToggleMode = () => {
        const newMode = mode === 'Professional' ? 'fun' : 'professional'
        setModeLoading(true)

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/switch-mode`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('proxy-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                mode: newMode,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                setMode(newMode.charAt(0).toUpperCase() + newMode.slice(1))
            })
            .catch((err) => console.error('Error switching mode:', err))
            .finally(() => setModeLoading(false))
    }

    const handleLogout = () => {
        localStorage.removeItem('proxy-token')
        localStorage.removeItem('proxy-user_id')
        router.push('/auth')
    }

    const handleInitializeToken = () => {
        router.push('/token-initialize')
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-xl border-gray-300 bg-white rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground">Away Mode</Label>
                        {awayLoading ? (
                            <Loader2 className="animate-spin text-gray-600" />
                        ) : (
                            <Switch checked={awayMode} onCheckedChange={handleToggleAwayMode}
                                className="cursor-pointer"
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground">Mode</Label>
                        <Button
                            onClick={handleToggleMode}
                            disabled={modeLoading}
                            className="border-gray-600 text-white cursor-pointer"
                        >
                            {modeLoading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            ) : null}
                            {mode}
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground">Current Plan</Label>
                        <Button
                            onClick={() => router.push('/buy-plan')}
                            className="mt-2 text-sm cursor-pointer"
                            title="Upgrade Plan"
                        >
                            {plan}
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full text-white cursor-pointer" onClick={handleInitializeToken}
                    >
                        Initialize Bot
                    </Button>
                    <Button variant="destructive" className="w-full cursor-pointer" onClick={handleLogout}>
                        Log Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
