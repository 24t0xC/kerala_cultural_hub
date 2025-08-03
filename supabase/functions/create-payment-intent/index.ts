import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
    // Handle CORS preflight request
    if (req?.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        });
    }

    try {
        // Get the authorization token from the request headers
        const authHeader = req?.headers?.get('Authorization');
        if (!authHeader) {
            throw new Error('Missing Authorization header');
        }

        // Extract the token from the Authorization header
        const token = authHeader?.replace('Bearer ', '');

        // Create a Supabase client using the token from the logged-in user
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        });

        // Create a Stripe client
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        const stripe = new Stripe(stripeKey);

        // Get the request body
        const requestData = await req?.json();
        const { eventId, quantity, unitPrice, subtotal, serviceFee, total, customerName, customerEmail, customerPhone, attendees } = requestData;

        // Validate input data
        if (!eventId || !quantity || !customerName || !customerEmail) {
            throw new Error('Missing required order information');
        }
        
        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Invalid ticket quantity');
        }
        
        if (typeof total !== 'number' || total <= 0) {
            throw new Error('Invalid order total');
        }

        // Get user information from the JWT token if authenticated
        const { data: { user }, error: userError } = await supabase?.auth?.getUser(token);
        if (userError) {
            console.log('Error getting user:', userError?.message);
        }

        // Verify event exists and has available tickets
        const { data: event, error: eventError } = await supabase?.from('events')?.select('id, title, ticket_price, available_tickets, total_tickets, is_free')?.eq('id', eventId)?.eq('status', 'published')?.single();

        if (eventError || !event) {
            throw new Error('Event not found or not available for purchase');
        }

        if (!event.is_free && event.available_tickets < quantity) {
            throw new Error(`Only ${event.available_tickets} tickets available`);
        }

        // Create a Stripe payment intent
        const paymentIntent = await stripe?.paymentIntents?.create({
            amount: Math.round(total * 100), // Convert to cents
            currency: 'inr', // Indian Rupees
            automatic_payment_methods: { enabled: true },
            description: `Kerala Cultural Events - ${event.title}`,
            statement_descriptor: 'Kerala Events',
            metadata: {
                user_id: user?.id || 'anonymous',
                event_id: eventId,
                quantity: quantity?.toString(),
                customer_name: customerName,
                customer_email: customerEmail
            }
        });

        // Create order in the database
        const { data: order, error: orderError } = await supabase?.from('orders')?.insert({
                user_id: user?.id,
                event_id: eventId,
                stripe_payment_intent_id: paymentIntent?.id,
                quantity: quantity,
                unit_price: unitPrice,
                total_amount: total,
                service_fee: serviceFee || 0,
                order_status: 'pending',
                payment_status: 'pending',
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone || null
            })?.select()?.single();

        if (orderError) {
            throw new Error(`Error creating order: ${orderError.message}`);
        }

        // Create tickets for the order
        const ticketInserts = [];
        for (let i = 0; i < quantity; i++) {
            ticketInserts.push({
                order_id: order?.id,
                event_id: eventId,
                user_id: user?.id,
                status: 'active'
            });
        }

        const { error: ticketsError } = await supabase?.from('tickets')?.insert(ticketInserts);

        if (ticketsError) {
            throw new Error(`Error creating tickets: ${ticketsError.message}`);
        }

        // Return the payment intent client secret
        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            orderId: order.id
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 200
        });

    } catch (error) {
        console.log('Create payment intent error:', error?.message);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 400
        });
    }
});