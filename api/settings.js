export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Return empty configuration object or basic required configurations
  return res.status(200).json({
    maintenance: false,
    allowedDevices: ["Test Device", "ipad 2", "ipad"]
  });
}
