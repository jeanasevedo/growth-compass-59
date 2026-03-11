// ============================
// Interface: Dados Gerais (modelo_ads_manager_dados_gerais)
// ============================
export interface GeneralData {
  desde: string;
  ate: string;
  campanha: string;
  tituloAnuncio: string;
  codigoAnuncio: string;
  status: string;
  impressoes: number;
  cliques: number;
  cpc: number;
  ctr: number;
  cvr: number;
  receita: number;
  investimento: number;
  acos: number;
  roas: number;
  vendasDiretas: number;
  vendasIndiretas: number;
  vendasPublicidade: number;
  receitaVendasDiretas: number;
  receitaVendasIndiretas: number;
}

// ============================
// Interface: Análise de Campanhas (Modelo_analise_campanhas)
// ============================
export interface CampaignData {
  idCampanha: string;
  campanha: string;
  statusCampanha: string;
  ultimaModificacao: string;
  receita: number;
  investimento: number;
  acosReal: number;
  orcamentoAtual: number;
  budgetPromedioDiario: number;
  orcamentoSugerido: number;
  diasTopada: number;
  diasComPrints: number;
  pctDiasTopados: number;
  acosTarget: number;
  acosCompetencia: number;
  desvioAcos: string;
  prints: number;
  cliques: number;
  lisb: number;
  lisr: number;
  percentWon: number;
  roas: number;
  roasObjetivo: number;
  // Enriched from general data (or 0 if not available)
  conversoes: number;
}

// ============================
// Header maps: exact header → field
// ============================

const GENERAL_HEADERS: Record<string, keyof GeneralData> = {
  "Desde": "desde",
  "Até": "ate",
  "Campanha": "campanha",
  "Título do anúncio patrocinado": "tituloAnuncio",
  "Código do anúncio": "codigoAnuncio",
  "Status": "status",
  "Impressões": "impressoes",
  "Cliques": "cliques",
  "CPC\n(Custo por clique)": "cpc",
  "CPC (Custo por clique)": "cpc",
  "CTR\n(Click Through Rate)": "ctr",
  "CTR (Click Through Rate)": "ctr",
  "CVR\n(Conversion rate)": "cvr",
  "CVR (Conversion rate)": "cvr",
  "Receita\n(Moeda local)": "receita",
  "Receita (Moeda local)": "receita",
  "Investimento\n(Moeda local)": "investimento",
  "Investimento (Moeda local)": "investimento",
  "ACOS\n(Investimento / Receitas)": "acos",
  "ACOS (Investimento / Receitas)": "acos",
  "ROAS\n(Receitas / Investimento)": "roas",
  "ROAS (Receitas / Investimento)": "roas",
  "Vendas diretas": "vendasDiretas",
  "Vendas indiretas": "vendasIndiretas",
  "Vendas por publicidade\n(Diretas + Indiretas)": "vendasPublicidade",
  "Vendas por publicidade (Diretas + Indiretas)": "vendasPublicidade",
  "Receita por vendas diretas\n(Moeda Local)": "receitaVendasDiretas",
  "Receita por vendas diretas (Moeda Local)": "receitaVendasDiretas",
  "Receita por vendas indiretas": "receitaVendasIndiretas",
};

const ANALISE_HEADERS: Record<string, keyof CampaignData> = {
  "ID Campaña": "idCampanha",
  "Nombre campaña": "campanha",
  "Status actual campaña": "statusCampanha",
  "Última modificación campaña": "ultimaModificacao",
  "Ingresos por PAds": "receita",
  "Inversión PAds": "investimento",
  "ACOS real": "acosReal",
  "Último Budget": "orcamentoAtual",
  "Budget promedio diario": "budgetPromedioDiario",
  "Budget sugerido": "orcamentoSugerido",
  "# Días topada": "diasTopada",
  "# Días con prints": "diasComPrints",
  "% Días topados": "pctDiasTopados",
  "Acos Target": "acosTarget",
  "ACOS Competencia": "acosCompetencia",
  "Desvío ACOS Target-Competencia": "desvioAcos",
  "Prints": "prints",
  "Clicks": "cliques",
  "LISB": "lisb",
  "LISR": "lisr",
  "% Won": "percentWon",
  "ROAS": "roas",
  "ROAS Objetivo": "roasObjetivo",
};

// ============================
// Export header arrays (exact column order matching template)
// ============================

