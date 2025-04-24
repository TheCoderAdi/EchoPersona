'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopPage() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setLoadingProducts(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shooping`, {
                prompt: query,
                user_id: localStorage.getItem('proxy-user_id')
            });
            setProducts(res.data.data.products);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingProducts(false);
        }
    };

    const handleClearSearch = () => {
        setQuery('');
        setProducts([]);
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">🛍️ AI Shopping Assistant</h1>

            <div className="flex space-x-4 mb-4">
                <Input
                    placeholder="Find me sneakers under ₹2000..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-4 w-full"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    disabled={loading}
                />
                <Button onClick={handleSearch} disabled={loading} className="w-auto cursor-pointer">
                    {loading ? <Loader2 className="animate-spin" /> : 'Search'}
                </Button>
                {query && (
                    <Button onClick={handleClearSearch} variant="outline" className="w-auto cursor-pointer">
                        Clear Search
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {loadingProducts ? (
                    Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton key={index} className="w-full h-[300px] rounded-lg bg-gray-300" />
                        ))
                ) : (
                    products && products.length > 0 ? (
                        products.map((product) => (
                            <Card key={product.id} className="transition-transform transform hover:scale-101 hover:shadow-lg rounded-lg flex flex-col items-center justify-around">
                                <CardContent className="p-4 w-full">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-40 object-contain rounded mb-2"
                                    />
                                    <h2 className="font-semibold text-lg">{product.name}</h2>
                                    <Button
                                        className="w-full mt-4 cursor-pointer text-white"
                                    >
                                        <a href={`${product.buy_link}`} target="_blank" rel="noopener noreferrer">
                                            Buy Now
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-600">No products found for your search</p>
                    )
                )}
            </div>
        </div>
    );
}
