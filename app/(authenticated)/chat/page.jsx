'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2, Mic, Send, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef(null);
    const recognitionRef = useRef(null);

    const handleSend = async (message = input) => {
        if (!message.trim()) return;

        setMessages(prev => [
            ...prev,
            { sender: 'user', content: message, timestamp: new Date() }
        ]);

        setInput('');
        setLoading(true);

        const user_id = localStorage.getItem('proxy-user_id');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-with-mimic`, {
                method: 'POST',
                body: JSON.stringify({
                    user_input: message,
                    user_id,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.body) {
                throw new Error('No response body');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            setMessages(prev => [
                ...prev,
                { sender: 'bot', content: '', timestamp: new Date() }
            ]);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });

                fullResponse += chunk;

                setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex]?.sender === 'bot') {
                        updated[lastIndex].content += chunk;
                    }
                    return updated;
                });
            }

        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', content: 'Error getting response.', timestamp: new Date() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 100);
    }, [messages]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    handleSend(transcript);
                };

                recognition.onerror = (event) => {
                    toast.error('Voice input error: ' + event.error);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            toast.error('Speech recognition not supported in this browser.');
            return;
        }

        if (!isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const getMessage = async () => {
        try {
            const userId = localStorage.getItem('proxy-user_id');
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-chat/${userId}`);

            const formattedMessages = data.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));

            setMessages(formattedMessages);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getMessage();
    }, [])

    return (
        <div className="flex flex-col min-h-screen">
            <header className="p-[.96rem] text-2xl font-bold text-center border-b border-gray-200 shadow">
                Chat with Your AI Persona 🤖
            </header>
            <ScrollArea className="flex-1 overflow-y-auto px-4 pt-6">
                <div className="flex flex-col space-y-4 pb-12">
                    {isLoading ? (
                        <SkeletonLoading />
                    ) :
                        <>
                            {
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            'max-w-md px-4 py-3 rounded-xl whitespace-pre-wrap shadow-sm transition-all',
                                            msg.sender === 'user'
                                                ? 'bg-black text-white self-end rounded-br-none'
                                                : 'bg-gray-100 text-gray-600 self-start rounded-bl-none'
                                        )}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <span className="text-xs text-gray-500 mt-1 block">
                                            {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            }
                        </>
                    }

                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" /> Typing...
                        </div>
                    )}
                    <div ref={scrollRef} className="absolute bottom-0 left-0 right-0 h-0" />
                </div>
            </ScrollArea>

            <footer className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-3">
                <div className="max-w-4xl mx-auto flex items-center gap-3 relative">
                    <button
                        onClick={handleMicClick}
                        className={cn(
                            'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-2 rounded-md cursor-pointer',
                            isListening && 'border-red-400 bg-red-50'
                        )}
                    >
                        {isListening ? <Square className="text-red-500" size={20}
                        /> : <Mic size={20} />}
                    </button>

                    {isListening && (
                        <div className="absolute left-16 flex items-center gap-2">
                            <svg className="h-6 w-6 text-red-400 animate-pulse" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.6" />
                            </svg>
                            <span className="text-red-500 text-sm font-medium animate-pulse">Listening...</span>
                        </div>
                    )}

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            !isListening &&
                            "Type a message or use voice..."
                        }
                        className="flex-1 bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    <button onClick={() => handleSend()} disabled={loading}
                        className='border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-2 rounded-md cursor-pointer'
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> :
                            <Send
                                size={20}
                            />}
                    </button>
                </div>
            </footer>
        </div>
    );
}

const SkeletonLoading = () => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 9 }).map((_, idx) => (
                <Skeleton key={idx} className={cn(`h-10 w-full rounded-xl bg-gray-300`,
                    idx % 2 === 0 ? 'self-end' : 'self-start',
                    idx % 2 === 0 ? 'bg-gray-300 w-1/2' : 'bg-gray-400 w-1/2'
                )} />
            ))}
        </div>
    );
}