export const GENERAL_EXPORT_HEADERS = [
  "Desde",
  "Até",
  "Campanha",
  "Título do anúncio patrocinado",
  "Código do anúncio",
  "Status",
  "Impressões",
  "Cliques",
  "CPC\n(Custo por clique)",
  "CTR\n(Click Through Rate)",
  "CVR\n(Conversion rate)",
  "Receita\n(Moeda local)",
  "Investimento\n(Moeda local)",
  "ACOS\n(Investimento / Receitas)",
  "ROAS\n(Receitas / Investimento)",
  "Vendas diretas",
  "Vendas indiretas",
  "Vendas por publicidade\n(Diretas + Indiretas)",
  "Receita por vendas diretas\n(Moeda Local)",
  "Receita por vendas indiretas",
];

// Exact order from the uploaded template
export const ANALISE_EXPORT_HEADERS = [
  "ID Campaña",
  "Nombre campaña",
  "Status actual campaña",
  "Última modificación campaña",
  "Ingresos por PAds",
  "Inversión PAds",
  "ACOS real",
  "Último Budget",
  "Budget promedio diario",
  "Budget sugerido",
  "# Días topada",
  "# Días con prints",
  "% Días topados",
  "Acos Target",
  "ACOS Competencia",
  "Desvío ACOS Target-Competencia",
  "Prints",
  "Clicks",
  "LISB",
  "LISR",
  "% Won",
  "ROAS",
  "ROAS Objetivo",
];

// ============================
// Parsing helpers
// ============================

function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, " ")
    .trim();
}

