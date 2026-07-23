import type { TaxRule } from "@/types";

export type { TaxRule };

export interface TaxRulesSummary {
  activeRulesCount: number;
  inactiveRulesCount: number;
  categoriesCovered: number;
  avgActiveRate: number;
}