export async function onRequest() {
  return new Response(
    JSON.stringify({ 
      message: "This is a static response from Cloudflare Pages Functions",
      timestamp: new Date().toISOString()
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
} 