import { motion } from "framer-motion";
import { CountUp } from "./CountUp";
import { TrendingUp, DollarSign, BarChart3, ShoppingCart, Wallet, Target, Lightbulb } from "lucide-react";

interface Props {
  totalReceitaAtual: number;
  totalReceitaProjetada: number;
  crescimentoAbsoluto: number;
  crescimentoPct: number;
  novoRoasMedio: number;
  totalVendasAdicionais: number;
  investimentoAdicional: number;
  budgetIncrease: number;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ResumoEstrategico(props: Props) {
  const metrics = [
    { label: "Receita atual total", value: props.totalReceitaAtual, prefix: "R$ ", icon: DollarSign },
    { label: "Receita projetada total", value: props.totalReceitaProjetada, prefix: "R$ ", icon: BarChart3 },
    { label: "Crescimento absoluto", value: props.crescimentoAbsoluto, prefix: "R$ ", icon: TrendingUp },
    { label: "Crescimento percentual", value: props.crescimentoPct, suffix: "%", decimals: 1, icon: Target },
    { label: "Novo ROAS médio", value: props.novoRoasMedio, suffix: "x", decimals: 1, icon: Target },
    { label: "Total vendas adicionais", value: props.totalVendasAdicionais, icon: ShoppingCart },
    { label: "Investimento adicional", value: props.investimentoAdicional, prefix: "R$ ", icon: Wallet },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={container} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <motion.div key={m.label} variants={item} className="glass-card-elevated p-6 space-y-2">
            <div className="flex items-center gap-2">
              <m.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</span>
            </div>
            <CountUp
              value={m.value}
              prefix={m.prefix}
              suffix={m.suffix}
              decimals={m.decimals}
              className="text-2xl font-bold text-foreground block"
            />
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} className="glass-card-elevated p-8 border-l-4 border-l-success">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-success" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Insight Estratégico</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Aplicando o aumento de{" "}
              <span className="font-semibold text-foreground">{props.budgetIncrease}%</span> no orçamento simulado, a
              conta pode crescer{" "}
              <span className="font-semibold text-success">{props.crescimentoPct.toFixed(1)}%</span>, gerando{" "}
              <span className="font-semibold text-foreground">
                R$ {props.crescimentoAbsoluto.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </span>{" "}
              adicionais com{" "}
              <span className="font-semibold text-foreground">
                {props.totalVendasAdicionais}
              </span>{" "}
              vendas a mais, mantendo a eficiência atual do investimento.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
