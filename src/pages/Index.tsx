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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown, Upload, Download, ChevronDown } from "lucide-react";
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
        const campanha = String(
          findCol(row, "Nombre campaña", "Nombre campaña", "Campanha", "campanha", "Campaign") || ""
        ).trim();

        const receita = parseNumber(
          findCol(row, "Ingresos por PAds", "Receita\n(Moeda local)", "Receita (Moeda local)", "Receita", "receita")
        );
        const investimento = parseNumber(
          findCol(row, "Inversión PAds", "Investimento\n(Moeda local)", "Investimento (Moeda local)", "Investimento", "investimento")
        );
        const cliques = parseNumber(findCol(row, "Clicks", "Cliques", "cliques"));
        const prints = parseNumber(findCol(row, "Prints", "Impressões", "impressoes"));
        const percentWon = parseNumber(findCol(row, "% Won", "% Impressões ganhas"));
        const lisb = parseNumber(findCol(row, "LISB", "Lost Impression Share Budget", "Impressões perdidas por orçamento"));
        const lisr = parseNumber(findCol(row, "LISR", "Lost Impression Share Rank"));
        const orcamentoAtual = parseNumber(findCol(row, "Último Budget", "Budget promedio diario", "Orçamento atual"));
        const orcamentoSugerido = parseNumber(findCol(row, "Budget sugerido", "Orçamento recomendado"));
        const diasTopada = parseNumber(findCol(row, "# Días topada", "Dias topada"));
        const diasComPrints = parseNumber(findCol(row, "# Días con prints", "Dias com impressões"));
        const pctDiasTopados = parseNumber(findCol(row, "% Días topados", "% Dias topados"));
        const roasObjetivo = parseNumber(findCol(row, "ROAS Objetivo", "ROAS objetivo"));
        const acosReal = parseNumber(findCol(row, "ACOS real", "ACOS Real"));
        const acosTarget = parseNumber(findCol(row, "Acos Target", "ACOS Target"));
        const acosCompetencia = parseNumber(findCol(row, "ACOS Competencia", "ACOS Competência"));
        const desvioAcos = parseNumber(findCol(row, "Desvío ACOS Target-Competencia", "Desvío ACOS"));
        const statusCampanha = String(findCol(row, "Status actual campaña", "Status") || "");
        const idCampanha = String(findCol(row, "ID Campaña", "ID") || "");
        const ultimaModificacao = String(findCol(row, "Última modificación campaña", "Última modificação") || "");
        const budgetPromedioDiario = parseNumber(findCol(row, "Budget promedio diario"));

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
          lisr,
          orcamentoAtual,
          orcamentoSugerido,
          diasTopada,
          diasComPrints,
          pctDiasTopados,
          roasObjetivo,
          acosReal,
          acosTarget,
          acosCompetencia,
          desvioAcos,
          statusCampanha,
          idCampanha,
          ultimaModificacao,
          budgetPromedioDiario,
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
          existing.orcamentoAtual = Math.max(existing.orcamentoAtual, r.orcamentoAtual);
          existing.orcamentoSugerido = Math.max(existing.orcamentoSugerido, r.orcamentoSugerido);
          existing.pctDiasTopados = Math.max(existing.pctDiasTopados, r.pctDiasTopados);
          existing.percentWon = Math.max(existing.percentWon, r.percentWon);
          existing.lisb = Math.max(existing.lisb, r.lisb);
          existing.lisr = Math.max(existing.lisr, r.lisr);
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

  // Export XLSX - General Model (mirrors the import template)
  const handleExportGeneral = useCallback(() => {
    if (!data || !metrics) return;
    const exportData = metrics.campaigns.map((c) => ({
      "ID Campaña": c.idCampanha || "",
      "Nombre campaña": c.campanha,
      "Status actual campaña": c.statusCampanha || "",
      "Última modificación campaña": c.ultimaModificacao || "",
      "Ingresos por PAds": c.receita,
      "Inversión PAds": c.investimento,
      "ACOS real": c.acosReal,
      "Último Budget": c.orcamentoAtual,
      "Budget promedio diario": c.budgetPromedioDiario || c.orcamentoAtual,
      "Budget sugerido": c.orcamentoSugerido,
      "# Días topada": c.diasTopada,
      "# Días con prints": c.diasComPrints,
      "% Días topados": c.pctDiasTopados,
      "Acos Target": c.acosTarget,
      "ACOS Competencia": c.acosCompetencia || 0,
      "Desvío ACOS Target-Competencia": c.desvioAcos || 0,
      "Prints": c.prints,
      "Clicks": c.cliques,
      "LISB": c.lisb,
      "LISR": c.lisr || 0,
      "% Won": c.percentWon,
      "ROAS": c.roas,
      "ROAS Objetivo": c.roasObjetivo,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Informações Gerais");
    XLSX.writeFile(wb, `Modelo_Geral_${clientName.replace(/\s/g, "_")}.xlsx`);
  }, [data, clientName]);

  // Export XLSX - Opportunities Model
  const handleExportOportunidades = useCallback(() => {
    if (!data || !metrics) return;
    const exportData = metrics.campaigns
      .filter((c) => c.impressoesPerdidas > 0)
      .sort((a, b) => b.receitaRecuperavel - a.receitaRecuperavel)
      .map((c) => ({
        "Nombre campaña": c.campanha,
        "LISB": c.lisb,
        "Prints": c.prints,
        "Impressões Perdidas": Math.round(c.impressoesPerdidas),
        "Clicks": c.cliques,
        "CTR %": (c.ctr * 100).toFixed(2),
        "Cliques Perdidos": Math.round(c.cliquesPerdidos),
        "Conversões": c.conversoes,
        "Vendas Recuperáveis": c.vendasRecuperaveis,
        "Ticket Médio": c.ticketMedio.toFixed(2),
        "Receita Recuperável": c.receitaRecuperavel.toFixed(2),
        "Último Budget": c.orcamentoAtual,
        "Budget sugerido": c.orcamentoSugerido,
        "Orçamento Adicional Diário": c.orcamentoAdicional.toFixed(2),
        "% Días topados": c.pctDiasTopados,
        "ROAS": c.roas.toFixed(2),
        "ACOS real": c.acosReal,
        "ROAS Objetivo": c.roasObjetivo,
      }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Oportunidades");
    XLSX.writeFile(wb, `Modelo_Oportunidades_${clientName.replace(/\s/g, "_")}.xlsx`);
  }, [data, clientName]);

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
                totalCliquesPerdidos={metrics.totalCliquesPerdidos}
                roasMedio={metrics.roasMedio}
                acosMedio={metrics.acosMedio}
              />

              {/* Action bar above strategic table */}
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleUpload}
                  variant="outline"
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Importar Planilha
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Exportar XLSX
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportGeneral} className="gap-2 cursor-pointer">
                      <FileDown className="h-4 w-4" />
                      Exportar Modelo Geral
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportOportunidades} className="gap-2 cursor-pointer">
                      <FileDown className="h-4 w-4" />
                      Exportar Modelo Oportunidades
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
