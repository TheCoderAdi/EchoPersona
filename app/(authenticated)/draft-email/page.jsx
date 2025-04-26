"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import toast from "react-hot-toast"
import {
    Copy,
    Check,
    Loader2
} from "lucide-react"
import { IconBrandGmail } from "@tabler/icons-react"

export default function DraftEmailPage() {
    const [recipient, setRecipient] = useState("")
    const [subject, setSubject] = useState("")
    const [context, setContext] = useState("")
    const [draft, setDraft] = useState("")
    const [loading, setLoading] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [tabValue, setValue] = useState("input")

    const handleGenerate = async () => {

        if (!recipient || !subject || !context) {
            toast.error("Please fill in all fields.")
            return
        }

        setLoading(true)
        const token = localStorage.getItem("proxy-token")
        const user_id = localStorage.getItem("proxy-user_id")

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/draft-email`,
                {
                    user_id,
                    recipient,
                    subject,
                    context,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setDraft(res.data.draft)
            setValue("draft")
            toast.success("Draft generated successfully!")
        } catch (err) {
            console.error("Error generating draft", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopyToClipboard = () => {
        setIsCopied(true)
        const emailText = `To: ${recipient}\nSubject: ${subject}\n\n${draft}`;
        navigator.clipboard.writeText(emailText).then(
            () => {
                toast.success("Email copied to clipboard!");
            },
            (err) => {
                toast.error("Failed to copy text: ", err);
            }
        ).finally(() => {
            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        }
        )
    };


    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-1/2 shadow-lg bg-white border border-gray-300">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Draft Email with EchoPersona</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue="input"
                        className="w-full"
                        value={tabValue}
                        onValueChange={(value) => {
                            setValue(value);
                        }}
                    >
                        <TabsList className="flex space-x-4 mb-6 border-b border-gray-200">
                            <TabsTrigger value="input" className="text-sm font-medium text-gray-600 hover:text-grey-300 cursor-pointer">Input</TabsTrigger>
                            <TabsTrigger value="draft" className="text-sm font-medium text-gray-600 hover:text-grey-300 cursor-pointer"
                                disabled={!draft}
                            >Generated Draft</TabsTrigger>
                        </TabsList>

                        <TabsContent value="input">
                            <Input
                                placeholder="Recipient"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full border-gray-300 mb-4"
                            />
                            <Input
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full border-gray-300 mb-4"
                            />
                            <Textarea
                                placeholder="Context for the email..."
                                rows={5}
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full border-gray-300 mb-4"
                            />
                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full text-white cursor-pointer"
                            >
                                {
                                    loading ?
                                        <Loader2 className="animate-spin mr-2" /> :
                                        'Generate Draft'
                                }
                            </Button>
                        </TabsContent>

                        <TabsContent value="draft"
                            className="w-full relative"
                        >
                            {draft && (
                                <div className="p-4 bg-gray-100 border border-gray-300 rounded-md  max-h-96 overflow-y-auto">
                                    <h3 className="font-semibold text-lg">Generated Draft:</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>To:</strong> {recipient}</p>
                                        <p><strong>Subject:</strong> {subject}</p>
                                        <p><strong>Body:</strong></p>
                                        <pre className="whitespace-pre-wrap">{draft}</pre>
                                    </div>
                                    <Button
                                        onClick={handleCopyToClipboard}
                                        className="absolute top-4 right-4 bg-black text-white hover:bg-gray-800 cursor-pointer"
                                        disabled={!draft}
                                        aria-label="Copy to clipboard"
                                    >

                                        {isCopied ?
                                            <Check className="h-4 w-4" /> :
                                            <Copy className="h-4 w-4" />
                                        }

                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                                recipient
                                            )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`
                                            window.open(gmailUrl, "_blank")
                                        }}
                                        className="absolute top-4 right-16 text-white cursor-pointer"
                                        disabled={!draft}
                                        aria-label="Open in Gmail"
                                    >
                                        <IconBrandGmail className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
