import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
  Complaint,
  ComplaintStatus,
  BureauCell,
  SystemNotification,
  UserRole,
  SLAConfig,
  InternalNote,
  ActivityLog,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  DEFAULT_SLA_CONFIG,
  AICTE_OFFICERS,
} from '../data/initialComplaints';

export const VALID_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  Submitted: ['Under Review'],
  'Under Review': ['Assigned', 'Resolved'],
  Assigned: ['Awaiting Information', 'Under Review', 'Resolved'],
  'Awaiting Information': ['Under Review', 'Assigned', 'Resolved'],
  Resolved: ['Closed', 'Under Review'],
  Closed: ['Under Review'], // Reopen with high-level approval
};

export const DEMO_ROLES: UserRole[] = [
  {
    role: 'Super Admin / Member Secretary',
    name: 'Prof. Alok Ranjan (Member Secretary)',
    email: 'member.secretary@aicte-india.org',
    region: 'AICTE HQ, New Delhi',
  },
  {
    role: 'Bureau Head',
    name: 'Prof. Rajeev Kumar Sharma',
    email: 'head.ab@aicte-india.org',
    bureau: 'Approval Bureau',
    region: 'HQ Approvals Wing',
  },
  {
    role: 'Cell Officer',
    name: 'Dr. Sunita Deshmukh',
    email: 's.deshmukh@aicte-india.org',
    bureau: 'Grievance Redressal Cell',
    region: 'Grievance Desk',
  },
  {
    role: 'Regional Director',
    name: 'Dr. V. K. Wankhede',
    email: 'wro.director@aicte-india.org',
    region: 'Western Regional Office (WRO - Mumbai)',
  },
];

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Smart Delay Alert: 5 Cases Overdue',
    message: 'AICTE-2026-B101 and 4 other complaints have breached their configured SLA resolution limits.',
    timestamp: '10 minutes ago',
    type: 'alert',
    complaintId: 'AICTE-2026-B101',
    read: false,
  },
  {
    id: 'NOTIF-2',
    title: 'Duplicate Detected: Apex Institute',
    message: 'AICTE-2026-B102 matched AICTE-2026-B101 with 92% similarity score (Capitation Fee).',
    timestamp: '25 minutes ago',
    type: 'duplicate',
    complaintId: 'AICTE-2026-B102',
    read: false,
  },
  {
    id: 'NOTIF-3',
    title: 'High Priority Assignment',
    message: 'Complaint AICTE-2026-B106 (Ragging case at Bhopal) assigned to Smt. Preeti Raghavan.',
    timestamp: '2 hours ago',
    type: 'assignment',
    complaintId: 'AICTE-2026-B106',
    read: false,
  },
  {
    id: 'NOTIF-4',
    title: 'Status Update: Case Resolved',
    message: 'Complaint AICTE-2026-B107 has been marked as Resolved with FIR and disciplinary action.',
    timestamp: 'Yesterday',
    type: 'status',
    complaintId: 'AICTE-2026-B107',
    read: true,
  },
  {
    id: 'NOTIF-5',
    title: 'New Complaint Intake: Sonipat',
    message: 'Fresh complaint AICTE-2026-B123 submitted against CSIT Nagpur regarding exam fee demand.',
    timestamp: '1 day ago',
    type: 'info',
    complaintId: 'AICTE-2026-B123',
    read: true,
  },
];

interface ComplaintContextType {
  complaints: Complaint[];
  notifications: SystemNotification[];
  currentUser: UserRole;
  slaConfig: SLAConfig;
  activeView: string;
  selectedComplaintId: string | null;
  globalSearchQuery: string;
  setActiveView: (view: string) => void;
  setSelectedComplaintId: (id: string | null) => void;
  setGlobalSearchQuery: (q: string) => void;
  setCurrentUser: (user: UserRole) => void;
  updateComplaintStatus: (
    id: string,
    newStatus: ComplaintStatus,
    remark: string,
    actorName?: string
  ) => { success: boolean; message: string };
  assignComplaint: (
    id: string,
    officerName: string,
    bureau: BureauCell,
    remark: string
  ) => void;
  addInternalNote: (id: string, noteText: string, isConfidential: boolean) => void;
  updateDuplicateResolution: (
    id: string,
    resolution: 'Confirmed Duplicate' | 'Not Duplicate'
  ) => void;
  triggerEscalation: (
    id: string,
    escalationType: 'Notice Issued' | 'Surprise Inspection Scheduled',
    remark: string
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateSLAConfig: (config: SLAConfig) => void;
  resetDemoData: () => void;
  isValidTransition: (from: ComplaintStatus, to: ComplaintStatus) => boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const STORAGE_KEY = 'aicte_complaint360_cases_v2';
const NOTIF_KEY = 'aicte_complaint360_notifs_v2';
const SLA_KEY = 'aicte_complaint360_sla_v2';

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load complaints from localStorage', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [slaConfig, setSlaConfig] = useState<SLAConfig>(() => {
    try {
      const saved = localStorage.getItem(SLA_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load SLA config from localStorage', e);
    }
    return DEFAULT_SLA_CONFIG;
  });

  const [currentUser, setCurrentUser] = useState<UserRole>(DEMO_ROLES[0]);
  
