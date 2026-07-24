// Datos de sucursales genéricas para demo
export type BranchKey =
  | 'general'
  | 'norte'
  | 'sur'
  | 'anexo'
  | 'yerbaBuena';

export interface BranchMeta {
  name: string;
  shortName: string;
  code: string;
  color: string;
  apiId: string;
}

export const branches: Record<BranchKey, BranchMeta> = {
  general:    { name: 'Todas las sucursales', shortName: 'General',      code: 'GL', color: '#38bdf8', apiId: '' },
  norte:      { name: 'Centro Norte',         shortName: 'Centro Norte', code: 'CN', color: '#38bdf8', apiId: 'branch-001' },
  sur:        { name: 'Centro Sur',           shortName: 'Centro Sur',   code: 'CS', color: '#818cf8', apiId: 'branch-002' },
  anexo:      { name: 'Clínica Anexo',        shortName: 'Clín. Anexo',  code: 'CA', color: '#fb923c', apiId: 'branch-003' },
  yerbaBuena: { name: 'Sede Principal',       shortName: 'Sede Princ.',  code: 'SP', color: '#34d399', apiId: 'branch-004' },
};

export const branchOrder: BranchKey[] = ['general', 'norte', 'sur', 'anexo', 'yerbaBuena'];

export const activeBranches: BranchKey[] = ['norte', 'sur', 'anexo', 'yerbaBuena'];
