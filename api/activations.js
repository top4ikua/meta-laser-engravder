import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Fetch your live counter from Upstash Redis
    const liveOrdersCount = await redis.get('campaign_activations') || 0;

    // 2. Build the exact campaign data structure the frontend is looping over
    const mockCampaigns = [
      {
        id: "meta-laser-1",
        name: "Meta Engraver Custom Elite",
        slug: "meta-engraver-custom-elite",
        description: "Premium laser engraving configuration template.",
        _count: {
          caseColors: 5,
          fonts: 12,
          icons: 24,
          orders: Number(liveOrdersCount) // <-- Your live Upstash data goes right here!
        }
      }
    ];

    // 3. Return it as a proper array so .map() works flawlessly
    return res.status(200).json(mockCampaigns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}
