import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const campaignTemplates = [
      { id: "connect-ml", name: "Connect ML", slug: "connect-ml", description: "Meta Connect ML activation", caseColors: 3, fonts: 1, icons: 11 },
      { id: "connect-vip", name: "Connect VIP", slug: "connect-vip", description: "Meta Connect VIP activation", caseColors: 3, fonts: 2, icons: 11 },
      { id: "meta-cannes-2026", name: "Meta Cannes 2026", slug: "meta-cannes-2026", description: "Meta Engraver for Cannes Lion", caseColors: 3, fonts: 2, icons: 9 },
      { id: "meta-la", name: "Meta LA", slug: "meta-la", description: "Meta Engraver for Los Angeles events", caseColors: 3, fonts: 2, icons: 10 },
      { id: "meta-nyc", name: "Meta NYC", slug: "meta-nyc", description: "Meta Engraver for NYC", caseColors: 3, fonts: 2, icons: 18 },
      { id: "meta-party-la", name: "Meta Party - LA", slug: "meta-party-la", description: "Meta Engraver for LA event", caseColors: 3, fonts: 1, icons: 11 },
      { id: "meta-vegas", name: "Meta Vegas", slug: "meta-vegas", description: "Meta Engraver for Las Vegas events with Hyperion tracking", caseColors: 3, fonts: 2, icons: 20 },
      { id: "meta-waikiki", name: "Meta Waikiki", slug: "meta-waikiki", description: "Meta Waikiki", caseColors: 3, fonts: 2, icons: 9 },
      { id: "multi-case-test", name: "Multi Case Test", slug: "multi-case-test", description: "Multi Case Test", caseColors: 6, fonts: 1, icons: 10 },
      { id: "sis-test", name: "SIS Test", slug: "sis-test", description: "December test of BBY SIS", caseColors: 3, fonts: 2, icons: 11 }
    ];

    const realCampaigns = await Promise.all(
      campaignTemplates.map(async (campaign) => {
        const storeOrders = await redis.get(`orders:${campaign.slug}`) || 0;
        return {
          id: campaign.id,
          name: campaign.name,
          slug: campaign.slug,
          description: campaign.description,
          _count: {
            caseColors: campaign.caseColors,
            fonts: campaign.fonts,
            icons: campaign.icons,
            orders: Number(storeOrders)
          }
        };
      })
    );

    const { slug } = req.query;

    if (slug) {
      const singleCampaign = realCampaigns.find(c => c.slug === slug);
      if (!singleCampaign) return res.status(404).json({ error: "Campaign not found" });
      return res.status(200).json(singleCampaign);
    }

    return res.status(200).json(realCampaigns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}
