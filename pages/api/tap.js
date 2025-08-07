import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { uid } = req.query

  if (!uid) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Get a random gift that wasn't created by the current user
    const { data: gift, error } = await supabase
      .from('gifts')
      .select('*')
      .neq('created_by', uid)
      .limit(1)
      .order('RANDOM()')
      .single()

    if (error) throw error

    if (!gift) {
      return res.status(404).json({ message: 'No gifts available' })
    }

    return res.status(200).json({ gift })
  } catch (error) {
    console.error('Error fetching random gift:', error)
    return res.status(500).json({ message: 'Error fetching gift' })
  }
}
