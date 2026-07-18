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
    // Fetch your live orders count from Upstash
    const liveOrdersCount = await redis.get('campaign_activations') || 0;

    // The complete 10-campaign array matching your friend's original dashboard
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
        _count: { caseColors: 3, fonts: 2, icons: 9, orders: 2 }
      },
      {
        id: "meta-la",
        name: "Meta LA",
        slug: "meta-la",
        description: "Meta Engraver for Los Angeles events",
        _count: { caseColors: 3, fonts: 2, icons: 10, orders: 6 }
      },
      {
        id: "meta-nyc",
        name: "Meta NYC",
        slug: "meta-nyc",
        description: "Meta Engraver for NYC",
        _count: { caseColors: 3, fonts: 2, icons: 18, orders: 2 }
      },
      {
        id: "meta-party-la",
        name: "Meta Party - LA",
        slug: "meta-party-la",
        description: "Meta Engraver for LA event",
        _count: { caseColors: 3, fonts: 1, icons: 11, orders: 1 }
      },
      {
        id: "meta-vegas",
        name: "Meta Vegas",
        slug: "meta-vegas",
        description: "Meta Engraver for Las Vegas events with Hyperion tracking",
        _count: { caseColors: 3, fonts: 2, icons: 20, orders: 5 }
      },
      {
        id: "meta-waikiki",
        name: "Meta Waikiki",
        slug: "meta-waikiki",
        description: "Meta Waikiki",
        _count: { caseColors: 3, fonts: 2, icons: 9, orders: 4 }
      },
      {
        id: "multi-case-test",
        name: "Multi Case Test",
        slug: "multi-case-test",
        description: "Multi Case Test",
        _count: { caseColors: 6, fonts: 1, icons: 10, orders: 1 }
      },
      {
        id: "sis-test",
        name: "SIS Test",
        slug: "sis-test",
        description: "December test of BBY SIS",
        _count: { caseColors: 3, fonts: 2, icons: 11, orders: 0 }
      }
    ];

    return res.status(200).json(realCampaigns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}
