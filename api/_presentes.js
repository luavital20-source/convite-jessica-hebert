/**
 * Tabela OFICIAL de presentes (fonte de verdade do preço).
 * O índice = data-i do card no index.html (ordem dos cards).
 * O valor cobrado no cartão vem SEMPRE daqui — nunca do navegador.
 * Ao mudar um preço, altere também o card correspondente no index.html.
 */

const PRESENTES = [
  { nome: 'Pra não dizer que não dei nada', valor: 50 },   // i=0
  { nome: '30% de chance de pegar o buquê', valor: 80 },   // i=1
  { nome: 'Rolo de macarrão caso o noivo não se comporte', valor: 120 },   // i=2
  { nome: 'Taxa pra noiva não jogar o buquê pra sua namorada', valor: 150 },   // i=3
  { nome: 'Para comprar a ração da Bella', valor: 200 },   // i=4
  { nome: 'Seja nosso convidado queridinho', valor: 250 },   // i=5
  { nome: 'Cobertor para a noiva que está sempre coberta de razão', valor: 300 },   // i=6
  { nome: 'Cota para perguntar quando o casal terá filho', valor: 350 },   // i=7
  { nome: 'Cota para a noiva não se atrasar', valor: 400 },   // i=8
  { nome: 'Ajuda para a aposentadoria dos noivos', valor: 500 },   // i=9
];

function buscarPresente(i) {
  const n = Number(i);
  if (!Number.isInteger(n) || n < 0 || n >= PRESENTES.length) return null;
  return { id: n, nome: PRESENTES[n].nome, valor: PRESENTES[n].valor };
}

module.exports = { PRESENTES, buscarPresente };
