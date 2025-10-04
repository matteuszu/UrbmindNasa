import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9f006129/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-9f006129/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ error: "Nome, email e senha são obrigatórios" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      if (error.message.includes('already registered')) {
        return c.json({ error: "Este email já está cadastrado" }, 400);
      }
      return c.json({ error: "Erro ao criar conta. Tente novamente." }, 400);
    }

    console.log(`User created successfully: ${data.user.id}`);
    
    return c.json({
      user: {
        id: data.user.id,
        name: name,
        email: email
      }
    });

  } catch (error) {
    console.log(`Signup server error: ${error}`);
    return c.json({ error: "Erro interno do servidor" }, 500);
  }
});

// Get user profile endpoint (for session validation)
app.get("/make-server-9f006129/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Token de acesso não fornecido" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Profile validation error: ${error?.message}`);
      return c.json({ error: "Token inválido" }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        name: user.user_metadata?.name || 'Usuário',
        email: user.email
      }
    });

  } catch (error) {
    console.log(`Profile server error: ${error}`);
    return c.json({ error: "Erro interno do servidor" }, 500);
  }
});

Deno.serve(app.fetch);