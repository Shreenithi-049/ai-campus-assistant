export const sendMessageToAI = async (message, context) => {
  try {
    const response = await fetch('http://localhost:5000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.reply) {
      throw new Error('Empty response from AI');
    }

    return {
      success: true,
      response: data.reply,
    };
  } catch (error) {
    console.error('AI API error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
