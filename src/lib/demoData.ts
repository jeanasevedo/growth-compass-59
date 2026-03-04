export interface CampaignData {
  campanha: string;
  investimento: number;
  receita: number;
  roas: number;
  cliques: number;
  conversoes: number;
}

export const demoData: CampaignData[] = [
  { campanha: "Brand - Search", investimento: 12500, receita: 87500, roas: 7.0, cliques: 4200, conversoes: 125 },
  { campanha: "Performance Max", investimento: 28000, receita: 112000, roas: 4.0, cliques: 9800, conversoes: 280 },
  { campanha: "Shopping - Catálogo", investimento: 18000, receita: 90000, roas: 5.0, cliques: 7200, conversoes: 200 },
  { campanha: "Display - Remarketing", investimento: 8500, receita: 34000, roas: 4.0, cliques: 15000, conversoes: 85 },
  { campanha: "YouTube - Awareness", investimento: 15000, receita: 37500, roas: 2.5, cliques: 22000, conversoes: 75 },
  { campanha: "Search - Genérico", investimento: 22000, receita: 66000, roas: 3.0, cliques: 8800, conversoes: 165 },
  { campanha: "Discovery - Prospecting", investimento: 10000, receita: 35000, roas: 3.5, cliques: 12000, conversoes: 100 },
  { campanha: "Shopping - Smart", investimento: 16000, receita: 80000, roas: 5.0, cliques: 6400, conversoes: 190 },
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
    const cliquesPorVenda = c.cliques / c.conversoes;
    const vendasPorClique = c.conversoes / c.cliques;

    return {
      ...c,
      novoInvestimento,
      novaReceita,
      vendasAdicionais,
      faturamentoAdicional,
      cliquesPorVenda,
      vendasPorClique,
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
  };
}
