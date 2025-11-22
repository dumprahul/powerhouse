import { NextRequest, NextResponse } from 'next/server';
import { submitMessageToTopic } from '@/lib/hcs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, message } = body;

    if (!topicId || !message) {
      return NextResponse.json(
        { success: false, error: 'topicId and message are required' },
        { status: 400 }
      );
    }

    const result = await submitMessageToTopic(topicId, message);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in submit-message API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit message' },
      { status: 500 }
    );
  }
}

