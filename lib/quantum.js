// /lib/quantum.js
export async function getQuantumSelection(availableGifts) {
    try {
      const response = await fetch(process.env.QUANTUM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.QUANTUM_API_KEY}` // if needed
        },
        body: JSON.stringify({
          min: 0,
          max: availableGifts.length - 1,
          count: 1
        })
      });
      
      const quantumData = await response.json();
      return {
        selectedIndex: quantumData.data[0],
        quantumValue: quantumData.raw, // store for research
        gift: availableGifts[quantumData.data[0]]
      };
    } catch (error) {
      // Fallback to crypto.getRandomValues()
      const fallbackIndex = crypto.getRandomValues(new Uint32Array(1))[0] % availableGifts.length;
      return {
        selectedIndex: fallbackIndex,
        quantumValue: null,
        gift: availableGifts[fallbackIndex]
      };
    }
  }