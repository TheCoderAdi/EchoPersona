'use client';

import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';


const MAX_STEPS = 5;
const STEP_SIZE = 40;

const directions = {
    up: { x: 0, y: -STEP_SIZE },
    down: { x: 0, y: STEP_SIZE },
    left: { x: -STEP_SIZE, y: 0 },
    right: { x: STEP_SIZE, y: 0 },
};

export default function EchoMazeGame() {
    const canvasRef = useRef(null);

    const [path, setPath] = useState([{ x: 200, y: 200 }]);
    const [pathDir, setPathDir] = useState([]);
    const [guessPath, setGuessPath] = useState([{ x: 200, y: 200 }]);
    const [guessDir, setGuessDir] = useState([]);

    const [isPlayerA, setIsPlayerA] = useState(false);
    const [duelId, setDuelId] = useState('');
    const [duelInput, setDuelInput] = useState('');
    const [message, setMessage] = useState('');
    const [winner, setWinner] = useState('');

    const [playMove] = useSound('/sounds/move.wav');

    const currentPath = isPlayerA ? path : guessPath;
    const setCurrentPath = isPlayerA ? setPath : setGuessPath;
    const setCurrentDir = isPlayerA ? setPathDir : setGuessDir;

    const move = (dir) => {
        if (currentPath.length - 1 >= MAX_STEPS) {
            pulseCanvas();
            toast.error("Max steps reached!");
            return;
        }

        const last = currentPath[currentPath.length - 1];
        const next = {
            x: last.x + directions[dir].x,
            y: last.y + directions[dir].y,
        };

        setCurrentPath([...currentPath, next]);
        setCurrentDir(prev => [...prev, dir]);
        playMove();
    };

    const drawPath = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const playerImg = new Image();
        playerImg.src = '/robo.png';

        playerImg.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const draw = (p, color) => {
                ctx.beginPath();
                ctx.moveTo(Math.round(p[0].x), Math.round(p[0].y));
                for (let i = 1; i < p.length; i++) {
                    ctx.lineTo(Math.round(p[i].x), Math.round(p[i].y));
                }
                ctx.strokeStyle = color;
                ctx.lineWidth = 5;
                ctx.stroke();
            };

            draw(path, 'green');
            draw(guessPath, 'blue');

            const p = isPlayerA ? path : guessPath;
            const last = p[p.length - 1];
            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const robotSize = 60;
            const offsetX = clamp(last.x - robotSize / 2, 0, canvas.width - robotSize);
            const offsetY = clamp(last.y - robotSize / 2, 0, canvas.height - robotSize);
            ctx.drawImage(playerImg, offsetX, offsetY, robotSize, robotSize);

        };
    };

    const pulseCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.classList.add('animate-pulse', 'border-red-600');
        setTimeout(() => canvas.classList.remove('animate-pulse', 'border-red-600'), 500);
    };

    useEffect(() => {
        drawPath();
    }, [path, guessPath]);

    useEffect(() => {
        if (winner) {
            confetti({ particleCount: 300, spread: 100, origin: { y: 0.7, x: 0.59 } });
        }
    }, [winner]);

    const createDuel = async () => {
        if (!pathDir.length) return toast.error("Please make a path first!");
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duel/create`, {
                path: pathDir,
            });
            const id = res.data.duel_id.toString();
            setDuelId(id);
            setMessage(`✅ Duel Created! Share ID: ${id}`);
            toast.success("Duel created!");
        } catch (err) {
            setMessage('❌ Failed to create duel.');
        }
    };

    const joinDuel = () => {
        if (!duelInput) return toast.error("Please enter a duel ID!");
        setDuelId(duelInput);
        setIsPlayerA(false);
        setMessage(`🚀 Joined Duel ID: ${duelInput}. Enter your guess!`);
    };

    const submitGuess = async () => {
        if (!duelId) return toast.error("Please enter a duel ID first!");
        if (!guessDir.length) return toast.error("Please make a guess first!");
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duel/submit`, {
                duel_id: parseInt(duelId),
                path: guessDir,
            });
            setMessage('✅ Guess submitted!');
        } catch (err) {
            setMessage('❌ Failed to submit guess.');
        }
    };

    const revealMaze = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duel/reveal`, {
                duel_id: parseInt(duelId),
                path: pathDir,
            });
            setMessage(`🧩 Maze revealed! TX: ${res.data.tx_hash}`);
            pollForWinner(duelId);
        } catch (err) {
            setMessage('❌ Failed to reveal maze.');
        }
    };

    const pollForWinner = (id) => {
        const intervalId = setInterval(async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duel/winner/${id}`);
                if (res.data.winner) {
                    setWinner(res.data.winner);
                    clearInterval(intervalId);
                }
            } catch { }
        }, 5000);
    };

    const reset = () => {
        setPath([{ x: 200, y: 200 }]);
        setGuessPath([{ x: 200, y: 200 }]);
        setPathDir([]);
        setGuessDir([]);
        setDuelId('');
        setDuelInput('');
        setMessage('');
        setIsPlayerA(true);
        setWinner('');
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-center">🎮 EchoMaze PvP</h1>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="cursor-pointer" size="sm">
                        <span className="text-sm">How to Play</span>
                        <Info className="w-4 h-4 mr-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>🧩 How to Play EchoMaze PvP</DialogTitle>
                        <DialogDescription>
                            <ul className="list-disc ml-6 mt-2 space-y-1 text-sm text-gray-800">
                                <li>Player A creates a secret 5-step maze path using arrow buttons.</li>
                                <li>Click "Create Duel" to generate a unique Duel ID.</li>
                                <li>Player B joins using the Duel ID and tries to guess the same path.</li>
                                <li>Player B submits their guess once done.</li>
                                <li>Player A clicks "Reveal Maze" to reveal their path.</li>
                                <li>The system checks if the paths match. If yes, Player B wins!</li>
                                <li>You can reset anytime to start a new duel.</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="relative w-[800px] h-[300px] border-4 border-slate-800 rounded-lg overflow-hidden shadow-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-800 opacity-95 z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2c2c2c_1px,_transparent_0)] [background-size:40px_40px] opacity-10 z-10" />
                <canvas ref={canvasRef} width={800} height={300} className="absolute z-20 w-full h-full" />

                <div className="absolute right-8 bottom-4 z-30 grid grid-cols-3 gap-2 p-2 bg-slate-900/70 backdrop-blur-md border border-slate-600 rounded-full shadow-lg">
                    <div />
                    <Button onClick={() => move('up')} size="icon" className="glow-button transition-all duration-200 cursor-pointer">
                        <ArrowUp className="w-4 h-4" />
                    </Button>
                    <div />
                    <Button onClick={() => move('left')} size="icon" className="glow-button transition-all duration-200 cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div />
                    <Button onClick={() => move('right')} size="icon" className="glow-button transition-all duration-200 cursor-pointer">
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                    <div />
                    <Button onClick={() => move('down')} size="icon" className="glow-button transition-all duration-200 cursor-pointer">
                        <ArrowDown className="w-4 h-4" />
                    </Button>
                    <div />
                </div>

            </div>

            <div className="text-center text-sm text-gray-800">
                Steps: {isPlayerA ? pathDir.length : guessDir.length}/{MAX_STEPS}
            </div>

            {!duelId && (
                <>
                    <Button className="cursor-pointer" onClick={() => {
                        setIsPlayerA(!isPlayerA)
                    }}
                    >
                        {
                            isPlayerA ? "You choosed A" : "Start as Player A"
                        }
                    </Button>
                    <div className="flex gap-2 mt-2">
                        <Input
                            className="border p-2 rounded w-full border-gray-300"
                            placeholder="Enter Duel ID"
                            value={duelInput}
                            onChange={(e) => setDuelInput(e.target.value)}
                        />
                        <Button onClick={joinDuel} className="cursor-pointer">Join as Player B</Button>
                    </div>
                </>
            )}

            <div className="space-x-2">
                {isPlayerA && pathDir.length === MAX_STEPS && !duelId && (
                    <Button className="cursor-pointer" onClick={createDuel}>Create Duel</Button>
                )}
                {!isPlayerA && guessDir.length === MAX_STEPS && (
                    <Button className="cursor-pointer" onClick={submitGuess}>Submit Guess</Button>
                )}
                {isPlayerA && duelId && pathDir.length === MAX_STEPS && (
                    <Button className="cursor-pointer" onClick={revealMaze}>Reveal Maze</Button>
                )}
                <Button className="cursor-pointer" variant="outline" onClick={reset}>Reset</Button>
            </div>
            {message && <div className="text-green-500">{message}</div>}
            {winner && <div className="text-blue-500 text-lg text-center">🏆 Winner: {winner}</div>}
        </div>
    );
}
