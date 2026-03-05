export interface CampaignData {
  campanha: string;
  investimento: number;
  receita: number;
  roas: number;
  cliques: number;
  conversoes: number;
  // New fields for budget opportunity analysis
  prints: number; // impressions
  percentWon: number; // % impression share won (0-100)
  lisb: number; // Lost Impression Share by Budget (percentage 0-100)
  orcamentoAtual: number; // último budget / budget promedio
  orcamentoSugerido: number; // budget sugerido
  diasTopada: number; // days budget capped
  diasComPrints: number; // days with impressions
  pctDiasTopados: number; // % days capped
  roasObjetivo: number;
  acosReal: number;
  acosTarget: number;
}

export const demoData: CampaignData[] = [
  { campanha: "Brand - Search", investimento: 12500, receita: 87500, roas: 7.0, cliques: 4200, conversoes: 125, prints: 50000, percentWon: 85, lisb: 15, orcamentoAtual: 500, orcamentoSugerido: 650, diasTopada: 8, diasComPrints: 30, pctDiasTopados: 27, roasObjetivo: 6.0, acosReal: 14.3, acosTarget: 15 },
  { campanha: "Performance Max", investimento: 28000, receita: 112000, roas: 4.0, cliques: 9800, conversoes: 280, prints: 120000, percentWon: 62, lisb: 38, orcamentoAtual: 1000, orcamentoSugerido: 1500, diasTopada: 18, diasComPrints: 30, pctDiasTopados: 60, roasObjetivo: 4.5, acosReal: 25, acosTarget: 22 },
  { campanha: "Shopping - Catálogo", investimento: 18000, receita: 90000, roas: 5.0, cliques: 7200, conversoes: 200, prints: 80000, percentWon: 70, lisb: 30, orcamentoAtual: 600, orcamentoSugerido: 850, diasTopada: 12, diasComPrints: 30, pctDiasTopados: 40, roasObjetivo: 4.0, acosReal: 20, acosTarget: 25 },
  { campanha: "Display - Remarketing", investimento: 8500, receita: 34000, roas: 4.0, cliques: 15000, conversoes: 85, prints: 200000, percentWon: 45, lisb: 55, orcamentoAtual: 300, orcamentoSugerido: 550, diasTopada: 22, diasComPrints: 30, pctDiasTopados: 73, roasObjetivo: 5.0, acosReal: 25, acosTarget: 20 },
  { campanha: "YouTube - Awareness", investimento: 15000, receita: 37500, roas: 2.5, cliques: 22000, conversoes: 75, prints: 300000, percentWon: 55, lisb: 45, orcamentoAtual: 500, orcamentoSugerido: 700, diasTopada: 15, diasComPrints: 30, pctDiasTopados: 50, roasObjetivo: 3.0, acosReal: 40, acosTarget: 33 },
  { campanha: "Search - Genérico", investimento: 22000, receita: 66000, roas: 3.0, cliques: 8800, conversoes: 165, prints: 90000, percentWon: 75, lisb: 25, orcamentoAtual: 750, orcamentoSugerido: 950, diasTopada: 10, diasComPrints: 30, pctDiasTopados: 33, roasObjetivo: 3.5, acosReal: 33.3, acosTarget: 28 },
  { campanha: "Discovery - Prospecting", investimento: 10000, receita: 35000, roas: 3.5, cliques: 12000, conversoes: 100, prints: 150000, percentWon: 50, lisb: 50, orcamentoAtual: 350, orcamentoSugerido: 600, diasTopada: 20, diasComPrints: 30, pctDiasTopados: 67, roasObjetivo: 4.0, acosReal: 28.6, acosTarget: 25 },
  { campanha: "Shopping - Smart", investimento: 16000, receita: 80000, roas: 5.0, cliques: 6400, conversoes: 190, prints: 70000, percentWon: 80, lisb: 20, orcamentoAtual: 550, orcamentoSugerido: 700, diasTopada: 6, diasComPrints: 30, pctDiasTopados: 20, roasObjetivo: 4.5, acosReal: 20, acosTarget: 22 },
];

