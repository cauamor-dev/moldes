import type { Kind } from "./schema";

export const KIND_LABELS: Record<Kind, string> = {
  style: "Estilo",
  type_pair: "Fontes",
  palette: "Paleta",
  motion: "Animação",
  pattern: "Tela",
  effect: "Efeito",
  component: "Componente",
};

export const TABS: { id: string; label: string; kinds: Kind[] }[] = [
  { id: "tudo", label: "Tudo", kinds: [] },
  { id: "telas", label: "Telas", kinds: ["pattern"] },
  { id: "animacoes", label: "Animações", kinds: ["motion"] },
  { id: "efeitos", label: "Efeitos", kinds: ["effect"] },
  { id: "fontes", label: "Fontes", kinds: ["type_pair"] },
  { id: "paletas", label: "Paletas", kinds: ["palette"] },
  { id: "componentes", label: "Componentes", kinds: ["component"] },
  { id: "estilos", label: "Estilos", kinds: ["style"] },
];
