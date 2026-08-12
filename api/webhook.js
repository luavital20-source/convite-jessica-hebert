/**
 * POST /api/webhook — notificações do InfinitePay. Responde 200 e registra log.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch { corpo = {}; } }
  corpo = corpo || {};
  res.status(200).json({ recebido: true });
  try { console.log('[webhook] InfinitePay', JSON.stringify(corpo).slice(0, 2000)); } catch (e) {}
};
