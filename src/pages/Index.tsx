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
import { CampaignData, demoData, computeMetrics } from "@/lib/demoData";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";

export default function Index() {
  const [data, setData] = useState<CampaignData[] | null>(null);
  const [budgetIncrease, setBudgetIncrease] = useState(30);
  const [clientName, setClientName] = useState("Empresa Exemplo S.A.");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleDemo = useCallback(() => {
    setData(demoData);
  }, []);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const parseNumber = (val: any): number => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const str = String(val).replace(/[%$,]/g, "").replace(",", ".").trim();
    return Number(str) || 0;
  };

  const findCol = (row: any, ...keys: string[]): any => {
    for (const k of keys) {
      if (row[k] !== undefined) return row[k];
    }
    // Fuzzy match: check if any key in row contains one of our search terms
    const rowKeys = Object.keys(row);
    for (const k of keys) {
      const lower = k.toLowerCase();
      const found = rowKeys.find((rk) => rk.toLowerCase().includes(lower));
      if (found && row[found] !== undefined) return row[found];
    }
    return undefined;
  };

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);

      const rows = json.map((row: any) => {
        // Map columns - support both PT-BR and ES formats
        const campanha = String(
          findCol(row, "Nombre campaña", "Nombre campaña", "Campanha", "campanha", "Campaign") || ""
        ).trim();

        const receita = parseNumber(
          findCol(row, "Ingresos por PAds", "Receita\n(Moeda local)", "Receita (Moeda local)", "Receita", "receita")
        );
        const investimento = parseNumber(
          findCol(row, "Inversión PAds", "Investimento\n(Moeda local)", "Investimento (Moeda local)", "Investimento", "investimento")
        );
        const cliques = parseNumber(
          findCol(row, "Clicks", "Cliques", "cliques")
        );
        const prints = parseNumber(
          findCol(row, "Prints", "Impressões", "impressoes")
        );
        const percentWon = parseNumber(
          findCol(row, "% Won", "% Impressões ganhas")
        );
        const lisb = parseNumber(
          findCol(row, "LISB", "Lost Impression Share Budget", "Impressões perdidas por orçamento")
        );
        const orcamentoAtual = parseNumber(
          findCol(row, "Último Budget", "Budget promedio diario", "Orçamento atual")
        );
        const orcamentoSugerido = parseNumber(
          findCol(row, "Budget sugerido", "Orçamento recomendado")
        );
        const diasTopada = parseNumber(
          findCol(row, "# Días topada", "Dias topada")
        );
        const diasComPrints = parseNumber(
          findCol(row, "# Días con prints", "Dias com impressões")
        );
        const pctDiasTopados = parseNumber(
          findCol(row, "% Días topados", "% Dias topados")
        );
        const roasObjetivo = parseNumber(
          findCol(row, "ROAS Objetivo", "ROAS objetivo")
        );
        const acosReal = parseNumber(
          findCol(row, "ACOS real", "ACOS Real")
        );
        const acosTarget = parseNumber(
          findCol(row, "Acos Target", "ACOS Target")
        );

        // Conversions: from various sources
        const vendasDiretas = parseNumber(findCol(row, "Vendas diretas"));
        const vendasIndiretas = parseNumber(findCol(row, "Vendas indiretas"));
        const vendasPublicidade = parseNumber(
          findCol(row, "Vendas por publicidade\n(Diretas + Indiretas)", "Vendas por publicidade (Diretas + Indiretas)")
        );
        const conversoes = vendasPublicidade || (vendasDiretas + vendasIndiretas) ||
          parseNumber(findCol(row, "Conversões", "conversoes", "Conversoes")) || 0;

        return {
          campanha,
          investimento,
          receita,
          roas: 0,
          cliques,
          conversoes,
          prints,
          percentWon,
          lisb,
          orcamentoAtual,
          orcamentoSugerido,
          diasTopada,
          diasComPrints,
          pctDiasTopados,
          roasObjetivo,
          acosReal,
          acosTarget,
        } as CampaignData;
      });

      // Group by campaign name
      const grouped = new Map<string, CampaignData>();
      for (const r of rows) {
        if (!r.campanha) continue;
        const existing = grouped.get(r.campanha);
        if (existing) {
          existing.investimento += r.investimento;
          existing.receita += r.receita;
          existing.cliques += r.cliques;
          existing.conversoes += r.conversoes;
          existing.prints += r.prints;
          existing.diasTopada = Math.max(existing.diasTopada, r.diasTopada);
          existing.diasComPrints = Math.max(existing.diasComPrints, r.diasComPrints);
          // Keep the highest budget values
          existing.orcamentoAtual = Math.max(existing.orcamentoAtual, r.orcamentoAtual);
          existing.orcamentoSugerido = Math.max(existing.orcamentoSugerido, r.orcamentoSugerido);
          // Keep weighted % won (by prints)
          // For simplicity, take the average after grouping
          existing.pctDiasTopados = Math.max(existing.pctDiasTopados, r.pctDiasTopados);
          existing.percentWon = Math.max(existing.percentWon, r.percentWon);
          existing.lisb = Math.max(existing.lisb, r.lisb);
        } else {
          grouped.set(r.campanha, { ...r });
        }
      }

      const parsed = Array.from(grouped.values()).map((c) => ({
        ...c,
        roas: c.investimento > 0 ? c.receita / c.investimento : 0,
        pctDiasTopados: c.diasComPrints > 0 ? (c.diasTopada / c.diasComPrints) * 100 : c.pctDiasTopados,
      }));

      if (parsed.length > 0 && parsed[0].campanha) {
        setData(parsed);
      }
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

  const metrics = useMemo(() => {
    if (!data) return null;
    return computeMetrics(data, budgetIncrease);
  }, [data, budgetIncrease]);

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFile} className="hidden" />

      <HeaderExecutivo
        clientName={clientName}
        budgetIncrease={budgetIncrease}
        onBudgetChange={setBudgetIncrease}
        onUpload={handleUpload}
        onDemo={handleDemo}
        onExportPdf={handleExportPdf}
        hasData={!!data}
      />

      {!data || !metrics ? (
        <EmptyState onUpload={handleUpload} onDemo={handleDemo} />
      ) : (
        <div ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="resumo">Resumo Estratégico</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8 mt-0">
              <MetricCards
                receitaAtual={metrics.totalReceitaAtual}
                receitaPotencial={metrics.totalReceitaProjetada}
                crescimentoPct={metrics.crescimentoPct}
                vendasAdicionais={metrics.totalVendasAdicionais}
                investimentoAdicional={metrics.investimentoAdicional}
              />

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <div className="xl:col-span-3">
                  <BarChartCampanhas campaigns={metrics.campaigns} />
                </div>
                <div className="xl:col-span-2">
                  <DoughnutChart
                    campaigns={metrics.campaigns}
                    top3Pct={metrics.top3Pct}
                    top3Names={metrics.top3Names}
                  />
                </div>
              </div>

              <BudgetOpportunity
                campaigns={metrics.campaigns}
                totalVendasRecuperaveis={metrics.totalVendasRecuperaveis}
                totalReceitaRecuperavel={metrics.totalReceitaRecuperavel}
                totalOrcamentoAdicional={metrics.totalOrcamentoAdicional}
                totalImpressoesPerdidas={metrics.totalImpressoesPerdidas}
                roasMedio={metrics.roasMedio}
              />

              {/* Import button above strategic table */}
              <div className="flex justify-end">
                <Button
                  onClick={handleUpload}
                  variant="outline"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4 rotate-180" />
                  Importar Planilha
                </Button>
              </div>

              <TabelaEstrategica
                campaigns={metrics.campaigns}
                roasMedio={metrics.roasMedio}
                budgetIncrease={budgetIncrease}
              />
            </TabsContent>

            <TabsContent value="resumo" className="mt-0">
              <ResumoEstrategico
                totalReceitaAtual={metrics.totalReceitaAtual}
                totalReceitaProjetada={metrics.totalReceitaProjetada}
                crescimentoAbsoluto={metrics.crescimentoAbsoluto}
                crescimentoPct={metrics.crescimentoPct}
                novoRoasMedio={metrics.novoRoasMedio}
                totalVendasAdicionais={metrics.totalVendasAdicionais}
                investimentoAdicional={metrics.investimentoAdicional}
                budgetIncrease={budgetIncrease}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
