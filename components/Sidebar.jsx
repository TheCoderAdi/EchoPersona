'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home, MessageCircle, Mail, User, Settings, Menu, Coins,
    ShoppingBag, Gamepad
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { useState } from 'react'

const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Draft Email', href: '/draft-email', icon: Mail },
    { name: 'Mint NFT', href: '/story-nft', icon: Coins },
    { name: 'Maze Game', href: '/maze', icon: Gamepad },
    { name: 'Shopping', href: '/shop', icon: ShoppingBag },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-800 bg-white cursor-pointer">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#F5F5F5] text-gray-900">
                        <SheetHeader>
                            <SheetTitle className="text-lg text-gray-800">EchoPersona</SheetTitle>
                        </SheetHeader>
                        <nav className="mt-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center px-4 py-2 rounded-md ${pathname === link.href
                                        ? 'bg-black text-gray-300 font-medium'
                                        : 'text-gray-600 hover:bg-black/10'
                                        }`}
                                    onClick={() => setOpen(false)}
                                >
                                    <link.icon className="w-5 h-5 mr-3" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            <aside className="hidden md:flex flex-col w-64 h-screen fixed bg-[#F5F5F5] text-gray-900 border-r border-gray-300">
                <div className="h-16 flex items-center justify-center border-b border-gray-300">
                    <h1 className="text-2xl font-bold text-gray-800">
                        <Link href={"/dashboard"}>
                            EchoPersona
                        </Link>
                    </h1>
                </div>
                <nav className="flex-1 mt-6 space-y-2 px-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center px-4 py-2 rounded-md ${pathname === link.href
                                ? 'bg-black text-white font-medium'
                                : 'text-gray-600 hover:bg-black/10'
                                }`}
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    )
}
