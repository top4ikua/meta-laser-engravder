import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { campaignId, caseColor, icon, text, font } = req.body;
    if (!campaignId) return res.status(400).json({ error: 'Campaign ID required' });

    const orderId = `order:${Date.now()}`;
    
    // Save order details to Upstash and increment the counter
    await redis.set(orderId, JSON.stringify({ campaignId, caseColor, icon, text, font, createdAt: new Date() }));
    await redis.incr(`orders_count:${campaignId}`);

    return res.status(200).json({ success: true, orderId });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}