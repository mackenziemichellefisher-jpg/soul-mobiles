import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Also save
