import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { orbId } = req.query
    
    if (!orbId) {
      return res.status(400).json({ message: 'Orb ID is required' })
    }

    try {
      const { data: gifts, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('orb_id', orbId)

      if (error) throw error

      if (gifts.length === 0) {
        return res.status(200).json({ 
          gift: { 
            id: 0, 
            message: "Be the first to leave a gift here.", 
            orb_id: orbId 
          } 
        })
      }

      const randomGift = gifts[Math.floor(Math.random() * gifts.length)]
      res.status(200).json({ gift: randomGift })
    } catch (error) {
      console.error('Error fetching gifts:', error)
      res.status(500).json({ message: 'Error fetching gifts' })
    }
  }
  
  else if (req.method === 'POST') {
    const { message, orbId, type, url, userId } = req.body
    
    if (!message || !orbId || !userId) {
      return res.status(400).json({ message: 'Message, orbId, and userId are required' })
    }

    try {
      const { data: gift, error } = await supabase
        .from('gifts')
        .insert([{
          message,
          orb_id: orbId,
          type: type || 'message',
          url: url || '',
          created_by: userId,
          created_at: new Date().toISOString()
        }])
        .single()

      if (error) throw error

      res.status(201).json({ gift })
    } catch (error) {
      console.error('Error creating gift:', error)
      res.status(500).json({ message: 'Error creating gift' })
    }
  }
  
  else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
