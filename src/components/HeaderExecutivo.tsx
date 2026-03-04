import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Upload, FileSpreadsheet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  clientName: string;
  budgetIncrease: number;
  onBudgetChange: (v: number) => void;
  onUpload: () => void;
  onDemo: () => void;
  onExportPdf: () => void;
  hasData: boolean;
}

export function HeaderExecutivo({ clientName, budgetIncrease, onBudgetChange, onUpload, onDemo, onExportPdf, hasData }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Ads Growth Simulator PRO</p>
                <h1 className="text-xl font-bold text-foreground">{clientName}</h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pl-12">
              Simulação estratégica de crescimento baseada na performance atual
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!hasData && (
              <Button variant="outline" size="sm" onClick={onDemo} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Dados de demonstração
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Importar XLSX
            </Button>
            {hasData && (
              <Button size="sm" onClick={onExportPdf} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Gerar PDF Executivo
              </Button>
            )}
          </div>
        </div>

        {hasData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 glass-card p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-sm font-medium text-foreground whitespace-nowrap min-w-fit">
                Aumento de orçamento
              </label>
              <div className="flex-1">
                <Slider
                  value={[budgetIncrease]}
                  onValueChange={(v) => onBudgetChange(v[0])}
                  max={150}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <motion.span
                key={budgetIncrease}
                initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                className="text-2xl font-bold tabular-nums min-w-[4rem] text-right"
              >
                {budgetIncrease}%
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
