"use client";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const starContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = starContainerRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div');
      const size = (Math.random() * 2 + 1).toString();
      star.style.position = 'absolute';
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.borderRadius = '50%';
      star.style.background = 'white';
      star.style.opacity = (Math.random() * 0.7 + 0.3).toString();
      star.style.boxShadow = `0 0 ${(Math.random() * 8 + 2).toString()}px ${(Math.random() * 2 + 1).toString()}px white`;
      star.style.animation = `twinkle ${(2 + Math.random() * 4).toString()}s ease-in-out infinite`;
      container.appendChild(star);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `url('/nebula.jpg') center center / cover no-repeat fixed, #000`,
    }}>
      <div ref={starContainerRef} className="absolute inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%' }} />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center text-white flex-1 flex flex-col justify-center">
          <img src="/logo.png" alt="soulr.space logo" className="mx-auto mb-4 h-24 w-auto drop-shadow-lg logo" />
          <h1 className="text-3xl mb-8 drop-shadow-md">The Anti-Social Network for the Soul</h1>
          <div className="space-y-4">
            <p className="text-lg font-bold opacity-90 drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)' }}>Connect without followers, share without names.</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => router.push('/gift')}
            className="px-6 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            Gift Something
          </button>
          <button
            onClick={() => router.push('/archive')}
            className="px-6 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            Your Archive
          </button>
        </div>
        
        <footer className="w-full flex justify-center items-center mt-12 mb-4">
          <img src="/file.svg" alt="file icon" className="h-30 w-30 opacity-80" />
        </footer>
      </div>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .logo {
          width: 438px;
          height: 130px;
          object-fit: cover;
          filter: drop-shadow(0 0 15px #ff5bad33) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }
      `}</style>
    </div>
  );
}
