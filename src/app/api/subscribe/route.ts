import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { plan, phone } = await req.json();

    // Mock Telebirr processing
    console.log(`Processing Telebirr payment for ${phone} - Plan: ${plan}`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully via Telebirr Mock',
      transactionId: `TB-${Math.floor(Math.random() * 1000000)}`,
      plan
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process Telebirr payment.' },
      { status: 500 }
    );
  }
}
