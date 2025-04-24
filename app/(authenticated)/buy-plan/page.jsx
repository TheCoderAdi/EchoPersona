'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ABI } from "@/constants/abi"
import { Loader2 } from 'lucide-react'

const CONTRACT_ADDRESS = '0x44D3C2F96128d1be60431cA0a062218003ffd100'

const plans = [
    { name: 'Basic', price: '0' },
    { name: 'Premium', price: '0.003' },
    { name: 'Pro', price: '0.005' },
]

const planToEnum = {
    'Basic': 0,
    'Premium': 1,
    'Pro': 2,
}

export default function BuyPlanPage() {
    const router = useRouter()
    const [walletAddress, setWalletAddress] = useState(null)
    const [provider, setProvider] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currentPlan, setCurrentPlan] = useState(null)

    const connectWallet = async () => {
        try {
            const coinbaseWallet = new CoinbaseWalletSDK({
                appName: "EchoPersona",
            })

            const ethereum = coinbaseWallet.makeWeb3Provider(
                'https://sepolia.base.org',
                84532
            )

            const ethersProvider = new ethers.BrowserProvider(ethereum)
            await ethereum.request({ method: 'eth_requestAccounts' })

            const signer = await ethersProvider.getSigner()
            const address = await signer.getAddress()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-plan/${localStorage.getItem('proxy-user_id')}`)

            if (response.ok) {
                const data = await response.json()
                setCurrentPlan(data.plan)
            }

            setProvider(ethersProvider)
            setWalletAddress(address)

            toast.success('Wallet connected!')
        } catch (err) {
            console.error(err)
            toast.error('Failed to connect wallet')
        }
    }

    const handleSubscribe = async (plan, price) => {
        if (!provider || !walletAddress) return toast.error('Wallet not connected')

        if (plan === "Basic") return toast.error('Basic plan is free. No need to subscribe.')
        if (currentPlan === plan) return toast.error('Already subscribed to this plan')
        setLoading(true)
        try {
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)

            const planEnum = planToEnum[plan]

            const tx = await contract.subscribe(planEnum, {
                value: ethers.parseEther(price),
            })

            await tx.wait()

            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('proxy-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: localStorage.getItem('proxy-user_id'),
                    wallet_address: walletAddress,
                    plan,
                    tx_hash: tx.hash,
                }),
            })

            toast.success(`Subscribed to ${plan}`)
            router.push('/settings')
        } catch (err) {
            console.error(err)
            toast.error('Transaction failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Choose a Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        {walletAddress ? (
                            <p className="text-sm">Connected Wallet: {walletAddress}</p>
                        ) : (
                            <Button onClick={connectWallet}
                                className="cursor-pointer"
                            >Connect Coinbase Wallet</Button>
                        )}
                    </div>

                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="flex justify-between items-center p-4 border rounded-lg"
                        >
                            <div>
                                <Label className="text-lg">{plan.name}</Label>
                                <p className="text-sm text-gray-500">{plan.price} ETH</p>
                            </div>

                            {currentPlan === plan.name ? (
                                <span className="text-green-600 font-semibold">Current Plan</span>
                            ) : (
                                <Button
                                    onClick={() => handleSubscribe(plan.name, plan.price)}
                                    disabled={loading || !walletAddress}
                                    className="cursor-pointer"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Subscribe'}
                                </Button>
                            )}
                        </div>
                    ))}

                </CardContent>
            </Card>
        </div>
    )
}
