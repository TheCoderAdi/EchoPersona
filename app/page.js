'use client'

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  MailCheck,
  Bot,
  Sparkles,
  ShoppingBag,
  MessageSquareHeart
} from "lucide-react"
import Link from "next/link"
import { ResizeNavbar } from "@/components/Navbar"
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react"

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <>
      <main className="relative flex flex-col items-center justify-center px-4 md:px-12 max-w-7xl mx-auto space-y-24">
        <div className="absolute -z-10 inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>

        <ResizeNavbar />

        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-4">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Persona
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Your AI Persona, Perfectly You
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-xl mx-auto">
            Draft messages. Mimic your tone. Reply while you&apos;re away.
          </p>
          <Button className="mt-8 text-lg px-8 py-6 shadow-xl animate-pulse cursor-pointer" size={"lg"}>
            <Link href="/auth">Get Started</Link>
          </Button>
        </motion.section>

        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          className="w-full text-center"
          id="features"
        >
          <h2 className="text-3xl font-semibold mb-8 text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
            {[
              {
                icon: <User size={40} className="text-orange-500" />,
                title: "Mimic Your Style",
                desc: "Tell the AI about your style, tone, and preferences.",
              },
              {
                icon: <Bot size={40} className="text-purple-500" />,
                title: "AI-Powered Replies",
                desc: "AI drafts responses in your style while you're away.",
              },
              {
                icon: <MailCheck size={40} className="text-green-500" />,
                title: "Automate Emails",
                desc: "Automatically draft and send emails in your tone.",
              },
              {
                icon: <MessageSquareHeart size={40} className="text-cyan-500" />,
                title: "Chat With Your Persona",
                desc: "Interact with your AI twin to help it better mimic you.",
              },
              {
                icon: <Sparkles size={40} className="text-yellow-500" />,
                title: "Summarize Messages",
                desc: "Get message summaries while you're away or busy.",
              },
            ].map((item, i) => (
              <Card key={i} className="cursor-pointer bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                  {item.icon}
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </motion.section>

        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="text-center w-full"
        >
          <h2 className="text-3xl font-semibold mb-6">Features & Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
            <Card className="bg-gradient-to-br from-purple-600 to-violet-800 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <Sparkles className="w-10 h-10" />
                <h3 className="text-xl font-bold">Mint Your Story as NFT</h3>
                <p className="text-white/80 text-sm">Permanently own your AI Persona on-chain using Moand.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <Bot className="w-10 h-10" />
                <h3 className="text-xl font-bold">Play a Maze Game on Monad</h3>
                <p className="text-white/80 text-sm">Engage with your AI persona through interactive games.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <MailCheck className="w-10 h-10" />
                <h3 className="text-xl font-bold">Auto Reply on Discord</h3>
                <p className="text-white/80 text-sm">
                  Let your AI handle Discord replies when you&apos;re away, using your tone.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <ShoppingBag className="w-10 h-10" />
                <h3 className="text-xl font-bold">Smart AI Shopping</h3>
                <p className="text-white/80 text-sm">
                  Describe what you want—AI finds the best product options for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="text-center w-full mt-10"
          id="pricing"
        >
          <h2 className="text-3xl font-semibold mb-6">Why Choose AI Personas?</h2>
          <div className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            Supercharge your digital presence with AI Personas — automate replies, run creative campaigns, shop smart, and craft your digital twin that never sleeps.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0 py-16 rounded-lg">
            {[
              {
                name: "Pro",
                subtitle: "For power users",
                price: "0.003 ETH",
                frequency: "/mo",
                badge: "RECOMMENDED",
                features: [
                  "Unlimited messages",
                  "Unlimited emails",
                  "**Multi-persona AI**",
                  "**NFT + Shopping Assistant**",
                  "**Early access to features**"
                ],
              },
              {
                name: "Premium",
                subtitle: "Best value",
                price: "0.002 ETH",
                frequency: "/mo",
                features: [
                  "500 messages/day",
                  "100 emails/day",
                  "**24/7 Replies**",
                  "**Maze Game**"
                ],
              },
              {
                name: "Basic",
                subtitle: "For starters",
                price: "Free",
                frequency: "",
                features: [
                  "100 messages/day",
                  "10 emails/day",
                  "**Replies during working hours**"
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md relative text-left flex flex-col gap-7"
              >
                {plan.badge && (
                  <span className="absolute top-4 right-4 bg-lime-300 text-xs font-semibold px-2 py-1 rounded">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{plan.name}</h3>
                  <p className="text-sm text-slate-500">{plan.subtitle}</p>
                </div>
                <div className="text-3xl font-bold text-indigo-600">
                  {plan.price}
                  <span className="text-sm font-medium text-slate-500">{plan.frequency}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span>✅</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: feature.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>


        </motion.section>

        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
          className="relative w-full mt-20"
        >
          <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 p-12 text-white text-center max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Build Your Digital Twin?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              Let your AI Persona work for you — creatively, authentically, tirelessly.
            </p>
            <Button size={"lg"} className="px-10 py-6 text-lg shadow-lg bg-white text-black hover:scale-105 hover:text-white transition">
              <Link href="/auth">Start for Free</Link>
            </Button>
          </div>
        </motion.section>

        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="text-center w-full mt-20"
          id="contact"
        >
          <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Have questions, suggestions, or collaboration ideas? Reach out to the creator behind EchoPersona.
          </p>
          <div className="flex justify-center items-center gap-6">
            <Link
              href="mailto:adityaswayamsiddha2003@gmail.com"
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
            >
              Say Hello 👋
            </Link>
            <Link
              href="https://github.com/TheCoderAdi"
              target="_blank"
              className="text-zinc-700 dark:text-white hover:text-indigo-500 transition"
            >
              <IconBrandGithub size={32} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/aditya-swayamsiddha-576ab426a/"
              target="_blank"
              className="text-zinc-700 dark:text-white hover:text-indigo-500 transition"
            >
              <IconBrandLinkedin size={32} />
            </Link>
          </div>
        </motion.section>
      </main>

      <footer className="w-full mt-16 border-t border-zinc-700 pt-10 pb-6 px-6 md:px-12 bg-zinc-900 text-zinc-400 flex flex-col items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            EchoPersona ~ AI-Powered Personas
          </h3>
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} Built with ❤️ Aditya
          </p>
        </div>
      </footer>
    </>
  )
}
