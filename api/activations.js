import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Handle CORS policies
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Fetch your live database tracker counter from Upstash
    const liveOrdersCount = await redis.get('campaign_activations') || 0;

    // 2. The full 10-campaign database registry
    const realCampaigns = [
      { 
        id: "connect-ml", 
        name: "Connect ML", 
        slug: "connect-ml", 
        description: "Meta Connect ML activation", 
        _count: { caseColors: 3, fonts: 1, icons: 11, orders: Number(liveOrdersCount) } 
      },
      { 
        id: "connect-vip", 
        name: "Connect VIP", 
        slug: "connect-vip", 
        description: "Meta Connect VIP activation", 
        _count: { caseColors: 3, fonts: 2, icons: 11, orders: 0 } 
      },
      { 
        id: "meta-cannes-2026", 
        name: "Meta Cannes 2026", 
        slug: "meta-cannes-2026", 
        description: "Meta Engraver for Cannes Lion", 
        _count: { caseColors: 3, fonts: 2, icons: 9, orders: 0 } 
      },
      { 
        id: "meta-la", 
        name: "Meta LA", 
        slug: "meta-la", 
        description: "Meta Engraver for Los Angeles events", 
        _count: { caseColors: 3, fonts: 2, icons: 10, orders: 0 } 
      },
      { 
        id: "meta-nyc", 
        name: "Meta NYC", 
        slug: "meta-nyc", 
        description: "Meta Engraver for NYC", 
        _count: { caseColors: 3, fonts: 2, icons: 18, orders: 0 } 
      },
      { 
        id: "meta-party-la", 
        name: "Meta Party - LA", 
        slug: "meta-party-la", 
        description: "Meta Engraver for LA event", 
        _count: { caseColors: 3, fonts: 1, icons: 11, orders: 0 } 
      },
      { 
        id: "meta-vegas", 
        name: "Meta Vegas", 
        slug: "meta-vegas", 
        description: "Meta Engraver for Las Vegas events with Hyperion tracking", 
        _count: { caseColors: 3, fonts: 2, icons: 20, orders: 0 } 
      },
      { 
        id: "meta-waikiki", 
        name: "Meta Waikiki", 
        slug: "meta-waikiki", 
        description: "Meta Waikiki", 
        _count: { caseColors: 3, fonts: 2, icons: 9, orders: 0 } 
      },
      { 
        id: "multi-case-test", 
        name: "Multi Case Test", 
        slug: "multi-case-test", 
        description: "Multi Case Test", 
        _count: { caseColors: 6, fonts: 1, icons: 10, orders: 0 } 
      },
      { 
        id: "sis-test", 
        name: "SIS Test", 
        slug: "sis-test", 
        description: "December test of BBY SIS", 
        _count: { caseColors: 3, fonts: 2, icons: 11, orders: 0 } 
      }
    ];

    // 3. Extract path parameters handled by the vercel.json rewrites rule
    const { slug } = req.query;

    // If frontend wants data for a single specific campaign page
    if (slug) {
      const singleCampaign = realCampaigns.find(c => c.slug === slug);
      if (!singleCampaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      return res.status(200).json(singleCampaign);
    }

    // Default response: Return the complete dashboard array listing
    return res.status(200).json(realCampaigns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}
