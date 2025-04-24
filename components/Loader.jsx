'use client'

import React from 'react'
import { Skeleton } from './ui/skeleton'

const Loader = () => {
    return (
        <div className="flex min-h-screen text-black">
            <Skeleton className="min-h-screen w-64" />

            <main className="flex-1 ml-0 p-6">
                <Skeleton className="h-10 w-64 mb-2" />
                <div className='grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 '>
                    <div className="md:col-span-2 p-4 border rounded-lg bg-white space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <div className="w-full h-[210px] flex justify-center items-center">
                            <Skeleton className="w-40 h-40 rounded-full" />
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-white space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-white space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <div className="flex flex-wrap gap-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-32" />
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-1 p-4 border rounded-lg bg-white space-y-4 max-h-[260px] overflow-y-auto">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center border p-3 rounded-md bg-gray-100">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border rounded-lg bg-white space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Loader
