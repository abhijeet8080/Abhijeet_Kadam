import axios from 'axios';


export async function sendMessageToAI(message: string): Promise<string> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/chat`, { message });
    console.log("Frontend AI RESPONSE: ",response.data)
    return response.data.reply;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Chat API error:', errorMessage);
      throw new Error(errorMessage || 'Failed to get response from AI');
    } else {
      console.error('Error sending message to AI:', error);
      throw new Error('Failed to get response from AI. Please try again later.');
    }
  }
}

export const askAI = sendMessageToAI; 