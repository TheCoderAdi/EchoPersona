'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Trash2, ClipboardPaste, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function TokenInitializePage() {
    const [botToken, setBotToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [showToken, setShowToken] = useState(false)
    const [storedTokens, setStoredTokens] = useState([])
    const [visibleIndexes, setVisibleIndexes] = useState([])

    const router = useRouter()

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('bot-tokens') || '[]')
        setStoredTokens(tokens)
    }, [])

    const handleInitialize = async () => {
        const token = localStorage.getItem('proxy-token')
        if (!token) {
            router.push('/login')
            return
        }

        setLoading(true)
        setMessage('')
        setMessageType('')

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/initialize-bot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('proxy-user_id'),
                bot_token: botToken,
            }),
        })

        const data = await res.json()
        setLoading(false)

        if (res.ok) {
            setMessageType('success')
            setMessage(data.message || 'Bot initialized successfully.')
            const tokens = JSON.parse(localStorage.getItem('bot-tokens') || '[]')
            const updatedTokens = [...new Set([botToken, ...tokens])]
            localStorage.setItem('bot-tokens', JSON.stringify(updatedTokens))
            setStoredTokens(updatedTokens)
        } else {
            setMessageType('error')
            setMessage(data.detail || 'Failed to initialize bot.')
        }
    }

    const handleStopBot = async (token) => {
        const auth = localStorage.getItem('proxy-token')
        if (!auth) {
            router.push('/login')
            return
        }

        setLoading(true)
        setMessage('')
        setMessageType('')

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stop-bot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`,
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('proxy-user_id'),
                bot_token: token,
            }),
        })

        const data = await res.json()
        setLoading(false)

        if (res.ok) {
            setMessageType('success')
            setMessage(data.message || 'Bot stopped successfully.')
        } else {
            setMessageType('error')
            setMessage(data.detail || 'Failed to stop bot.')
        }
    }

    const handleDelete = (index) => {
        const updated = storedTokens.filter((_, i) => i !== index)
        localStorage.setItem('bot-tokens', JSON.stringify(updated))
        setStoredTokens(updated)
    }

    const handlePaste = (token) => {
        setBotToken(token)
    }

    const toggleVisibility = (index) => {
        setVisibleIndexes(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    return (
        <div className="min-h-screen flex flex-col gap-8 items-center justify-center p-4">
            <Card className="max-w-md w-full bg-white shadow-lg rounded-lg border border-gray-300">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-900">
                        Initialize Your Bot
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    <div className="relative">
                        <Input
                            type={showToken ? 'text' : 'password'}
                            placeholder="Enter your bot token"
                            value={botToken}
                            onChange={(e) => setBotToken(e.target.value)}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                        >
                            {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <Button
                        onClick={handleInitialize}
                        disabled={loading}
                        className="w-full cursor-pointer"
                    >
                        {loading && <Loader2 className="animate-spin mr-2" />}
                        {loading ? 'Initializing...' : 'Initialize Bot'}
                    </Button>

                    {message && (
                        <p className={`text-center text-sm ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </CardContent>
            </Card>

            {storedTokens.length > 0 && (
                <Card className="w-full max-w-3xl border shadow">
                    <CardHeader>
                        <CardTitle className="text-xl">Previously Used Tokens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[300px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Token</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {storedTokens.map((token, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-mono">
                                                {visibleIndexes.includes(index) ? token : '••••••••••••••••'}
                                            </TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleVisibility(index)}
                                                    className="cursor-pointer"
                                                    title="Toggle visibility"
                                                >
                                                    {visibleIndexes.includes(index) ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handlePaste(token)}
                                                    className="cursor-pointer"
                                                    title="Copy to input"
                                                >
                                                    <ClipboardPaste size={18} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStopBot(token)}
                                                    className="cursor-pointer"
                                                    title="Stop bot"
                                                >
                                                    <StopCircle size={18} className="text-yellow-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(index)}
                                                    className="cursor-pointer"
                                                    title="Delete token"
                                                >
                                                    <Trash2 size={18} className="text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