function parseNumber(val: any): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  let str = String(val).trim();
  // Remove currency symbols (R$, $, €, etc.) and spaces
  str = str.replace(/[R$€£¥¤\s]/g, "");
  // Remove percentage
  str = str.replace(/%/g, "");

  if (!str) return 0;

  const lastComma = str.lastIndexOf(",");
  const lastDot = str.lastIndexOf(".");

  // Detect format: if comma comes after dot, comma is decimal (BR: 1.234,56)
  // If dot comes after comma, dot is decimal (US: 1,234.56)
  if (lastComma > lastDot) {
    // Brazilian format: 80.487,65
    str = str.replace(/\./g, ""); // remove thousands
    str = str.replace(",", "."); // comma → dot decimal
  } else {
    // US format: 80,487.65 or no separator
    str = str.replace(/,/g, ""); // remove thousands
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

function findHeader(rowKeys: string[], headerMap: Record<string, string>): Map<string, string> {
  const mapping = new Map<string, string>();
  const normalizedMap = new Map<string, [string, string]>(); // normalized → [originalKey, field]
  
  for (const [hk, field] of Object.entries(headerMap)) {
    normalizedMap.set(normalizeColumnName(hk), [hk, field]);
  }

  for (const rk of rowKeys) {
    // Exact match first
    if (headerMap[rk]) {
      mapping.set(rk, headerMap[rk]);
      continue;
    }
    // Normalized match
    const normRk = normalizeColumnName(rk);
    if (normalizedMap.has(normRk)) {
      mapping.set(rk, normalizedMap.get(normRk)![1]);
      continue;
    }
    // Starts-with match
    for (const [normKey, [, field]] of normalizedMap) {
      if (normRk.startsWith(normKey) || normKey.startsWith(normRk)) {
        mapping.set(rk, field);
        break;
      }
    }
    // Contains match (fallback)
    if (!mapping.has(rk)) {
      for (const [normKey, [, field]] of normalizedMap) {
        if (normRk.includes(normKey) || normKey.includes(normRk)) {
          mapping.set(rk, field);
          break;
        }
      }
    }
  }
  return mapping;
}

export function parseGeneralXLSX(rows: any[]): GeneralData[] {
  if (rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  const mapping = findHeader(keys, GENERAL_HEADERS as Record<string, string>);

  return rows.map((row) => {
    const obj: any = {
      desde: "", ate: "", campanha: "", tituloAnuncio: "", codigoAnuncio: "",
      status: "", impressoes: 0, cliques: 0, cpc: 0, ctr: 0, cvr: 0,
      receita: 0, investimento: 0, acos: 0, roas: 0, vendasDiretas: 0,
      vendasIndiretas: 0, vendasPublicidade: 0, receitaVendasDiretas: 0,
      receitaVendasIndiretas: 0,
    };
    for (const [colName, field] of mapping) {
      const val = row[colName];
      if (["desde", "ate", "campanha", "tituloAnuncio", "codigoAnuncio", "status"].includes(field)) {
        obj[field] = String(val ?? "");
      } else {
        obj[field] = parseNumber(val);
      }
    }
    return obj as GeneralData;
  });
}

export function parseAnaliseXLSX(rows: any[]): CampaignData[] {
  if (rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  const mapping = findHeader(keys, ANALISE_HEADERS as Record<string, string>);

  return rows.map((row) => {
    const obj: any = {
      idCampanha: "", campanha: "", statusCampanha: "", ultimaModificacao: "",
      receita: 0, investimento: 0, acosReal: 0, orcamentoAtual: 0,
      budgetPromedioDiario: 0, orcamentoSugerido: 0, diasTopada: 0,
      diasComPrints: 0, pctDiasTopados: 0, acosTarget: 0, acosCompetencia: 0,
      desvioAcos: "", prints: 0, cliques: 0, lisb: 0, lisr: 0, percentWon: 0,
      roas: 0, roasObjetivo: 0, conversoes: 0,
    };
    for (const [colName, field] of mapping) {
      const val = row[colName];
      if (["idCampanha", "campanha", "statusCampanha", "ultimaModificacao", "desvioAcos"].includes(field)) {
        obj[field] = String(val ?? "");
      } else {
        let num = parseNumber(val);
        // LISB, LISR, pctDiasTopados, acosReal, etc. come as percentages
        // If the value is already a decimal < 1 and the field expects a percentage, convert
        if (["lisb", "lisr", "percentWon", "pctDiasTopados", "acosReal", "acosTarget", "acosCompetencia"].includes(field)) {
          // XLSX may store 4.99% as 0.0499 or as 4.99
          if (typeof row[colName] === "number" && row[colName] > 0 && row[colName] < 1) {
            num = row[colName] * 100;
          }
        }
        obj[field] = num;
      }
    }
    // Compute ROAS if missing
    if (!obj.roas && obj.investimento > 0) {
      obj.roas = obj.receita / obj.investimento;
    }
    // Compute ACOS if missing
    if (!obj.acosReal && obj.receita > 0 && obj.investimento > 0) {
      obj.acosReal = (obj.investimento / obj.receita) * 100;
    }
    return obj as CampaignData;
  });
}

// ============================
// Enrich análise data with conversions from general data
// ============================
export function enrichWithConversions(
  analiseData: CampaignData[],
  generalData: GeneralData[] | null
): CampaignData[] {
  if (!generalData || generalData.length === 0) return analiseData;

  // Aggregate general data vendas by campaign name (normalized)
  const vendasByCampaign = new Map<string, number>();
  for (const row of generalData) {
    const key = normalizeColumnName(row.campanha);
    const existing = vendasByCampaign.get(key) || 0;
    vendasByCampaign.set(key, existing + row.vendasPublicidade);
  }

  return analiseData.map((c) => {
    const key = normalizeColumnName(c.campanha);
    const vendas = vendasByCampaign.get(key) || 0;
    return { ...c, conversoes: vendas };
  });
}

// ============================
// Compute metrics from Análise data
// ============================

export function computeMetrics(data: CampaignData[], budgetIncrease: number) {
  const factor = 1 + budgetIncrease / 100;

  const totalReceitaAtual = data.reduce((s, c) => s + c.receita, 0);
  const totalInvestimentoAtual = data.reduce((s, c) => s + c.investimento, 0);

  const campaigns = data.map((c) => {
    const novoInvestimento = c.investimento * factor;
    const novaReceita = c.receita * factor;
    const vendasAdicionais = Math.round(c.conversoes * (factor - 1));
    const faturamentoAdicional = c.receita * (factor - 1);
    const cliquesPorVenda = c.conversoes > 0 ? c.cliques / c.conversoes : 0;
    const vendasPorClique = c.cliques > 0 ? c.conversoes / c.cliques : 0;

    // LISB = Lost Impression Share by Budget (percentage)
    const impressoesPerdidas = c.lisb > 0 && c.lisb < 100
      ? c.prints * (c.lisb / (100 - c.lisb))
      : 0;
    const ctr = c.prints > 0 ? c.cliques / c.prints : 0;
    const cliquesPerdidos = impressoesPerdidas * ctr;
    const cliquesRecuperaveis = cliquesPerdidos;
    const vendasRecuperaveis = vendasPorClique > 0
      ? Math.round(cliquesRecuperaveis * vendasPorClique)
      : 0;
    const ticketMedio = c.conversoes > 0 ? c.receita / c.conversoes : 0;
    const receitaRecuperavel = vendasRecuperaveis * ticketMedio;
    const orcamentoAdicional = Math.max(0, c.orcamentoSugerido - c.orcamentoAtual);
    const budgetPacing = c.orcamentoSugerido > 0 ? (c.orcamentoAtual / c.orcamentoSugerido) * 100 : 100;

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
      cliquesPerdidos,
      cliquesRecuperaveis,
      vendasRecuperaveis,
      receitaRecuperavel,
      orcamentoAdicional,
      ticketMedio,
      budgetPacing,
    };
  });

  const totalReceitaProjetada = campaigns.reduce((s, c) => s + c.novaReceita, 0);
  const totalInvestimentoProjetado = campaigns.reduce((s, c) => s + c.novoInvestimento, 0);
  const totalVendasAdicionais = campaigns.reduce((s, c) => s + c.vendasAdicionais, 0);
  const totalConversoesAtual = data.reduce((s, c) => s + c.conversoes, 0);
  const crescimentoAbsoluto = totalReceitaProjetada - totalReceitaAtual;
  const crescimentoPct = totalReceitaAtual > 0 ? ((totalReceitaProjetada - totalReceitaAtual) / totalReceitaAtual) * 100 : 0;
  const investimentoAdicional = totalInvestimentoProjetado - totalInvestimentoAtual;
  const novoRoasMedio = totalInvestimentoProjetado > 0 ? totalReceitaProjetada / totalInvestimentoProjetado : 0;
  const roasMedio = totalInvestimentoAtual > 0 ? totalReceitaAtual / totalInvestimentoAtual : 0;
  const acosMedio = totalReceitaAtual > 0 ? (totalInvestimentoAtual / totalReceitaAtual) * 100 : 0;

  const sorted = [...campaigns].sort((a, b) => b.faturamentoAdicional - a.faturamentoAdicional);
  const top3Growth = sorted.slice(0, 3).reduce((s, c) => s + c.faturamentoAdicional, 0);
  const top3Pct = crescimentoAbsoluto > 0 ? (top3Growth / crescimentoAbsoluto) * 100 : 0;
  const top3Names = sorted.slice(0, 3).map((c) => c.campanha);

  const totalVendasRecuperaveis = campaigns.reduce((s, c) => s + c.vendasRecuperaveis, 0);
  const totalReceitaRecuperavel = campaigns.reduce((s, c) => s + c.receitaRecuperavel, 0);
  const totalOrcamentoAdicional = campaigns.reduce((s, c) => s + c.orcamentoAdicional, 0);
  const totalImpressoesPerdidas = campaigns.reduce((s, c) => s + c.impressoesPerdidas, 0);
  const totalCliquesPerdidos = campaigns.reduce((s, c) => s + c.cliquesPerdidos, 0);

  return {
    totalReceitaAtual,
    totalReceitaProjetada,
    crescimentoAbsoluto,
    crescimentoPct,
    totalVendasAdicionais,
    investimentoAdicional,
    novoRoasMedio,
    roasMedio,
    acosMedio,
    totalConversoesAtual,
    totalInvestimentoAtual,
    campaigns,
    top3Pct,
    top3Names,
    totalVendasRecuperaveis,
    totalReceitaRecuperavel,
    totalOrcamentoAdicional,
    totalImpressoesPerdidas,
    totalCliquesPerdidos,
  };
}

// ============================
// Compute general overview metrics
// ============================

export function computeGeneralMetrics(data: GeneralData[]) {
  const totalReceita = data.reduce((s, r) => s + r.receita, 0);
  const totalInvestimento = data.reduce((s, r) => s + r.investimento, 0);
  const totalCliques = data.reduce((s, r) => s + r.cliques, 0);
  const totalImpressoes = data.reduce((s, r) => s + r.impressoes, 0);
  const totalVendas = data.reduce((s, r) => s + r.vendasPublicidade, 0);
  const roasGeral = totalInvestimento > 0 ? totalReceita / totalInvestimento : 0;
  const acosGeral = totalReceita > 0 ? (totalInvestimento / totalReceita) * 100 : 0;
  const ctrGeral = totalImpressoes > 0 ? (totalCliques / totalImpressoes) * 100 : 0;

  // Group by campaign name
  const byCampaign = new Map<string, { receita: number; investimento: number; cliques: number; impressoes: number; vendas: number }>();
  for (const row of data) {
    const key = row.campanha || "Sem campanha";
    const existing = byCampaign.get(key) || { receita: 0, investimento: 0, cliques: 0, impressoes: 0, vendas: 0 };
    existing.receita += row.receita;
    existing.investimento += row.investimento;
    existing.cliques += row.cliques;
    existing.impressoes += row.impressoes;
    existing.vendas += row.vendasPublicidade;
    byCampaign.set(key, existing);
  }

  const campaignSummaries = Array.from(byCampaign.entries()).map(([name, v]) => ({
    campanha: name,
    ...v,
    roas: v.investimento > 0 ? v.receita / v.investimento : 0,
    acos: v.receita > 0 ? (v.investimento / v.receita) * 100 : 0,
  }));

  return {
    totalReceita,
    totalInvestimento,
    totalCliques,
    totalImpressoes,
    totalVendas,
    roasGeral,
    acosGeral,
    ctrGeral,
    campaignSummaries,
    totalRows: data.length,
  };
}
