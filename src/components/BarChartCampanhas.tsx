import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CampaignRow {
  campanha: string;
  receita: number;
  novaReceita: number;
  faturamentoAdicional: number;
}

interface Props {
  campaigns: CampaignRow[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated p-4 space-y-1.5 text-sm">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">
        Atual: <span className="font-medium text-foreground">R$ {payload[0]?.value?.toLocaleString("pt-BR")}</span>
      </p>
      <p className="text-muted-foreground">
        Projetada: <span className="font-medium text-success">R$ {payload[1]?.value?.toLocaleString("pt-BR")}</span>
      </p>
    </div>
  );
};

export function BarChartCampanhas({ campaigns }: Props) {
  const data = campaigns.map((c) => ({
    name: c.campanha.length > 20 ? c.campanha.slice(0, 18) + "…" : c.campanha,
    atual: c.receita,
    projetada: c.novaReceita,
    adicional: c.faturamentoAdicional,
  }));

  const maxAdicional = Math.max(...campaigns.map((c) => c.faturamentoAdicional));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card-elevated p-6"
    >
      <h3 className="text-base font-semibold text-foreground mb-6">Receita Atual vs Projetada por Campanha</h3>
      <ResponsiveContainer width="100%" height={campaigns.length * 60 + 40}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="atual" name="Receita Atual" radius={[0, 4, 4, 0]} fill="hsl(var(--chart-blue))" opacity={0.3} barSize={18} />
          <Bar dataKey="projetada" name="Receita Projetada" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.adicional === maxAdicional ? "hsl(var(--success))" : "hsl(var(--chart-blue))"}
                opacity={entry.adicional === maxAdicional ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
