'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@/components/ui/tabs';
import toast from 'react-hot-toast';

export default function StoryNFTPage() {
    const [prompt, setPrompt] = useState('');
    const [wallet, setWallet] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [activeTab, setActiveTab] = useState('create');

    const handleMint = async () => {
        setLoading(true);
        try {
            const user_id = localStorage.getItem('proxy-user_id');
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/story/mint`, {
                user_id,
                prompt,
                wallet
            });
            setResult(res.data);
            setNfts((prev) => [res.data.nft_metadata, ...prev]);
            setActiveTab('result');
            toast.success('NFT minted successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMintedNFTs = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/story/nfts/${localStorage.getItem('proxy-user_id')}`);
            setNfts(data.data || []);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };

    useEffect(() => {
        fetchMintedNFTs();
    }, []);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="w-full max-w-2xl"
            >
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="create" className="cursor-pointer">🧠 Create</TabsTrigger>
                    <TabsTrigger value="result" disabled={!result} className="cursor-pointer">
                        🎉 Minted NFT
                    </TabsTrigger>
                    <TabsTrigger value="list" className="cursor-pointer">📚 NFT List</TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>📖 Mint a Story NFT</CardTitle>
                            <CardDescription>
                                Turn your creative idea into an NFT on Monad Testnet
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Enter your story idea..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <Input
                                placeholder="Your wallet address (Monad Testnet)"
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleMint} disabled={loading} className="w-full cursor-pointer">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Mint Story NFT'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="result">
                    {result ? (
                        <Card className="border-green-500 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-green-600">✅ NFT Minted!</CardTitle>
                                <CardDescription>{result.message}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    <strong>Story Preview:</strong> {result.story_preview}
                                </p>
                                <a
                                    href={result.ipfs_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View on IPFS
                                </a>
                                <p className="text-sm text-muted-foreground">
                                    <strong>Tx Hash:</strong> {result.nft_metadata.tx_hash}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-center text-muted-foreground">No NFT minted yet.</p>
                    )}
                </TabsContent>

                <TabsContent value="list">
                    <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                        {nfts.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No NFTs minted yet.
                            </p>
                        ) : (
                            nfts.map((nft, index) => (
                                <Card key={index} className="border-gray-300 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-blue-600">NFT #{index + 1}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            <strong>Title:</strong> {nft.title}
                                        </p>
                                        <p>
                                            <strong>Recipient:</strong> {nft.recipient}
                                        </p>
                                        <p>
                                            <strong>Token URI:</strong>{' '}
                                            <a
                                                href={nft.token_uri}
                                                target="_blank"
                                                className="text-blue-600 underline"
                                            >
                                                {nft.token_uri}
                                            </a>
                                        </p>
                                        <p>
                                            <strong>Tx Hash:</strong> 0x{nft.tx_hash}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
