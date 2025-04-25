export async function onRequest({ request, env, next }) {
  console.log('Request path:', new URL(request.url).pathname);
  console.log('Environment variables available:', Object.keys(env).join(', '));
  
  try {
    return await next();
  } catch (err) {
    console.error('Error handling request:', err);
    return new Response('Server Error', { status: 500 });
  }
} 