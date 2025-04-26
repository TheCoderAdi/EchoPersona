'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ResponsivePie } from '@nivo/pie'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const COLORS = ['#4A90E2', '#50E3C2', '#FF6F61'];

const planColors = {
    Basic: 'bg-gray-100 text-gray-800',
    Premium: 'bg-yellow-100 text-yellow-800',
    Pro: 'bg-purple-100 text-purple-800',
}

const DashboardPage = () => {
    const [profile, setProfile] = useState(null)
    const [activityData, setActivityData] = useState([])
    const [plan, setPlan] = useState(null)
    const [sessions, setSessions] = useState([])
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('proxy-token')
        if (!token) return

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(({ user_id }) => {
                localStorage.setItem('proxy-user_id', user_id)

                const analyticsPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/${user_id}`).then((res) =>
                    res.json()
                )

                const profilePromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-profile/${user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((res) => res.json())

                const fetchSessiosn = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/away-messages/${user_id}`).then((res) => res.json())

                Promise.all([analyticsPromise, profilePromise, fetchSessiosn])
                    .then(([analyticsData, profileData, sessionData]) => {
                        setActivityData(analyticsData.data || [])
                        setPlan(analyticsData.plan || null)
                        setProfile(profileData)
                        setSessions(sessionData.away_messages || [])
                    })
                    .catch((err) => console.error('Error fetching analytics/profile:', err))
            })
            .catch((err) => console.error('Error fetching user:', err))
    }, [])

    return (
        <main className="min-h-screen text-gray-900 p-6">
            <h1 className="text-3xl font-bold mb-6">
                Welcome back, {profile?.name || 'User'} 👋
            </h1>

            <BentoGrid className="max-w-7xl mx-auto p-1">
                <BentoGridItem
                    title="Persona Summary"
                    description="Your assistant's current identity"
                    className="md:col-span-2"
                >
                    <div style={{ width: '100%', height: 235 }}>
                        {activityData.length > 0 && activityData.some((item) => item.count > 0) ? (
                            <ResponsivePie
                                data={activityData.map((item, index) => ({
                                    id: item.name,
                                    label: item.name,
                                    value: item.count,
                                    color: COLORS[index % COLORS.length],
                                }))}
                                margin={{ top: 20, bottom: 40 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                activeOuterRadiusOffset={8}
                                colors={{ datum: 'data.color' }}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                fill={[
                                    {
                                        match: {
                                            id: 'Chats'
                                        },
                                        id: 'dots'
                                    },
                                    {
                                        match: {
                                            id: 'Emails'
                                        },
                                        id: 'dots'
                                    },
                                    {
                                        match: {
                                            id: 'Switches'
                                        },
                                        id: 'lines'
                                    }
                                ]}
                                defs={[
                                    {
                                        id: 'dots',
                                        background: 'inherit',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        size: 4,
                                        padding: 1,
                                        stagger: true
                                    },
                                    {
                                        id: 'lines',
                                        background: 'inherit',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        rotation: -45,
                                        lineWidth: 6,
                                        spacing: 10
                                    }
                                ]}
                            />
                        ) : (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                <span className="pb-16 text-lg">No activity to show yet 📭</span>
                            </div>
                        )}
                    </div>
                </BentoGridItem>

                <BentoGridItem title="User Activity Overview" description="Visual breakdown of recent actions">
                    {plan && (
                        <div className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-6 ${planColors[plan]}`}>
                            💼 Subscribed Plan: {plan}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p>
                                <span className="font-semibold">Mode:</span> {profile?.mode || 'N/A'}
                            </p>
                            <p>
                                <span className="font-semibold">Style:</span> {profile?.communication_style?.tone || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-semibold">Away Status:</span> {profile?.away ? 'Away' : 'Not Away'}
                            </p>
                            <p>
                                <span className="font-semibold">Location:</span> {profile?.location || 'N/A'}
                            </p>
                        </div>
                    </div>
                </BentoGridItem>

                <BentoGridItem title="Quick Actions" description="Hop into creation or update flows">
                    <div className="flex flex-wrap gap-3 align-end">
                        <Button onClick={() => router.push('/chat')} className={"cursor-pointer"}>Chat Now</Button>
                        <Button onClick={() => router.push('/draft-email')} className={"cursor-pointer"}>Draft Email</Button>
                        <Button onClick={() => router.push('/profile/update')} className={"cursor-pointer"}>Update Profile</Button>
                        <Button onClick={() => router.push('/settings')} className={"cursor-pointer"}>
                            Settings
                        </Button>
                        <Button onClick={() => router.push('/token-initialize')} className={"cursor-pointer"}>
                            Initialize Bot
                        </Button>
                    </div>
                </BentoGridItem>

                <BentoGridItem title="Away Sessions" description="Review and summarize user messages while you were away" className={"overflow-y-auto"}>
                    {sessions.length === 0 ? (
                        <p className="text-sm text-gray-500">No sessions available 🚫</p>
                    ) : (
                        <div className="space-y-3 text-sm">
                            {sessions.map((session, idx) => (
                                <div key={idx} className="border p-3 rounded-md bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p><strong>Session {idx + 1}</strong></p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(session.start_time).toLocaleString()} → {new Date(session.end_time).toLocaleString()}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            if (plan === 'Basic') {
                                                return toast.info('Summarization is not available on Basic plan. Upgrade to Premium or Pro for this feature.')
                                            }
                                            router.push(`/sessions/${idx}`)
                                        }}
                                        className="cursor-pointer"
                                        disabled={plan === 'Basic'}
                                    >
                                        Summarize
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </BentoGridItem>


                <BentoGridItem title="Tips & Updates" description="Stay in the loop with improvements">
                    <div className="space-y-2 text-sm">
                        <p>💡 Tip: Use modes to instantly adapt your assistant’s behavior.</p>
                        <p>📢 Update: Discord bot integration improved! Test it via /token-initialize</p>
                        <p>✨ Coming soon: Memory Recall in Chat.</p>
                    </div>
                </BentoGridItem>
            </BentoGrid>
        </main>
    )
}

export default DashboardPage
