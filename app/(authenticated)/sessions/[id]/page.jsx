'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

const SessionSummaryPage = () => {
    const { id } = useParams()
    const [session, setSession] = useState(null)
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('proxy-user_id')
            if (!userId || !id) return

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/away-messages/${userId}`)
                const data = await res.json()
                const targetSession = data.away_messages?.[id]

                if (!targetSession) return setLoading(false)

                setSession(targetSession)

                const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/away-summary`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        sessions: [targetSession],
                    }),
                })

                const summaryData = await summaryRes.json()
                setSummary(summaryData.summaries?.[0]?.summary || 'No summary available.')
            } catch (error) {
                console.error('Error loading session or summary:', error)
                setSummary('Something went wrong generating the summary.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) return <SkeletonLoader />
    if (!session) return (
        <main className="p-6">
            <h2 className="text-2xl font-bold mb-4">Session Summary</h2>
            <div className="bg-red-50 p-4 rounded text-red-800 w-1/2">
                No session found or session is empty.
            </div>
        </main>
    )

    return (
        <main className="p-6">
            <h2 className="text-2xl font-bold mb-4">Session Summary</h2>
            <Tabs defaultValue="original" className="w-full">
                <TabsList className="mb-2">
                    <TabsTrigger value="original" className="cursor-pointer">📝 Original Messages</TabsTrigger>
                    <TabsTrigger value="summary" className="cursor-pointer">🧠 Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="original">
                    <div className="space-y-1">
                        {session.messages.map((msg, idx) => {
                            const [sender, ...content] = msg.split(': ')
                            return (
                                <div key={idx} className="p-2 bg-gray-100 rounded">
                                    <span className="font-semibold text-blue-600">{sender}:</span> {content.join(': ')}
                                </div>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="summary">
                    <div className="bg-blue-50 p-4 rounded text-gray-800 whitespace-pre-wrap">
                        {summary}
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    )
}

export default SessionSummaryPage


const SkeletonLoader = () => {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3 bg-gray-300" />

            <div className="flex gap-4">
                <Skeleton className="h-8 w-32 bg-gray-300" />
                <Skeleton className="h-8 w-32 bg-gray-300" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-8 w-1/2 bg-gray-300" />
                <Skeleton className="h-8 w-1/2 bg-gray-300" />
                <Skeleton className="h-8 w-1/2 bg-gray-300" />
                <Skeleton className="h-8 w-1/2 bg-gray-300" />
            </div>

            <Skeleton className="h-32 w-full" />
        </div>
    )
}
