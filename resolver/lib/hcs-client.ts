/**
 * Client-side HCS service to interact with Hedera Consensus Service API routes
 */

const HCS_TOPIC_STORAGE_KEY = 'hcs_topic_id';

/**
 * Get or create a HCS topic ID
 * If topic doesn't exist in localStorage, create a new one
 */
export async function getOrCreateTopic(): Promise<string> {
  // Check if topic ID is already stored
  const storedTopicId = localStorage.getItem(HCS_TOPIC_STORAGE_KEY);
  if (storedTopicId) {
    console.log('Using existing HCS topic:', storedTopicId);
    return storedTopicId;
  }

  // Create a new topic
  try {
    console.log('Creating new HCS topic on Hedera network...');
    const response = await fetch('/api/hcs/create-topic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create topic');
    }

    const result = await response.json();
    if (result.success && result.data.topicId) {
      // Store topic ID in localStorage
      localStorage.setItem(HCS_TOPIC_STORAGE_KEY, result.data.topicId);
      console.log('✅ HCS topic created successfully:', result.data.topicId);
      console.log('📊 Topic Transaction:', result.data.transactionId);
      console.log('🌐 Topic Hashscan URL:', result.data.hashscanUrl);
      return result.data.topicId;
    } else {
      throw new Error('Topic ID not found in response');
    }
  } catch (error) {
    console.error('❌ Error getting or creating topic:', error);
    throw error;
  }
}

/**
 * Submit a message to HCS topic
 * @param message - The message content to submit
 */
export async function submitMessageToHCS(message: string): Promise<{
  transactionId: string;
  status: string;
  hashscanUrl: string;
  consensusTimestamp: any;
}> {
  try {
    // Get or create topic
    const topicId = await getOrCreateTopic();

    // Submit message to topic
    console.log('Submitting message to HCS topic:', topicId);
    const response = await fetch('/api/hcs/submit-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topicId,
        message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit message');
    }

    const result = await response.json();
    if (result.success && result.data) {
      console.log('✅ Message submitted to HCS successfully');
      console.log('📊 Transaction ID:', result.data.transactionId);
      console.log('⏱️ Consensus Timestamp:', result.data.consensusTimestamp);
      console.log('📊 Status:', result.data.status);
      console.log('🌐 Hashscan URL:', result.data.hashscanUrl);
      return result.data;
    } else {
      throw new Error('Failed to submit message - invalid response');
    }
  } catch (error) {
    console.error('Error submitting message to HCS:', error);
    throw error;
  }
}

