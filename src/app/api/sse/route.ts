// SSE endpoint removed — real-time updates are disabled to reduce server load.
// If you need to re-enable a push/update channel later, implement a lightweight websocket or push notification system.
export async function GET() {
    return new Response(JSON.stringify({ error: 'SSE disabled' }), { status: 410, headers: { 'Content-Type': 'application/json' } });
}