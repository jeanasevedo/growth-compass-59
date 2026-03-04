import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { TrendingUp, DollarSign, Eye, Target } from "lucide-react";
import { CountUp } from "./CountUp";

interface Props {
  roasMedio: number;
  totalConversoesAtual: number;
  totalReceitaAtual: number;
  totalInvestimentoAtual: number;
}

export function BudgetOpportunity({ roasMedio, totalConversoesAtual, totalReceitaAtual, totalInvestimentoAtual }: Props) {
  const [impressoesPerdidas, setImpressoesPerdidas] = useState<number>(0);
  const [orcamentoAtual, setOrcamentoAtual] = useState<number>(0);
  const [orcamentoRecomendado, setOrcamentoRecomendado] = useState<number>(0);

  const orcamentoAdicional = Math.max(0, orcamentoRecomendado - orcamentoAtual);
  const percentualAumento = orcamentoAtual > 0 ? (orcamentoAdicional / orcamentoAtual) * 100 : 0;

  // Estimate additional sales based on budget proportion and current performance
  const cvrGlobal = totalInvestimentoAtual > 0 ? totalConversoesAtual / totalInvestimentoAtual : 0;
  const vendasAdicionaisEstimadas = Math.round(orcamentoAdicional * cvrGlobal);
  const receitaAdicionalEstimada = orcamentoAdicional * roasMedio;
  const roasProjetado = orcamentoRecomendado > 0 ? (totalReceitaAtual + receitaAdicionalEstimada) / (totalInvestimentoAtual + orcamentoAdicional) : roasMedio;

  const hasInput = impressoesPerdidas > 0 || orcamentoAtual > 0 || orcamentoRecomendado > 0;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

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
          <p className="text-sm text-muted-foreground">Insira os dados da plataforma para estimar o potencial de crescimento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Impressões perdidas por orçamento
          </label>
          <Input
            type="number"
            placeholder="Ex: 50000"
            value={impressoesPerdidas || ""}
            onChange={(e) => setImpressoesPerdidas(Number(e.target.value) || 0)}
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Orçamento atual (R$)
          </label>
          <Input
            type="number"
            placeholder="Ex: 10000"
            value={orcamentoAtual || ""}
            onChange={(e) => setOrcamentoAtual(Number(e.target.value) || 0)}
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Orçamento recomendado (R$)
          </label>
          <Input
            type="number"
            placeholder="Ex: 15000"
            value={orcamentoRecomendado || ""}
            onChange={(e) => setOrcamentoRecomendado(Number(e.target.value) || 0)}
            className="bg-background/50"
          />
        </div>
      </div>

      <AnimatePresence>
        {hasInput && orcamentoAdicional > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5"
          >
            <div className="h-px bg-border/50" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Investimento adicional</p>
                <p className="text-xl font-bold text-emerald-600">
                  <CountUp value={orcamentoAdicional} prefix="R$ " />
                </p>
                <p className="text-xs text-emerald-600/70">+{percentualAumento.toFixed(0)}% do atual</p>
              </div>
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendas adicionais estimadas</p>
                <p className="text-xl font-bold text-emerald-600">
                  <CountUp value={vendasAdicionaisEstimadas} prefix="+" />
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Receita adicional estimada</p>
                <p className="text-xl font-bold text-emerald-600">
                  <CountUp value={receitaAdicionalEstimada} prefix="R$ " />
                </p>
              </div>
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ROAS projetado</p>
                <p className="text-xl font-bold text-primary">
                  <CountUp value={roasProjetado} decimals={2} suffix="x" />
                </p>
              </div>
            </div>

            {impressoesPerdidas > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4"
              >
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-amber-600">💡 Insight:</span>{" "}
                  Com <span className="font-semibold">{impressoesPerdidas.toLocaleString("pt-BR")}</span> impressões perdidas por orçamento,
                  ao ajustar o investimento de <span className="font-semibold">{fmt(orcamentoAtual)}</span> para{" "}
                  <span className="font-semibold">{fmt(orcamentoRecomendado)}</span>,
                  você pode capturar essas oportunidades e gerar aproximadamente{" "}
                  <span className="font-bold text-emerald-600">{fmt(receitaAdicionalEstimada)}</span> em receita adicional
                  com <span className="font-bold text-emerald-600">+{vendasAdicionaisEstimadas}</span> vendas estimadas.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
