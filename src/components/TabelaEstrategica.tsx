import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Filter, MousePointerClick, Eye } from "lucide-react";

interface CampaignRow {
  campanha: string;
  roas: number;
  acosReal: number;
  cliquesPorVenda: number;
  vendasPorClique: number;
  faturamentoAdicional: number;
  novaReceita: number;
  impressoesPerdidas: number;
  cliquesPerdidos: number;
  lisb: number;
  orcamentoAtual: number;
  orcamentoSugerido: number;
  pctDiasTopados: number;
  budgetPacing: number;
  vendasRecuperaveis: number;
}

interface Props {
  campaigns: CampaignRow[];
  roasMedio: number;
  budgetIncrease: number;
}

type QuickFilter = "none" | "top10budget" | "topCliques" | "maiorLisb" | "maiorVendas" | "melhorRoas";

function getEscalabilidade(roas: number, roasMedio: number) {
  if (roas >= roasMedio * 1.3) return { label: "Alta", variant: "success" as const };
  if (roas >= roasMedio * 0.8) return { label: "Média", variant: "default" as const };
  return { label: "Baixa", variant: "secondary" as const };
}

function getBudgetPacingColor(pacing: number) {
  if (pacing <= 60) return { bg: "bg-destructive", text: "text-destructive", label: "Crítico" };
  if (pacing <= 85) return { bg: "bg-amber-500", text: "text-amber-600", label: "Atenção" };
  return { bg: "bg-emerald-500", text: "text-emerald-600", label: "OK" };
}

export function TabelaEstrategica({ campaigns, roasMedio, budgetIncrease }: Props) {
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("none");

  const filtered = useMemo(() => {
    let list = [...campaigns];
    switch (quickFilter) {
      case "top10budget":
        list = list.sort((a, b) => b.lisb - a.lisb).slice(0, 10);
        break;
      case "topCliques":
        list = list.sort((a, b) => b.cliquesPerdidos - a.cliquesPerdidos);
        break;
      case "maiorLisb":
        list = list.sort((a, b) => b.lisb - a.lisb);
        break;
      case "maiorVendas":
        list = list.sort((a, b) => b.vendasRecuperaveis - a.vendasRecuperaveis);
        break;
      case "melhorRoas":
        list = list.sort((a, b) => b.roas - a.roas);
        break;
    }
    return list;
  }, [campaigns, quickFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card-elevated overflow-hidden"
    >
      <div className="p-6 pb-0 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Análise Estratégica por Campanha</h3>
          <p className="text-sm text-muted-foreground mt-1">ROAS médio da conta: {roasMedio.toFixed(1)}x</p>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={quickFilter === "none" ? "default" : "outline"}
            size="sm"
            onClick={() => setQuickFilter("none")}
            className="text-xs h-7"
          >
            Todas
          </Button>
          <Button
            variant={quickFilter === "top10budget" ? "default" : "outline"}
            size="sm"
            onClick={() => setQuickFilter("top10budget")}
            className="text-xs h-7 gap-1"
          >
            <Eye className="h-3 w-3" />
            Top 10 Perda de Orçamento
          </Button>
          <Button
            variant={quickFilter === "topCliques" ? "default" : "outline"}
            size="sm"
            onClick={() => setQuickFilter("topCliques")}
            className="text-xs h-7 gap-1"
          >
            <MousePointerClick className="h-3 w-3" />
            Maior Oportunidade de Cliques
          </Button>
          <Button
            variant={quickFilter === "maiorLisb" ? "default" : "outline"}
            size="sm"
            onClick={() => setQuickFilter("maiorLisb")}
            className="text-xs h-7 gap-1"
          >
            Campanha com Maior LISB
          </Button>
          <Button
            variant={quickFilter === "maiorVendas" ? "default" : "outline"}
            size="sm"
            onClick={() => setQuickFilter("maiorVendas")}
            className="text-xs h-7 gap-1"
          >
            Maior Oportunidades de Vendas
          </Button>
          <Button
            variant={quickFilter === "melhorRoas" ? "default" : "outline"}
            size="sm"
            onClick={() => setQuickFilter("melhorRoas")}
            className="text-xs h-7 gap-1"
          >
            Campanhas com Melhor ROAS
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm" style={{ minWidth: "1100px" }}>
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-medium text-muted-foreground px-6 py-3 sticky left-0 bg-card z-10 min-w-[200px]">Campanha</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">ROAS</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">ACOS</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Cliques/Venda</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Vendas/Clique</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">Impr. Perdidas</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">Cliques Perdidos</th>
              <th className="text-center font-medium text-muted-foreground px-4 py-3 min-w-[140px]">Budget Pacing</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">Fat. Adicional</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">Nova Receita</th>
              <th className="text-center font-medium text-muted-foreground px-4 py-3">Escala</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const esc = getEscalabilidade(c.roas, roasMedio);
              const isAboveAvg = c.roas > roasMedio;
              const pacing = getBudgetPacingColor(c.budgetPacing);

              return (
                <Tooltip key={c.campanha}>
                  <TooltipTrigger asChild>
                    <tr
                      className={`border-b border-border/50 transition-colors hover:bg-accent/50 cursor-default ${
                        isAboveAvg ? "bg-emerald-500/[0.03]" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-foreground sticky left-0 bg-card z-10">{c.campanha}</td>
                      <td className="px-4 py-4 text-right tabular-nums">{c.roas.toFixed(1)}x</td>
                      <td className="px-4 py-4 text-right tabular-nums">{c.acosReal.toFixed(1)}%</td>
                      <td className="px-4 py-4 text-right tabular-nums hidden md:table-cell">{c.cliquesPorVenda.toFixed(0)}</td>
                      <td className="px-4 py-4 text-right tabular-nums hidden md:table-cell">{(c.vendasPorClique * 100).toFixed(2)}%</td>
                      <td className="px-4 py-4 text-right tabular-nums text-amber-600">
                        {Math.round(c.impressoesPerdidas).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-orange-600">
                        {Math.round(c.cliquesPerdidos).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.min(c.budgetPacing, 100)}
                            className="h-2 flex-1"
                            style={{
                              // @ts-ignore
                              "--progress-bg": c.budgetPacing <= 60 ? "hsl(var(--destructive))" : c.budgetPacing <= 85 ? "hsl(25, 95%, 53%)" : "hsl(160, 84%, 39%)",
                            } as React.CSSProperties}
                          />
                          <span className={`text-xs font-medium ${pacing.text} min-w-[42px] text-right`}>
                            {Math.round(c.budgetPacing)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-emerald-600 font-medium">
                        R$ {c.faturamentoAdicional.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums font-medium">
                        R$ {c.novaReceita.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          variant={esc.variant === "success" ? "default" : esc.variant}
                          className={
                            esc.variant === "success"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0"
                              : esc.variant === "default"
                              ? "bg-primary/10 text-primary hover:bg-primary/20 border-0"
                              : "bg-muted/20 text-muted-foreground border-0"
                          }
                        >
                          {esc.label}
                        </Badge>
                      </td>
                    </tr>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-sm">
                    Se aumentar {budgetIncrease}% no orçamento, pode gerar{" "}
                    <span className="font-semibold text-emerald-600">
                      R$ {c.faturamentoAdicional.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                    </span>{" "}
                    adicionais. LISB: {c.lisb.toFixed(1)}% | {Math.round(c.impressoesPerdidas).toLocaleString("pt-BR")} impressões e {Math.round(c.cliquesPerdidos).toLocaleString("pt-BR")} cliques perdidos.
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
