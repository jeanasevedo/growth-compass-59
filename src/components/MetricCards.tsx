import { motion } from "framer-motion";
import { CountUp } from "./CountUp";
import { DollarSign, Rocket, TrendingUp, ShoppingCart, Wallet } from "lucide-react";

interface Props {
  receitaAtual: number;
  receitaPotencial: number;
  crescimentoPct: number;
  vendasAdicionais: number;
  investimentoAdicional: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function MetricCards({ receitaAtual, receitaPotencial, crescimentoPct, vendasAdicionais, investimentoAdicional }: Props) {
  const cards = [
    { label: "Receita Atual", value: receitaAtual, prefix: "R$ ", icon: DollarSign, color: "text-chart-blue" },
    { label: "Receita Potencial", value: receitaPotencial, prefix: "R$ ", icon: Rocket, color: "text-success" },
    { label: "Crescimento", value: crescimentoPct, suffix: "%", decimals: 1, icon: TrendingUp, color: "text-success" },
    { label: "Vendas Adicionais", value: vendasAdicionais, icon: ShoppingCart, color: "text-chart-purple" },
    { label: "Investimento Adicional", value: investimentoAdicional, prefix: "R$ ", icon: Wallet, color: "text-chart-orange" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="glass-card-elevated p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <CountUp
            value={card.value}
            prefix={card.prefix}
            suffix={card.suffix}
            decimals={card.decimals}
            className="text-2xl font-bold text-foreground block"
          />
        </motion.div>
      ))}
    </div>
  );
}
