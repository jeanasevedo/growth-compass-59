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

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);

      const rows = json.map((row: any) => {
        const receita = Number(row["Receita\n(Moeda local)"] || row["Receita (Moeda local)"] || row["Receita"] || row["receita"] || 0);
        const investimento = Number(row["Investimento\n(Moeda local)"] || row["Investimento (Moeda local)"] || row["Investimento"] || row["investimento"] || 0);
        const cliques = Number(row["Cliques"] || row["cliques"] || 0);
        const vendasDiretas = Number(row["Vendas diretas"] || 0);
        const vendasIndiretas = Number(row["Vendas indiretas"] || 0);
        const vendasPublicidade = Number(row["Vendas por publicidade\n(Diretas + Indiretas)"] || row["Vendas por publicidade (Diretas + Indiretas)"] || 0);
        const conversoes = vendasPublicidade || (vendasDiretas + vendasIndiretas) || Number(row["Conversões"] || row["conversoes"] || row["Conversoes"] || 0);

        return {
          campanha: String(row["Campanha"] || row["campanha"] || "").trim(),
          investimento,
          receita,
          roas: 0,
          cliques,
          conversoes,
        };
      });

      // Agrupar por campanha
      const grouped = new Map<string, CampaignData>();
      for (const r of rows) {
        const existing = grouped.get(r.campanha);
        if (existing) {
          existing.investimento += r.investimento;
          existing.receita += r.receita;
          existing.cliques += r.cliques;
          existing.conversoes += r.conversoes;
        } else {
          grouped.set(r.campanha, { ...r });
        }
      }
      const parsed = Array.from(grouped.values()).map((c) => ({
        ...c,
        roas: c.investimento > 0 ? c.receita / c.investimento : 0,
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
                roasMedio={metrics.roasMedio}
                totalConversoesAtual={metrics.totalConversoesAtual}
                totalReceitaAtual={metrics.totalReceitaAtual}
                totalInvestimentoAtual={metrics.totalInvestimentoAtual}
              />

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
