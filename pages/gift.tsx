"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  meme: { url: string; image: File | null };
  song: { title: string; link: string };
  advice: { content: string };
  quote: { content: string; author: string };
  recommend: { content: string };
  link: { url: string; caption: string };
}

export default function GiftPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('meme');
  const [isSharing, setIsSharing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    meme: { url: '', image: null },
    song: { title: '', link: '' },
    advice: { content: '' },
    quote: { content: '', author: '' },
    recommend: { content: '' },
    link: { url: '', caption: '' }
  });

  const categories = [
    { id: 'meme', label: 'Meme', icon: '😂' },
    { id: 'song', label: 'Song', icon: '��' },
    { id: 'advice', label: 'Advice', icon: '💡' },
    { id: 'quote', label: 'Quote', icon: '💭' },
    { id: 'recommend', label: 'Recommend', icon: '⭐' },
    { id: 'link', label: 'Link', icon: '🔗' }
  ];

  const updateFormData = (field: string, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory as keyof FormData],
        [field]: value
      }
    }));
  };

  const handleShareGift = async () => {
    setIsSharing(true);
    setShowAnimation(true);

    // Simulate gift sharing process
    setTimeout(() => {
      setShowAnimation(false);
      setIsSharing(false);
      router.push('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-pink-900/20">
      {/* Starfield */}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Gift Sharing Animation */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <div className="text-4xl mb-4 animate-pulse">🌟</div>
            <div className="text-2xl mb-4 animate-spin">💫</div>
            <p className="text-xl mb-4">Your gift is floating into the void...</p>
            <div className="space-x-4 text-3xl">
              <span className="animate-ping">✨</span>
              <span className="animate-ping" style={{ animationDelay: '0.5s' }}>🌟</span>
              <span className="animate-ping" style={{ animationDelay: '1s' }}>��</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 text-white/80 hover:text-white text-2xl transition-colors z-20"
        >
          ←
        </button>

        <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
          <div className="text-center text-white max-w-md w-full">
            <h1 className="text-3xl font-bold mb-8">✨ Gift Something</h1>
            
            {/* Category Wheel */}
            <div className="mb-8">
              <div className="flex space-x-4 px-4 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col items-center space-y-2 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-white/20 border-white/50 text-white scale-110 shadow-lg shadow-white/20'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Input Panel */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
              {selectedCategory === 'meme' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Meme URL or Upload
                  </label>
                  <input
                    type="url"
                    value={formData.meme.url}
                    onChange={(e) => updateFormData('url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <div className="text-center">
                    <span className="text-xs text-white/60">or</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateFormData('image', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                </div>
              )}

              {selectedCategory === 'song' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Song Title
                    </label>
                    <input
                      type="text"
                      value={formData.song.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="Song name..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Song Link (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.song.link}
                      onChange={(e) => updateFormData('link', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'advice' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Your Advice
                  </label>
                  <textarea
                    value={formData.advice.content}
                    onChange={(e) => updateFormData('content', e.target.value)}
                    placeholder="Share your wisdom..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-white/60 mt-1">
                    {formData.advice.content.length}/500 characters
                  </p>
                </div>
              )}

              {selectedCategory === 'quote' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Quote
                    </label>
                    <textarea
                      value={formData.quote.content}
                      onChange={(e) => updateFormData('content', e.target.value)}
                      placeholder="Share an inspiring quote..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                      rows={3}
                      maxLength={300}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Author (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.quote.author}
                      onChange={(e) => updateFormData('author', e.target.value)}
                      placeholder="Who said it?"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'recommend' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Your Recommendation
                  </label>
                  <textarea
                    value={formData.recommend.content}
                    onChange={(e) => updateFormData('content', e.target.value)}
                    placeholder="What would you recommend to someone?"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-white/60 mt-1">
                    {formData.recommend.content.length}/500 characters
                  </p>
                </div>
              )}

              {selectedCategory === 'link' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={formData.link.url}
                      onChange={(e) => updateFormData('url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Caption (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.link.caption}
                      onChange={(e) => updateFormData('caption', e.target.value)}
                      placeholder="Why should someone visit this?"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleShareGift}
              disabled={isSharing}
              className="w-full py-4 px-6 rounded-xl text-lg font-semibold bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSharing ? 'Sending to the Void...' : 'Send Gift into the Void'}
            </button>
            
            <p className="text-xs text-white/60 mt-2 text-center">
              It will be randomly assigned to someone who enters Soulr space.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
