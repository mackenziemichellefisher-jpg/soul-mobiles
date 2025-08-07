"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
  received_at: string;
}

export default function SavedPage() {
  const router = useRouter();
  const [receivedGifts, setReceivedGifts] = useState<Gift[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load received gifts from localStorage
    const gifts = JSON.parse(localStorage.getItem('soulr_received_gifts') || '[]');
    setReceivedGifts(gifts.reverse()); // Show newest first
  }, []);

  const filteredGifts = filter === 'all' 
    ? receivedGifts 
    : receivedGifts.filter(gift => gift.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meme': return '��';
      case 'song': return '🎵';
      case 'quote': return '💭';
      case 'advice': return '💡';
      case 'url': return '🔗';
      default: return '✨';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `url('/nebula.jpg') center center / cover no-repeat fixed, #000`,
    }}>
      <div className="relative z-10 flex flex-col min-h-screen p-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl font-bold mb-4">Saved</h1>
          <p className="text-white/80">All the gifts you've received from the void</p>
        </div>

        {receivedGifts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-lg mb-4">No gifts received yet</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2 bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20">
                {['all', 'meme', 'song', 'quote', 'advice', 'url'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      filter === type
                        ? 'bg-white/30 text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {filteredGifts.map((gift, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getTypeIcon(gift.type)}</span>
                      <span className="text-sm font-medium text-white/80 capitalize">
                        {gift.type}
                      </span>
                    </div>
                    <span className="text-xs text-white/60">
                      {formatDate(gift.received_at)}
                    </span>
                  </div>
                  
                  {/* Show giver ID */}
                  <div className="mb-2">
                    <p className="text-xs text-white/60">From: {gift.created_by}</p>
                  </div>
                  
                  <p className="text-white/90 mb-2">{gift.content}</p>
                  {gift.url && (
                    <a
                      href={gift.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-300 hover:text-blue-200 underline"
                    >
                      {gift.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
