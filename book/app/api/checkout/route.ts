import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // or whatever your typescript definitions are using, e.g. '2023-10-16' etc.
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse('Items are required', { status: 400 });
    }

    // In a real app, you would fetch the book details (like price) from your database
    // instead of trusting the client. For this MVP, we are creating dummy line items based on IDs
    // passed from the client, or we could pass the full item details.
    
    // We will assume `items` is an array of book IDs for now.
    // For Stripe checkout, we need line_items. We'll create a generic line item.
    // Replace this with your actual database lookup.
    
    const line_items = items.map((id: string) => ({
      quantity: 1,
      price_data: {
        currency: 'inr',
        product_data: {
          name: `Book Purchase ID: ${id}`, // Replace with actual book title
        },
        unit_amount: 5000, // ₹50
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/orders?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/browse?canceled=1`,
      metadata: {
        userId,
        bookIds: JSON.stringify(items)
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
