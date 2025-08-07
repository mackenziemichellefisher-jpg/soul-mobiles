import { useState } from 'react';

export default function GiftForm({ orbId, onGiftSubmitted, onClose }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          orbId: orbId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('');
        onGiftSubmitted(data.gift);
      } else {
        console.error('Failed to submit gift');
      }
    } catch (error) {
      console.error('Error submitting gift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">✨ Leave a Gift</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
              Your message for future visitors
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share something meaningful..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
              rows="4"
              maxLength="280"
              required
            />
            <p className="text-xs text-white/60 mt-1">
              {message.length}/280 characters
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Leaving Gift...' : 'Leave Gift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
