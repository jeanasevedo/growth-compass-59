import { motion } from "framer-motion";
import { Upload, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onUpload: () => void;
  onDemo: () => void;
}

export function EmptyState({ onUpload, onDemo }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
    >
      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <BarChart3 className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Ads Growth Simulator PRO</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Simule quanto sua conta pode crescer ao aumentar o orçamento das campanhas. Importe seus dados ou use os dados de demonstração.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" onClick={onDemo} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Usar dados de demonstração
        </Button>
        <Button size="lg" variant="outline" onClick={onUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Importar planilha XLSX
        </Button>
      </div>
    </motion.div>
  );
}
