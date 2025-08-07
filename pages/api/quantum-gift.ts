import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'
import { getQuantumSelection } from '../../lib/quantum'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { uid } = req.query

  if (!uid || typeof uid !== 'string') {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Get all gifts that weren't created by the current user
    const { data: gifts, error } = await supabase
      .from('gifts')
      .select('*')
      .neq('created_by', uid)

    if (error) throw error

    if (!gifts || gifts.length === 0) {
      return res.status(404).json({ message: 'No gifts available' })
    }

    // Use quantum randomizer to select a gift
    const quantumResult = await getQuantumSelection(gifts)
    
    return res.status(200).json({ 
      gift: quantumResult.gift,
      quantumValue: quantumResult.quantumValue 
    })
  } catch (error) {
    console.error('Error fetching quantum gift:', error)
    return res.status(500).json({ message: 'Error fetching gift' })
  }
}
