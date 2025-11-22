import { NextResponse } from 'next/server';
import { createTopic } from '@/lib/hcs';

export async function POST() {
  try {
    const result = await createTopic();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in create-topic API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create topic' },
      { status: 500 }
    );
  }
}

