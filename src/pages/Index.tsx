import { useState, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderExecutivo } from "@/components/HeaderExecutivo";
import { MetricCards } from "@/components/MetricCards";
import { BarChartCampanhas } from "@/components/BarChartCampanhas";
import { DoughnutChart } from "@/components/DoughnutChart";
import { TabelaEstrategica } from "@/components/TabelaEstrategica";
import { ResumoEstrategico } from "@/components/ResumoEstrategico";
import { EmptyState } from "@/components/EmptyState";
import { BudgetOpportunity } from "@/components/BudgetOpportunity";
import {
  GeneralData,
  CampaignData,
  parseGeneralXLSX,
  parseAnaliseXLSX,
  computeMetrics,
  computeGeneralMetrics,
  enrichWithConversions,
  GENERAL_EXPORT_HEADERS,
  ANALISE_EXPORT_HEADERS,
} from "@/lib/demoData";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown, Upload, Download, ChevronDown, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

export default function Index() {
  // Two separate data sources
  const [generalData, setGeneralData] = useState<GeneralData[] | null>(null);
  const [analiseData, setAnaliseData] = useState<CampaignData[] | null>(null);
  const [budgetIncrease, setBudgetIncrease] = useState(30);
  const [clientName, setClientName] = useState("Empresa Exemplo S.A.");

  const generalFileRef = useRef<HTMLInputElement>(null);
  const analiseFileRef = useRef<HTMLInputElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleUploadGeneral = useCallback(() => {
    generalFileRef.current?.click();
  }, []);

  const handleUploadAnalise = useCallback(() => {
    analiseFileRef.current?.click();
  }, []);

  const handleGeneralFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      const parsed = parseGeneralXLSX(json);
      if (parsed.length > 0) setGeneralData(parsed);
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  }, []);

  const handleAnaliseFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      const parsed = parseAnaliseXLSX(json);
      if (parsed.length > 0) setAnaliseData(parsed);
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (!dashboardRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `AdsGrowth_${clientName.replace(/\s/g, "_")}_${budgetIncrease}pct.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(dashboardRef.current)
      .save();
  }, [clientName, budgetIncrease]);

  // Export General XLSX — mirrors exact template headers
  const handleExportGeneral = useCallback(() => {
    if (!generalData) return;
    const exportData = generalData.map((r) => {
      const obj: Record<string, any> = {};
      for (const h of GENERAL_EXPORT_HEADERS) {
        switch (h) {
          case "Desde": obj[h] = r.desde; break;
          case "Até": obj[h] = r.ate; break;
          case "Campanha": obj[h] = r.campanha; break;
          case "Título do anúncio patrocinado": obj[h] = r.tituloAnuncio; break;
          case "Código do anúncio": obj[h] = r.codigoAnuncio; break;
          case "Status": obj[h] = r.status; break;
          case "Impressões": obj[h] = r.impressoes; break;
          case "Cliques": obj[h] = r.cliques; break;
          default:
            if (h.includes("CPC")) obj[h] = r.cpc;
            else if (h.includes("CTR")) obj[h] = r.ctr;
            else if (h.includes("CVR")) obj[h] = r.cvr;
            else if (h.includes("Receita") && h.includes("diretas")) obj[h] = r.receitaVendasDiretas;
            else if (h.includes("Receita") && h.includes("indiretas")) obj[h] = r.receitaVendasIndiretas;
            else if (h.includes("Receita")) obj[h] = r.receita;
            else if (h.includes("Investimento")) obj[h] = r.investimento;
            else if (h.includes("ACOS")) obj[h] = r.acos;
            else if (h.includes("ROAS")) obj[h] = r.roas;
            else if (h.includes("Vendas diretas")) obj[h] = r.vendasDiretas;
            else if (h.includes("Vendas indiretas")) obj[h] = r.vendasIndiretas;
            else if (h.includes("Vendas por publicidade")) obj[h] = r.vendasPublicidade;
            break;
        }
      }
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData, { header: GENERAL_EXPORT_HEADERS });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados Gerais");
    XLSX.writeFile(wb, `modelo_ads_manager_dados_gerais_${clientName.replace(/\s/g, "_")}.xlsx`);
  }, [generalData, clientName]);

  // Export Análise XLSX — mirrors exact template headers
  const handleExportAnalise = useCallback(() => {
    if (!analiseData) return;
    const exportData = analiseData.map((c) => {
      const obj: Record<string, any> = {};
      for (const h of ANALISE_EXPORT_HEADERS) {
        switch (h) {
          case "ID Campaña": obj[h] = c.idCampanha; break;
          case "Nombre campaña": obj[h] = c.campanha; break;
          case "Status actual campaña": obj[h] = c.statusCampanha; break;
          case "Última modificación campaña": obj[h] = c.ultimaModificacao; break;
          case "Ingresos por PAds": obj[h] = c.receita; break;
          case "Inversión PAds": obj[h] = c.investimento; break;
          case "ACOS real": obj[h] = c.acosReal; break;
          case "Último Budget": obj[h] = c.orcamentoAtual; break;
          case "Budget promedio diario": obj[h] = c.budgetPromedioDiario; break;
          case "Budget sugerido": obj[h] = c.orcamentoSugerido; break;
          case "# Días topada": obj[h] = c.diasTopada; break;
          case "# Días con prints": obj[h] = c.diasComPrints; break;
          case "% Días topados": obj[h] = c.pctDiasTopados; break;
          case "Acos Target": obj[h] = c.acosTarget; break;
          case "ACOS Competencia": obj[h] = c.acosCompetencia; break;
          case "Desvío ACOS Target-Competencia": obj[h] = c.desvioAcos; break;
          case "Prints": obj[h] = c.prints; break;
          case "Clicks": obj[h] = c.cliques; break;
          case "LISB": obj[h] = c.lisb; break;
          case "LISR": obj[h] = c.lisr; break;
          case "% Won": obj[h] = c.percentWon; break;
          case "ROAS": obj[h] = c.roas; break;
          case "ROAS Objetivo": obj[h] = c.roasObjetivo; break;
        }
      }
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData, { header: ANALISE_EXPORT_HEADERS });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Análise Campanhas");
    XLSX.writeFile(wb, `Modelo_analise_campanhas_${clientName.replace(/\s/g, "_")}.xlsx`);
  }, [analiseData, clientName]);

  // Enrich análise data with conversions from general data
  const enrichedAnaliseData = useMemo(() => {
    if (!analiseData) return null;
    return enrichWithConversions(analiseData, generalData);
  }, [analiseData, generalData]);

  // Metrics from Análise data (feeds BudgetOpportunity + TabelaEstrategica)
  const analiseMetrics = useMemo(() => {
    if (!enrichedAnaliseData) return null;
    return computeMetrics(enrichedAnaliseData, budgetIncrease);
  }, [enrichedAnaliseData, budgetIncrease]);

  // Metrics from General data (feeds MetricCards, Charts)
  const generalMetrics = useMemo(() => {
    if (!generalData) return null;
    return computeGeneralMetrics(generalData);
  }, [generalData]);

  const hasAnyData = !!generalData || !!analiseData;

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file inputs */}
      <input ref={generalFileRef} type="file" accept=".xlsx,.xls" onChange={handleGeneralFile} className="hidden" />
      <input ref={analiseFileRef} type="file" accept=".xlsx,.xls" onChange={handleAnaliseFile} className="hidden" />

      <HeaderExecutivo
        clientName={clientName}
        budgetIncrease={budgetIncrease}
        onBudgetChange={setBudgetIncrease}
        onUploadGeneral={handleUploadGeneral}
        onUploadAnalise={handleUploadAnalise}
        onExportPdf={handleExportPdf}
        hasData={hasAnyData}
        hasGeneralData={!!generalData}
        hasAnaliseData={!!analiseData}
      />

      {!hasAnyData ? (
        <EmptyState onUploadGeneral={handleUploadGeneral} onUploadAnalise={handleUploadAnalise} />
      ) : (
        <div ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="resumo">Resumo Estratégico</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8 mt-0">
              {/* ========== VISÃO GERAL (General Data) ========== */}
              {generalMetrics && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Visão Geral da Conta</h2>
                    <div className="flex gap-2">
                      <Button onClick={handleUploadGeneral} variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Re-importar Dados Gerais
                      </Button>
                      <Button onClick={handleExportGeneral} variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar Modelo Geral
                      </Button>
                    </div>
                  </div>

                  <MetricCards
                    receitaAtual={generalMetrics.totalReceita}
                    receitaPotencial={generalMetrics.totalReceita * (1 + budgetIncrease / 100)}
                    crescimentoPct={budgetIncrease}
                    vendasAdicionais={Math.round(generalMetrics.totalVendas * (budgetIncrease / 100))}
                    investimentoAdicional={generalMetrics.totalInvestimento * (budgetIncrease / 100)}
                  />

                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    <div className="xl:col-span-3">
                      <BarChartCampanhas
                        campaigns={generalMetrics.campaignSummaries.map((c) => ({
                          campanha: c.campanha,
                          receita: c.receita,
                          novaReceita: c.receita * (1 + budgetIncrease / 100),
                          faturamentoAdicional: c.receita * (budgetIncrease / 100),
                        }))}
                      />
                    </div>
                    <div className="xl:col-span-2">
                    {(() => {
                      const sorted = [...generalMetrics.campaignSummaries]
                        .map((c) => ({ campanha: c.campanha, faturamentoAdicional: c.receita * (budgetIncrease / 100) }))
                        .sort((a, b) => b.faturamentoAdicional - a.faturamentoAdicional);
                      const totalFat = sorted.reduce((s, c) => s + c.faturamentoAdicional, 0);
                      const top3Fat = sorted.slice(0, 3).reduce((s, c) => s + c.faturamentoAdicional, 0);
                      const top3Pct = totalFat > 0 ? (top3Fat / totalFat) * 100 : 0;
                      return (
                        <DoughnutChart
                          campaigns={sorted}
                          top3Pct={top3Pct}
                          top3Names={sorted.slice(0, 3).map((c) => c.campanha)}
                        />
                      );
                    })()}
                    </div>
                  </div>
                </>
              )}

              {!generalMetrics && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-8 text-center space-y-3"
                >
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Importe o arquivo <span className="font-semibold text-foreground">modelo_ads_manager_dados_gerais</span> para visualizar a Visão Geral.
                  </p>
                  <Button onClick={handleUploadGeneral} variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Importar Dados Gerais
                  </Button>
                </motion.div>
              )}

              {/* ========== ANÁLISE (Análise Data) ========== */}
              {analiseMetrics && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Análise de Campanhas & Oportunidades</h2>
                    <div className="flex gap-2">
                      <Button onClick={handleUploadAnalise} variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Re-importar Análise
                      </Button>
                      <Button onClick={handleExportAnalise} variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar Modelo Oportunidades
                      </Button>
                    </div>
                  </div>

                  <BudgetOpportunity
                    campaigns={analiseMetrics.campaigns}
                    totalVendasRecuperaveis={analiseMetrics.totalVendasRecuperaveis}
                    totalReceitaRecuperavel={analiseMetrics.totalReceitaRecuperavel}
                    totalOrcamentoAdicional={analiseMetrics.totalOrcamentoAdicional}
                    totalImpressoesPerdidas={analiseMetrics.totalImpressoesPerdidas}
                    totalCliquesPerdidos={analiseMetrics.totalCliquesPerdidos}
                    roasMedio={analiseMetrics.roasMedio}
                    acosMedio={analiseMetrics.acosMedio}
                  />

                  <TabelaEstrategica
                    campaigns={analiseMetrics.campaigns}
                    roasMedio={analiseMetrics.roasMedio}
                    budgetIncrease={budgetIncrease}
                  />
                </>
              )}

              {!analiseMetrics && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-8 text-center space-y-3"
                >
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Importe o arquivo <span className="font-semibold text-foreground">Modelo_analise_campanhas</span> para visualizar Oportunidades e Análise Estratégica.
                  </p>
                  <Button onClick={handleUploadAnalise} variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Importar Análise de Campanhas
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="resumo" className="mt-0">
              {analiseMetrics ? (
                <ResumoEstrategico
                  totalReceitaAtual={analiseMetrics.totalReceitaAtual}
                  totalReceitaProjetada={analiseMetrics.totalReceitaProjetada}
                  crescimentoAbsoluto={analiseMetrics.crescimentoAbsoluto}
                  crescimentoPct={analiseMetrics.crescimentoPct}
                  novoRoasMedio={analiseMetrics.novoRoasMedio}
                  totalVendasAdicionais={analiseMetrics.totalVendasAdicionais}
                  investimentoAdicional={analiseMetrics.investimentoAdicional}
                  budgetIncrease={budgetIncrease}
                />
              ) : (
                <div className="glass-card p-8 text-center text-muted-foreground">
                  Importe o arquivo Modelo_analise_campanhas para gerar o Resumo Estratégico.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
