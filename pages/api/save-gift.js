import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { giftId, userId } = req.body

  if (!giftId || !userId) {
    return res.status(400).json({ message: 'Gift ID and User ID are required' })
  }

  try {
    // Save to Supabase
    const { error } = await supabase
      .from('received_gifts')
      .insert([{
        gift_id: giftId,
        user_id: userId,
        received_at: new Date().toISOString()
      }])

    if (error) throw error

    // Also save to localStorage for offline access
    const gift = req.body.gift
    const savedGifts = JSON.parse(localStorage.getItem('soulr_received_gifts') || '[]')
    savedGifts.push({
      ...gift,
      received_at: new Date().toISOString()
    })
    localStorage.setItem('soulr_received_gifts', JSON.stringify(savedGifts))

    return res.status(200).json({ message: 'Gift saved successfully' })
  } catch (error) {
    console.error('Error saving gift:', error)
    return res.status(500).json({ message: 'Error saving gift' })
  }
}
