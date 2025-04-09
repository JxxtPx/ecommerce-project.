import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  const { cartItems, orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/order/${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: orderId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ message: 'Stripe session failed' });
  }
};
