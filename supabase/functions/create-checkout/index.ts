import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { checkRateLimit, sanitizeErrorMessage } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    // Parse request body to get selected price
    const { priceId } = await req.json();

    // Rate limiting: max 5 checkout sessions per minute
    if (!checkRateLimit(user.id, 5)) {
      return new Response(
        JSON.stringify({ error: "Muitas tentativas. Aguarde um momento." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    // Validate origin for redirect URLs
    const origin = req.headers.get("origin");
    if (!origin) {
      throw new Error("Invalid request origin");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2025-08-27.basil" 
    });

    // Verificar se o usuário já usou o trial
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('trial_used')
      .eq('user_id', user.id)
      .single();

    const hasUsedTrial = profile?.trial_used || false;

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Configurar session com ou sem trial baseado em trial_used
    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId || "price_monthly_1490",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/`,
      cancel_url: `${origin}/`,
    };

    // Só adicionar trial se o usuário NUNCA usou antes
    if (!hasUsedTrial) {
      sessionConfig.subscription_data = {
        trial_period_days: 3,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      };
      sessionConfig.payment_method_collection = 'if_required';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: sanitizeErrorMessage(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
