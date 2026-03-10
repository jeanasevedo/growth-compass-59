import { motion } from "framer-motion";
import { Upload, BarChart3, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onUploadGeneral: () => void;
  onUploadAnalise: () => void;
}

export function EmptyState({ onUploadGeneral, onUploadAnalise }: Props) {
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
        Importe suas planilhas para começar. São dois modelos de dados distintos que alimentam seções diferentes do painel.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="glass-card p-6 space-y-3 text-center max-w-xs">
          <FileSpreadsheet className="h-8 w-8 text-primary mx-auto" />
          <h3 className="font-semibold text-foreground text-sm">Visão Geral</h3>
          <p className="text-xs text-muted-foreground">
            modelo_ads_manager_dados_gerais
          </p>
          <Button size="sm" variant="outline" onClick={onUploadGeneral} className="gap-2 w-full">
            <Upload className="h-4 w-4" />
            Importar Dados Gerais
          </Button>
        </div>
        <div className="glass-card p-6 space-y-3 text-center max-w-xs">
          <FileSpreadsheet className="h-8 w-8 text-amber-500 mx-auto" />
          <h3 className="font-semibold text-foreground text-sm">Análise de Campanhas</h3>
          <p className="text-xs text-muted-foreground">
            Modelo_analise_campanhas
          </p>
          <Button size="sm" onClick={onUploadAnalise} className="gap-2 w-full">
            <Upload className="h-4 w-4" />
            Importar Análise
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
