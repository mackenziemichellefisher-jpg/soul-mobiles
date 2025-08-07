export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Sample daily prompts - in production, these would come from a database
  const prompts = [
    "What would you like to explore today?",
    "What's on your mind right now?",
    "What brings you joy today?",
    "What are you grateful for?",
    "What would you tell your future self?",
    "What's something you've learned recently?",
    "What's your biggest dream?",
    "What makes you feel alive?",
    "What's something you'd like to remember?",
    "What's your favorite memory?"
  ];

  // Get today's prompt based on date
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const promptIndex = dayOfYear % prompts.length;
  
  res.status(200).json({ 
    prompt: prompts[promptIndex],
    date: today.toISOString().split('T')[0]
  });
}
