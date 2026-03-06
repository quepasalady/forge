import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId  = session.metadata?.user_id

      if (!userId) break

      // Récupère les infos de l'abonnement Stripe
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      await supabase.from('subscriptions').upsert({
        user_id:                userId,
        stripe_customer_id:     session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan:                   getPlanFromPriceId(subscription.items.data[0].price.id),
        status:                 subscription.status,
        trial_end:              subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({
          status:             subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          plan:               getPlanFromPriceId(subscription.items.data[0].price.id),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}

function getPlanFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_BASIC!]:   'basic',
    [process.env.STRIPE_PRICE_PRO!]:     'pro',
    [process.env.STRIPE_PRICE_PREMIUM!]: 'premium',
  }
  return map[priceId] ?? 'trial'
}
