export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'Awaiting Information'
  | 'Resolved'
  | 'Closed';

export type ComplaintPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type BureauCell =
  | 'Approval Bureau'
  | 'Grievance Redressal Cell'
  | 'Policy & Academic Bureau'
  | 'Faculty & Staff Cell'
  | 'Anti-Ragging Cell'
  | 'Legal & Affiliation Bureau';

export type ComplaintCategory =
  | 'Capitation / Excess Fee Demand'
  | 'Unapproved Course / Infrastructure Deficiency'
  | 'Withholding Original Certificates'
  | 'Faculty Non-Payment / Harassment'
  | 'Ragging / Student Harassment'
  | 'Misleading Affiliation / Advertisements'
  | 'Admission Malpractice / Quota Violation'
  | 'Exam Irregularity & Result Delay';

export interface InstitutionInfo {
  id: string; // AICTE Permanent ID (e.g., 1-4589231)
  name: string;
  state: string;
  city: string;
  type: 'Private Unaided' | 'Government' | 'Govt Aided' | 'Deemed University';
  accreditation: string;
  headName: string;
  headEmail: string;
}

export interface ComplainantInfo {
  name: string;
  type: 'Student' | 'Faculty' | 'Parent' | 'Whistleblower / Public';
  email: string;
  phone: string;
  anonymized: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  fromStatus?: ComplaintStatus;
  toStatus?: ComplaintStatus;
}

export interface InternalNote {
  id: string;
  officerName: string;
  officerRole: string;
  timestamp: string;
  text: string;
  isConfidential: boolean;
}

export interface Complaint {
  id: string; // e.g. AICTE-2026-B849
  refToken: string; // Public tracking token e.g. TRK-892401
  institution: InstitutionInfo;
  complainant: ComplainantInfo;
  category: ComplaintCategory;
  bureau: BureauCell;
  assignedOfficer: string;
  officerDesignation: string;
  officerEmail: string;
  submissionDate: string; // YYYY-MM-DD
  lastUpdated: string; // YYYY-MM-DD
  priority: ComplaintPriority;
  status: ComplaintStatus;
  subject: string;
  description: string;
  attachments: { name: string; size: string; type: string }[];
  slaTargetDays: number; // e.g. 15
  slaTargetDate: string;
  isOverdue: boolean;
  daysPending: number;
  duplicateGroupId?: string;
  duplicateScore?: number;
  duplicateResolution?: 'Confirmed Duplicate' | 'Not Duplicate' | 'Under Review';
  duplicateParentId?: string;
  internalNotes: InternalNote[];
  activityTimeline: ActivityLog[];
  escalationStatus?: 'Normal' | 'Escalation Recommended' | 'Notice Issued' | 'Surprise Inspection Scheduled';
}

export interface Officer {
  id: string;
  name: string;
  bureau: BureauCell;
  designation: string;
  email: string;
  activeCases: number;
}

export interface BureauInfo {
  name: BureauCell;
  shortCode: string;
  head: string;
  headEmail: string;
  officersCount: number;
  description: string;
  targetSLADays: number;
}

export interface DuplicateCluster {
  clusterId: string;
  institutionName: string;
  institutionId: string;
  category: ComplaintCategory;
  similarityScore: number;
  primaryCaseId: string;
  secondaryCaseIds: string[];
  rationale: string;
  detectedAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'assignment' | 'status' | 'duplicate' | 'info';
  complaintId?: string;
  read: boolean;
}

export interface UserRole {
  role: 'Super Admin / Member Secretary' | 'Bureau Head' | 'Cell Officer' | 'Regional Director';
  name: string;
  email: string;
  bureau?: BureauCell;
  region?: string;
}

export interface SLAConfig {
  Urgent: number; // days
  High: number;
  Medium: number;
  Low: number;
}