export function computeMetrics(data: CampaignData[], budgetIncrease: number) {
  const factor = 1 + budgetIncrease / 100;

  const totalReceitaAtual = data.reduce((s, c) => s + c.receita, 0);
  const totalInvestimentoAtual = data.reduce((s, c) => s + c.investimento, 0);
  const totalConversoesAtual = data.reduce((s, c) => s + c.conversoes, 0);

  const campaigns = data.map((c) => {
    const novoInvestimento = c.investimento * factor;
    const novaReceita = c.receita * factor;
    const vendasAdicionais = Math.round(c.conversoes * (factor - 1));
    const faturamentoAdicional = c.receita * (factor - 1);
    const cliquesPorVenda = c.conversoes > 0 ? c.cliques / c.conversoes : 0;
    const vendasPorClique = c.cliques > 0 ? c.conversoes / c.cliques : 0;

    // Budget opportunity per campaign
    // LISB = Lost Impression Share by Budget (percentage)
    // Lost impressions = current impressions * (LISB / (100 - LISB))
    // This gives us the absolute number of impressions lost due to budget
    const impressoesPerdidas = c.lisb > 0 && c.lisb < 100
      ? c.prints * (c.lisb / (100 - c.lisb))
      : 0;
    const ctr = c.prints > 0 ? c.cliques / c.prints : 0;
    const cliquesRecuperaveis = impressoesPerdidas * ctr;
    const vendasRecuperaveis = Math.round(cliquesRecuperaveis * vendasPorClique);
    const ticketMedio = c.conversoes > 0 ? c.receita / c.conversoes : 0;
    const receitaRecuperavel = vendasRecuperaveis * ticketMedio;
    const orcamentoAdicional = Math.max(0, c.orcamentoSugerido - c.orcamentoAtual);

    return {
      ...c,
      novoInvestimento,
      novaReceita,
      vendasAdicionais,
      faturamentoAdicional,
      cliquesPorVenda,
      vendasPorClique,
      impressoesPerdidas,
      ctr,
      cliquesRecuperaveis,
      vendasRecuperaveis,
      receitaRecuperavel,
      orcamentoAdicional,
      ticketMedio,
    };
  });

  const totalReceitaProjetada = campaigns.reduce((s, c) => s + c.novaReceita, 0);
  const totalInvestimentoProjetado = campaigns.reduce((s, c) => s + c.novoInvestimento, 0);
  const totalVendasAdicionais = campaigns.reduce((s, c) => s + c.vendasAdicionais, 0);
  const crescimentoAbsoluto = totalReceitaProjetada - totalReceitaAtual;
  const crescimentoPct = totalReceitaAtual > 0 ? ((totalReceitaProjetada - totalReceitaAtual) / totalReceitaAtual) * 100 : 0;
  const investimentoAdicional = totalInvestimentoProjetado - totalInvestimentoAtual;
  const novoRoasMedio = totalInvestimentoProjetado > 0 ? totalReceitaProjetada / totalInvestimentoProjetado : 0;
  const roasMedio = totalInvestimentoAtual > 0 ? totalReceitaAtual / totalInvestimentoAtual : 0;

  // Top 3 concentration
  const sorted = [...campaigns].sort((a, b) => b.faturamentoAdicional - a.faturamentoAdicional);
  const top3Growth = sorted.slice(0, 3).reduce((s, c) => s + c.faturamentoAdicional, 0);
  const top3Pct = crescimentoAbsoluto > 0 ? (top3Growth / crescimentoAbsoluto) * 100 : 0;
  const top3Names = sorted.slice(0, 3).map((c) => c.campanha);

  // Budget opportunity totals
  const totalVendasRecuperaveis = campaigns.reduce((s, c) => s + c.vendasRecuperaveis, 0);
  const totalReceitaRecuperavel = campaigns.reduce((s, c) => s + c.receitaRecuperavel, 0);
  const totalOrcamentoAdicional = campaigns.reduce((s, c) => s + c.orcamentoAdicional, 0);
  const totalImpressoesPerdidas = campaigns.reduce((s, c) => s + c.impressoesPerdidas, 0);

  return {
    totalReceitaAtual,
    totalReceitaProjetada,
    crescimentoAbsoluto,
    crescimentoPct,
    totalVendasAdicionais,
    investimentoAdicional,
    novoRoasMedio,
    roasMedio,
    totalConversoesAtual,
    totalInvestimentoAtual,
    campaigns,
    top3Pct,
    top3Names,
    totalVendasRecuperaveis,
    totalReceitaRecuperavel,
    totalOrcamentoAdicional,
    totalImpressoesPerdidas,
  };
}
