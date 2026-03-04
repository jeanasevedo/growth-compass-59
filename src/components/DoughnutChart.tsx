import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  campaigns: { campanha: string; faturamentoAdicional: number }[];
  top3Pct: number;
  top3Names: string[];
}

const COLORS = [
  "hsl(var(--success))",
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-purple))",
  "hsl(var(--chart-orange))",
  "hsl(var(--chart-rose))",
  "hsl(160 60% 55%)",
  "hsl(217 70% 70%)",
  "hsl(262 60% 70%)",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated p-3 text-sm">
      <p className="font-medium text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">R$ {payload[0].value.toLocaleString("pt-BR")}</p>
    </div>
  );
};

export function DoughnutChart({ campaigns, top3Pct, top3Names }: Props) {
  const data = campaigns
    .filter((c) => c.faturamentoAdicional > 0)
    .map((c) => ({ name: c.campanha, value: c.faturamentoAdicional }))
    .sort((a, b) => b.value - a.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card-elevated p-6"
    >
      <h3 className="text-base font-semibold text-foreground mb-2">Distribuição da Oportunidade</h3>
      <p className="text-sm text-muted-foreground mb-6">por campanha</p>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-64 h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 flex-1">
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Concentração de oportunidade</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              Top 3 concentram <span className="text-success">{top3Pct.toFixed(0)}%</span> do crescimento
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {top3Names.map((n) => (
                <span key={n} className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">{n}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.slice(0, 5).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
