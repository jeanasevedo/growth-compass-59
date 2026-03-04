import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface CampaignRow {
  campanha: string;
  roas: number;
  cliquesPorVenda: number;
  vendasPorClique: number;
  faturamentoAdicional: number;
  novaReceita: number;
}

interface Props {
  campaigns: CampaignRow[];
  roasMedio: number;
  budgetIncrease: number;
}

function getEscalabilidade(roas: number, roasMedio: number) {
  if (roas >= roasMedio * 1.3) return { label: "Alta", variant: "success" as const };
  if (roas >= roasMedio * 0.8) return { label: "Média", variant: "default" as const };
  return { label: "Baixa", variant: "secondary" as const };
}

export function TabelaEstrategica({ campaigns, roasMedio, budgetIncrease }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card-elevated overflow-hidden"
    >
      <div className="p-6 pb-0">
        <h3 className="text-base font-semibold text-foreground">Análise Estratégica por Campanha</h3>
        <p className="text-sm text-muted-foreground mt-1">ROAS médio da conta: {roasMedio.toFixed(1)}x</p>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-medium text-muted-foreground px-6 py-3">Campanha</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">ROAS</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Cliques/Venda</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Vendas/Clique</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">Fat. Adicional</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-3">Nova Receita</th>
              <th className="text-center font-medium text-muted-foreground px-4 py-3">Escala</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const esc = getEscalabilidade(c.roas, roasMedio);
              const isAboveAvg = c.roas > roasMedio;

              return (
                <Tooltip key={c.campanha}>
                  <TooltipTrigger asChild>
                    <tr
                      className={`border-b border-border/50 transition-colors hover:bg-accent/50 cursor-default ${
                        isAboveAvg ? "bg-success/[0.03]" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{c.campanha}</td>
                      <td className="px-4 py-4 text-right tabular-nums">{c.roas.toFixed(1)}x</td>
                      <td className="px-4 py-4 text-right tabular-nums hidden md:table-cell">{c.cliquesPorVenda.toFixed(0)}</td>
                      <td className="px-4 py-4 text-right tabular-nums hidden md:table-cell">{(c.vendasPorClique * 100).toFixed(2)}%</td>
                      <td className="px-4 py-4 text-right tabular-nums text-success font-medium">
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
                              ? "bg-success/10 text-success hover:bg-success/20 border-0"
                              : esc.variant === "default"
                              ? "bg-primary/10 text-primary hover:bg-primary/20 border-0"
                              : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          {esc.label}
                        </Badge>
                      </td>
                    </tr>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-sm">
                    Se aumentar {budgetIncrease}% no orçamento, pode gerar{" "}
                    <span className="font-semibold text-success">
                      R$ {c.faturamentoAdicional.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                    </span>{" "}
                    adicionais mantendo a eficiência atual.
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
