'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BackgroundEffect() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
            {/* ベースのグリッド背景 */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 255, 128, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 128, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                }}
            />

            {/* 浮遊する光の粒子 */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full blur-xl"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.3 + 0.1,
                    }}
                    animate={{
                        y: [0, Math.random() * -100],
                        x: [0, (Math.random() - 0.5) * 50],
                        opacity: [0.1, Math.random() * 0.5 + 0.2, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                    style={{
                        width: `${Math.random() * 200 + 50}px`,
                        height: `${Math.random() * 200 + 50}px`,
                        background: i % 2 === 0 ? 'rgba(0, 255, 128, 0.15)' : 'rgba(0, 100, 255, 0.15)',
                    }}
                />
            ))}

            {/* マウス追従するスポットライト */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 128, 0.07), transparent 40%)`,
                }}
                transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
            />

            {/* 走査線エフェクト */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        </div>
    );
}