  const getInitialView = (): string => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) return hash;
      const params = new URLSearchParams(window.location.search);
      const qView = params.get('view');
      if (qView) return qView;
    }
    return 'dashboard';
  };

  const [activeView, setActiveViewState] = useState<string>(getInitialView);

  const setActiveView = (view: string) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      window.location.hash = `#${view}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash && hash !== activeView) {
        setActiveViewState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeView]);

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Persist complaints whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to persist complaints', e);
    }
  }, [complaints]);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to persist notifications', e);
    }
  }, [notifications]);

  // Persist SLA config
  useEffect(() => {
    try {
      localStorage.setItem(SLA_KEY, JSON.stringify(slaConfig));
    } catch (e) {
      console.error('Failed to persist SLA config', e);
    }
  }, [slaConfig]);

  const isValidTransition = (from: ComplaintStatus, to: ComplaintStatus): boolean => {
    if (from === to) return true;
    const allowed = VALID_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    remark: string,
    actorName?: string
  ): { success: boolean; message: string } => {
    const target = complaints.find((c) => c.id === id);
    if (!target) {
      return { success: false, message: 'Complaint not found.' };
    }

    if (!isValidTransition(target.status, newStatus)) {
      return {
        success: false,
        message: `Invalid transition: Cannot move from "${target.status}" directly to "${newStatus}".`,
      };
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: timestampStr,
      actor: actorName || currentUser.name,
      action: `Status changed to ${newStatus}`,
      details: remark || `Status transition from ${target.status} to ${newStatus}.`,
      fromStatus: target.status,
      toStatus: newStatus,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            lastUpdated: todayStr,
            activityTimeline: [newActivity, ...c.activityTimeline],
          };
        }
        return c;
      })
    );

    // Push new notification
    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Status Changed: ${id}`,
      message: `Case ${id} marked as ${newStatus} by ${actorName || currentUser.name}. Remark: "${remark}"`,
      timestamp: 'Just now',
      type: 'status',
      complaintId: id,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, message: `Status updated successfully to ${newStatus}.` };
  };

  const assignComplaint = (
    id: string,
    officerName: string,
    bureau: BureauCell,
    remark: string
  ) => {
    const officer = AICTE_OFFICERS.find((o) => o.name === officerName);
    const todayStr = new Date().toISOString().slice(0, 10);
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: timestampStr,
      actor: currentUser.name,
      action: `Assigned to ${officerName} (${bureau})`,
      details: remark || `Re-assigned bureau/cell responsibility.`,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedStatus = c.status === 'Submitted' ? 'Assigned' : c.status;
          return {
            ...c,
            assignedOfficer: officerName,
            officerDesignation: officer?.designation || 'Investigating Officer',
            officerEmail: officer?.email || 'officer@aicte-india.org',
            bureau: bureau,
            status: updatedStatus,
            lastUpdated: todayStr,
            activityTimeline: [newActivity, ...c.activityTimeline],
          };
        }
        return c;
      })
    );

    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Case Re-assigned: ${id}`,
      message: `${id} assigned to ${officerName} (${bureau}).`,
      timestamp: 'Just now',
      type: 'assignment',
      complaintId: id,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addInternalNote = (id: string, noteText: string, isConfidential: boolean) => {
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const newNote: InternalNote = {
      id: `NOT-${Date.now()}`,
      officerName: currentUser.name,
      officerRole: currentUser.role,
      timestamp: timestampStr,
      text: noteText,
      isConfidential,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            internalNotes: [newNote, ...c.internalNotes],
          };
        }
        return c;
      })
    );
  };

  const updateDuplicateResolution = (
    id: string,
    resolution: 'Confirmed Duplicate' | 'Not Duplicate'
  ) => {
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: timestampStr,
      actor: currentUser.name,
      action: `Duplicate status marked: ${resolution}`,
      details:
        resolution === 'Confirmed Duplicate'
          ? 'Confirmed by officer. Linked to parent master case for unified investigation.'
          : 'Dismissed duplicate similarity flag after officer review.',
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            duplicateResolution: resolution,
            activityTimeline: [newActivity, ...c.activityTimeline],
          };
        }
        return c;
      })
    );
  };

  const triggerEscalation = (
    id: string,
    escalationType: 'Notice Issued' | 'Surprise Inspection Scheduled',
    remark: string
  ) => {
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: timestampStr,
      actor: currentUser.name,
      action: `Escalation Executed: ${escalationType}`,
      details: remark || `Official statutory intervention triggered due to SLA breach.`,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            escalationStatus: escalationType,
            activityTimeline: [newActivity, ...c.activityTimeline],
          };
        }
        return c;
      })
    );

    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Escalation Triggered: ${id}`,
      message: `${escalationType} formally logged for ${id}.`,
      timestamp: 'Just now',
      type: 'alert',
      complaintId: id,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateSLAConfig = (newConfig: SLAConfig) => {
    setSlaConfig(newConfig);
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSlaConfig(DEFAULT_SLA_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIF_KEY);
    localStorage.removeItem(SLA_KEY);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        notifications,
        currentUser,
        slaConfig,
        activeView,
        selectedComplaintId,
        globalSearchQuery,
        setActiveView,
        setSelectedComplaintId,
        setGlobalSearchQuery,
        setCurrentUser,
        updateComplaintStatus,
        assignComplaint,
        addInternalNote,
        updateDuplicateResolution,
        triggerEscalation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateSLAConfig,
        resetDemoData,
        isValidTransition,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
