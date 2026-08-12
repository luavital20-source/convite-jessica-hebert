/**
 * POST /api/criar-pagamento
 *
 * Cria um link de Checkout Integrado no InfinitePay e devolve a URL para o
 * navegador redirecionar. Cai na conta identificada pela InfiniteTag — sem
 * token secreto.
 *
 * Entrada : { "i": 3 }     // índice do presente (data-i do card)
 * Saída   : { "url": "https://checkout.infinitepay.io/..." }
 *
 * Config opcional (Vercel -> Environment Variables):
 *   INFINITEPAY_HANDLE = jessicaehebert   (sem o "$"). Se ausente, usa o padrao.
 *
 * Requer que o merchant tenha o "Checkout Integrado" ATIVADO no app InfinitePay
 * (Vendas -> Checkout -> Configuracoes -> Habilitar Checkout Integrado).
 */

const { buscarPresente } = require('./_presentes.js');

const IP_API = 'https://api.checkout.infinitepay.io/links';
const HANDLE_PADRAO = 'jessicaehebert';

function origemDe(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

// InfinitePay só aceita ASCII na descrição — acentos e travessão (—) dão 400.
function soAscii(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  let corpo = req.body;
  if (typeof corpo === 'string') {
    try { corpo = JSON.parse(corpo); } catch { corpo = {}; }
  }

  const presente = buscarPresente(corpo && corpo.i);
  if (!presente) {
    return res.status(400).json({ erro: 'Presente não encontrado.' });
  }

  const origem = origemDe(req);
  const handle = process.env.INFINITEPAY_HANDLE || HANDLE_PADRAO;

  const payload = {
    handle,
    order_nsu: `${presente.id}${Date.now()}`,
    redirect_url: `${origem}/obrigado.html`,
    webhook_url: `${origem}/api/webhook`,
    items: [
      {
        quantity: 1,
        price: Math.round(Number(presente.valor) * 100),
        description: soAscii(`${presente.nome} - Casamento Jessica e Hebert`),
      },
    ],
  };

  try {
    const resposta = await fetch(IP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok || !dados.url) {
      console.error('[pagamento] InfinitePay recusou:', resposta.status, dados);
      return res.status(502).json({ erro: 'Não foi possível abrir o pagamento agora.' });
    }
    return res.status(200).json({ url: dados.url });
  } catch (err) {
    console.error('[pagamento] Falha ao chamar o InfinitePay:', err);
    return res.status(502).json({ erro: 'Não foi possível abrir o pagamento agora.' });
  }
};
