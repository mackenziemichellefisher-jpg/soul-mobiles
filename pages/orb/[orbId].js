"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import GiftForm from '../../components/GiftForm';
import { getOrCreateUserId, hasVisitedOrb, markOrbVisited } from '../../lib/user';

export default function OrbPage() {
  const router = useRouter();
  const { orbId } = router.query;
  
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [randomGift, setRandomGift] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    if (!orbId) return;
    
    const userId = getOrCreateUserId();
    const visited = hasVisitedOrb(orbId);
    setHasVisited(visited);

    // Fetch daily prompt
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => setDailyPrompt(data.prompt))
      .catch(err => console.error('Error fetching prompt:', err));

    // Fetch random gift
    fetch(`/api/gifts?orbId=${orbId}`)
      .then(res => res.json())
      .then(data => setRandomGift(data.gift))
      .catch(err => console.error('Error fetching gift:', err))
      .finally(() => setIsLoading(false));

    if (!visited) {
      markOrbVisited(orbId);
    }
  }, [orbId]);

  const handleGiftSubmitted = (gift) => {
    setRandomGift(gift);
    setShowGiftForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: `url('/nebula.jpg') center center / cover no-repeat fixed, #000`,
      }}>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Connecting to orb...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `url('/nebula.jpg') center center / cover no-repeat fixed, #000`,
    }}>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center text-white max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Orb #{orbId}</h1>
            {!hasVisited && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6 border border-white/20">
                <p className="text-sm opacity-80">✨ First time visiting this orb!</p>
              </div>
            )}
          </div>

          {dailyPrompt && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20">
              <h2 className="text-lg font-semibold mb-3">Today's Prompt</h2>
              <p className="text-white/90">{dailyPrompt}</p>
            </div>
          )}

          {randomGift && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20">
              <h2 className="text-lg font-semibold mb-3">�� A Gift for You</h2>
              <p className="text-white/90 mb-4">{randomGift.message}</p>
              <button
                onClick={() => setShowGiftForm(true)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                Leave Your Own Gift
              </button>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/gift')}
              className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              Gift Something
            </button>
            <button
              onClick={() => router.push('/archive')}
              className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              Your Archive
            </button>
          </div>
        </div>
      </div>

      {showGiftForm && (
        <GiftForm
          orbId={orbId}
          onGiftSubmitted={handleGiftSubmitted}
          onClose={() => setShowGiftForm(false)}
        />
      )}
    </div>
  );
} 