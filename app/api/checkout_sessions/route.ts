import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2025-01-27.acacia' as any, // fallback for newest types if needed
});

export async function POST(req: Request) {
  try {
    const { packageId, price, name } = await req.json();

    // Mock mode if no Stripe Key is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'dummy_key') {
      console.log('Mocking Stripe Checkout Session due to missing STRIPE_SECRET_KEY');
      return NextResponse.json({ url: '/success?mock=true&package=' + packageId });
    }

    // Create Checkout Sessions from body params.
    // In a real app, you would define Products in your Stripe Dashboard and pass the price_id here.
    // For this prototype, we use ad-hoc line items.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `NEXORA ${name}`,
              description: `แพ็กเกจ ${name} สำหรับใช้งานระบบยามอุบากอง AI`,
            },
            unit_amount: price * 100, // Stripe expects amounts in smallest currency unit (satang)
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // using one-time payment for MVP
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
