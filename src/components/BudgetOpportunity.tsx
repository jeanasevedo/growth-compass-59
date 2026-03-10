import { motion } from "framer-motion";
import { Target, MousePointerClick } from "lucide-react";
import { CountUp } from "./CountUp";
import { Badge } from "@/components/ui/badge";

interface CampaignOpp {
  campanha: string;
  prints: number;
  percentWon: number;
  lisb: number;
  cliques: number;
  conversoes: number;
  receita: number;
  investimento: number;
  orcamentoAtual: number;
  orcamentoSugerido: number;
  pctDiasTopados: number;
  impressoesPerdidas: number;
  ctr: number;
  cliquesPerdidos: number;
  cliquesRecuperaveis: number;
  vendasRecuperaveis: number;
  receitaRecuperavel: number;
  orcamentoAdicional: number;
  ticketMedio: number;
  roas: number;
  acosReal: number;
  roasObjetivo: number;
}

interface Props {
  campaigns: CampaignOpp[];
  totalVendasRecuperaveis: number;
  totalReceitaRecuperavel: number;
  totalOrcamentoAdicional: number;
  totalImpressoesPerdidas: number;
  totalCliquesPerdidos: number;
  roasMedio: number;
  acosMedio: number;
}

export function BudgetOpportunity({
  campaigns,
  totalVendasRecuperaveis,
  totalReceitaRecuperavel,
  totalOrcamentoAdicional,
  totalImpressoesPerdidas,
  totalCliquesPerdidos,
  roasMedio,
  acosMedio,
}: Props) {
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const campaignsWithOpp = campaigns
    .filter((c) => c.impressoesPerdidas > 0 && c.orcamentoAdicional > 0)
    .sort((a, b) => b.receitaRecuperavel - a.receitaRecuperavel);

  if (campaignsWithOpp.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Target className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Oportunidade por Impressões Perdidas</h3>
          <p className="text-sm text-muted-foreground">
            Potencial de crescimento baseado em LISB e taxa de conversão por campanha
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Impressões Perdidas</p>
          <p className="text-xl font-bold text-amber-600">
            <CountUp value={totalImpressoesPerdidas} />
          </p>
        </div>
        <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-4 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
            <MousePointerClick className="h-3 w-3" /> Cliques Perdidos
          </p>
          <p className="text-xl font-bold text-orange-600">
            <CountUp value={totalCliquesPerdidos} />
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendas Recuperáveis</p>
          <p className="text-xl font-bold text-emerald-600">
            <CountUp value={totalVendasRecuperaveis} prefix="+" />
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Receita Recuperável</p>
          <p className="text-xl font-bold text-emerald-600">
            <CountUp value={totalReceitaRecuperavel} prefix="R$ " />
          </p>
        </div>
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Investimento Necessário</p>
          <p className="text-xl font-bold text-primary">
            <CountUp value={totalOrcamentoAdicional * 30} prefix="R$ " />
          </p>
          <p className="text-xs text-muted-foreground">/mês (diário × 30)</p>
        </div>
        <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4 text-center space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ROAS / ACOS Médio</p>
          <p className="text-lg font-bold text-blue-600">
            {roasMedio.toFixed(1)}x
          </p>
          <p className="text-xs text-muted-foreground">ACOS {acosMedio.toFixed(1)}%</p>
        </div>
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4"
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold text-amber-600">💡 Insight:</span>{" "}
          Existem <span className="font-semibold">{totalImpressoesPerdidas.toLocaleString("pt-BR")}</span> impressões
          e <span className="font-semibold text-orange-600">{Math.round(totalCliquesPerdidos).toLocaleString("pt-BR")}</span> cliques
          perdidos por orçamento em {campaignsWithOpp.length} campanhas. Com ROAS médio de{" "}
          <span className="font-semibold">{roasMedio.toFixed(1)}x</span>, vale recuperar até{" "}
          <span className="font-bold text-emerald-600">+{totalVendasRecuperaveis.toLocaleString("pt-BR")}</span> vendas
          e <span className="font-bold text-emerald-600">{fmt(totalReceitaRecuperavel)}</span> em receita adicional.
        </p>
      </motion.div>

      {/* Per-campaign table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-medium text-muted-foreground px-4 py-3">Campanha</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">LISB %</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">Impr. Perdidas</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">Cliques Perdidos</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">ROAS</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">ACOS</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">Budget Atual</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">Budget Sugerido</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">Vendas Recup.</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-3">Receita Recup.</th>
              <th className="text-center font-medium text-muted-foreground px-3 py-3">Prioridade</th>
            </tr>
          </thead>
          <tbody>
            {campaignsWithOpp.map((c) => {
              const priority = c.pctDiasTopados >= 60 ? "Alta" : c.pctDiasTopados >= 30 ? "Média" : "Baixa";
              const priorityClass =
                priority === "Alta"
                  ? "bg-destructive/10 text-destructive"
                  : priority === "Média"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-muted/20 text-muted-foreground";

              return (
                <tr key={c.campanha} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{c.campanha}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-amber-600">{c.lisb.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-right tabular-nums text-amber-600">
                    {Math.round(c.impressoesPerdidas).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-orange-600">
                    {Math.round(c.cliquesPerdidos).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.roas.toFixed(1)}x</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.acosReal.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fmt(c.orcamentoAtual)}</td>
                  <td className="px-3 py-3 text-right tabular-nums font-medium">{fmt(c.orcamentoSugerido)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-emerald-600 font-medium">+{c.vendasRecuperaveis}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-emerald-600 font-medium">{fmt(c.receitaRecuperavel)}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="secondary" className={`border-0 ${priorityClass}`}>
                      {priority}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
