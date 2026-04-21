export type EntityType =
  | "Ministry"
  | "Department"
  | "Agency"
  | "Public Authority"
  | "LGA";

export type Sector =
  | "Health"
  | "Infrastructure"
  | "Education"
  | "Agriculture"
  | "Finance"
  | "Energy"
  | "Water"
  | "Transport"
  | "Public Administration";

export type Region =
  | "National"
  | "Coast"
  | "Lake"
  | "Capital"
  | "North"
  | "South"
  | "West"
  | "SW"
  | "Central";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  sector: Sector;
  region: Region;
  budgetTzsB: number; // budget in TZS billions
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  openRecommendations: number;
  closedRecommendations: number;
  reconciliationGapsTzsB: number;
  lastAudit: string; // ISO date
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  dataConnections?: string[];
  createdAt: string;
  onboardedViaPlatform?: boolean;
}

export interface Evidence {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface Recommendation {
  id: string;
  entityId: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Implemented" | "Overdue";
  owner: string;
  dueDate: string;
  createdDate: string;
  description: string;
  evidence?: Evidence[];
  lastUpdated?: string;
  managementResponse?: string;
}

export interface ReconciliationItem {
  id: string;
  entityId: string;
  category:
    | "Budget vs Expenditure"
    | "Payroll"
    | "Procurement"
    | "Revenue"
    | "Treasury";
  gapTzsB: number;
  status: "Flagged" | "Under Review" | "Cleared" | "Escalated";
  detectedDate: string;
  description: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  level: RiskLevel;
  entitiesAffected: number;
  detectedAt: string;
  type:
    | "Duplicate Payment"
    | "Payroll Anomaly"
    | "Procurement"
    | "Reconciliation"
    | "Reporting Delay";
}

export interface ActionEvent {
  id: string;
  title: string;
  timeAgo: string;
  type: "flag" | "escalation" | "resolution" | "update";
}

export interface Notification {
  id: string;
  type: "audit-finding" | "reconciliation-alert" | "recommendation-resolved" | "entity-risk";
  count: number;
  status: "active" | "cleared";
  lastUpdated: string;
  action?: {
    label: string;
    href: string;
  };
}
