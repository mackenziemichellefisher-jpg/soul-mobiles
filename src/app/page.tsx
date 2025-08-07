"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Gift {
  id: string;
  type: string;
  content?: string;
  url?: string;
  title?: string;
  link?: string;
  caption?: string;
  author?: string;
  created_by: string;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const starContainerRef = useRef<HTMLDivElement>(null);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve user ID
    let userId = localStorage.getItem('soulr_user_id');
    if (!userId) {
      userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('soulr_user_id', userId);
    }
    setCurrentUserId(userId);

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

    // Show gift popup after a short delay
    setTimeout(() => {
      fetchRandomGift(userId);
    }, 1000);
  }, []);

  const fetchRandomGift = async (userId: string) => {
    try {
      const response = await fetch(`/api/quantum-gift?uid=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.gift) {
        setCurrentGift(data.gift);
        setShowGiftPopup(true);
      }
    } catch (error) {
      console.error('Error fetching gift:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGift = async () => {
    if (!currentGift) return;
    
    try {
      await fetch('/api/save-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: currentGift.id,
          userId: currentUserId,
          gift: currentGift
        })
      });

      // Save to localStorage
      const savedGifts = JSON.parse(localStorage.getItem('soulr_received_gifts') || '[]');
      savedGifts.push({
        ...currentGift,
        received_at: new Date().toISOString()
      });
      localStorage.setItem('soulr_received_gifts', JSON.stringify(savedGifts));

      setShowGiftPopup(false);
      router.push('/saved');
    } catch (error) {
      console.error('Error saving gift:', error);
    }
  };

  const closeGiftPopup = () => {
    setShowGiftPopup(false);
  };

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
            onClick={() => router.push('/saved')}
            className="px-6 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            Saved
          </button>
        </div>
        
        <footer className="w-full flex justify-center items-center mt-12 mb-4">
          <img src="/file.svg" alt="file icon" className="h-30 w-30 opacity-80" />
        </footer>
      </div>

      {/* Gift Popup */}
      {showGiftPopup && currentGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md mx-4 border border-white/20 text-white">
            <h2 className="text-2xl font-bold mb-4">✨ You received a gift!</h2>
            
            {/* User IDs */}
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-white/60 mb-1">Your ID: {currentUserId}</p>
              <p className="text-xs text-white/60">From: {currentGift.created_by}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {currentGift.type === 'meme' && currentGift.url && (
                <img src={currentGift.url} alt="Meme" className="w-full rounded-lg" />
              )}
              
              {currentGift.type === 'song' && (
                <div>
                  <h3 className="font-medium"> {currentGift.title}</h3>
                  {currentGift.link && (
                    <a 
                      href={currentGift.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 text-sm"
                    >
                      Listen here
                    </a>
                  )}
                </div>
              )}
              
              {['advice', 'quote', 'recommend'].includes(currentGift.type) && currentGift.content && (
                <p className="text-lg">{currentGift.content}</p>
              )}
              
              {currentGift.type === 'link' && currentGift.url && (
                <div>
                  <a 
                    href={currentGift.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200"
                  >
                    {currentGift.caption || currentGift.url}
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={closeGiftPopup}
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                Close
              </button>
              <button
                onClick={saveGift}
                className="flex-1 px-4 py-2 rounded-lg bg-purple-500/80 hover:bg-purple-600/80 transition-colors"
              >
                Save to Saved
              </button>
            </div>
          </div>
        </div>
      )}

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
