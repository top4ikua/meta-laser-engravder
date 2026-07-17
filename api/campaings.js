import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const campaigns = [
      'connect-ml', 'connect-vip', 'meta-cannes-2026', 'meta-la', 
      'meta-nyc', 'meta-party-la', 'meta-vegas', 'meta-waikiki', 
      'multi-case', 'sis-test'
    ];

    const updatedCampaigns = await Promise.all(
      campaigns.map(async (id) => {
        const liveOrders = await redis.get(`orders_count:${id}`);
        return {
          id: id,
          orders: Number(liveOrders) || 0
        };
      })
    );

    return res.status(200).json({ success: true, data: updatedCampaigns });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}