# AICTE COMPLAINT360 🏛️
### Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells
**Smart India Hackathon 2026** • **Problem Statement ID:** `SIH26264`

---

## 🎯 Executive Overview

**AICTE Complaint360** is an enterprise-grade, centralized grievance monitoring and case management platform designed for authorized All India Council for Technical Education (AICTE) officials. The platform bridges technical education cells and regional directorates into a unified, transparent operating environment to ingest, screen, assign, monitor, escalate, and resolve institutional complaints.

Developed to address SIH 2026 Problem Statement **SIH26264**, this application eliminates inter-bureau communication silos, prevents duplicate inquiry efforts, and provides automated surveillance over citizen charter service-level agreement (SLA) turnaround times.

---

## 🛠️ Technology Stack

- **Core & Framework:** React 19 + TypeScript + Vite 6
- **Styling & Design System:** Tailwind CSS (Government Enterprise Theme: Deep Navy `#0b1e36`, Royal Blue `#1e40af`, Ash Grey `#f8fafc`, Saffron `#d97706`)
- **Data Visualizations:** Recharts (Interactive Status Donut, Bureau Workload Bar Charts, Monthly Intake & Resolution Area Charts, SLA Turnaround Comparison)
- **Icons & UI Accents:** Lucide React (Enterprise Iconography)
- **State Management & Persistence:** React Context + `localStorage` with initial seed of 32+ realistic sample cases across Indian technical colleges.
- **Reporting:** Client-side CSV export generator & CSS print stylesheets for official AICTE council submissions.

---

## 🏛️ Bureau & Cell Coverage

AICTE Complaint360 centralizes all specialized AICTE divisions:
1. **Approval Bureau (AB):** Unapproved courses, infrastructure deficiencies, illegal shifts, Extension of Approval (EoA) irregularities.
2. **Grievance Redressal Cell (GRC):** Student grievances, ombudsman compliance, fee disputes, admission quota violations.
3. **Policy & Academic Planning Bureau (PAPB):** Model curriculum deviations, autonomous college examination delays, degree certificate holds.
4. **Faculty & Staff Cell (FSC):** AICTE 7th Pay Commission non-compliance, unlawful terminations, delayed salaries, PF deduction recovery.
5. **Anti-Ragging Cell (ARC):** Immediate intervention on national anti-ragging helpline escalations, FIR coordinations, District Committee liaison.
6. **Legal & Institutional Affiliation Bureau (LAB):** RTU/AKTU disaffiliations, fraudulent advertisements, judicial writ petitions.

---

## 🚀 Key Functional Modules

### 1. 🔐 Official Enterprise Sign-In
- Modeled after official Government of India / AICTE portal standards.
- **One-Click Persona Switcher** for hackathon judges:
  - *Super Admin / Member Secretary* (Full system oversight & configuration)
  - *Bureau Head - Approval Bureau* (High-level approvals & EoA compliance)
  - *Advisor - Grievance Redressal Cell* (Student fee & capitation inquiries)
  - *Western Regional Director* (Regional office inspections & monitoring)
- Prominent disclaimers clarifying prototype demonstration status.

### 2. 📊 Executive Overview Dashboard
- **Dynamic KPI Stat Cards**:
  - Total Complaints
  - New / Submitted Cases
  - Under Review (Screening)
  - Pending / Awaiting Action
  - Resolved & Disposed Cases
  - Overdue (SLA Breached) Cases
- **Instant Escalation Banner**: Highlights critical delays requiring statutory show-cause notices.
- **Recent Complaints Stream** & Bureau Workload Distribution summary.

### 3. 📑 Complaint Management Central
- Filterable, sortable, searchable, and paginated table tracking 32+ realistic complaints.
- **Multi-Dimensional Filters**: Filter by Status, Bureau/Cell, Priority, and State/Region.
- **Search Engine**: Instant lookup by Case ID (e.g., `AICTE-2026-B101`), Token, College Name, City, or Category.
- **Export to CSV**: Generates formatted CSV exports of filtered records for offline reporting.

### 4. 🔍 Deep Case Dossier Modal
- In-depth modal with 4 dedicated investigative tabs:
  1. **Case Overview & Institution:** AICTE Permanent ID (PID), accreditation status, institution contact, complainant record (with whistleblower protection), and evidence attachments preview.
  2. **Activity Audit Trail:** Immutable chronologically-ordered audit log tracking every transition, timestamp, and responsible actor.
  3. **Confidential Internal Notes:** Officer-only note-taking thread with confidentiality flags.
  4. **Workflow Actions & Reassignment:**
     - **Strict State Machine Transition Guards**:
       - `Submitted` ➔ `Under Review`
       - `Under Review` ➔ `Assigned`, `Resolved`
       - `Assigned` ➔ `Awaiting Information`, `Under Review`, `Resolved`
       - `Awaiting Information` ➔ `Under Review`, `Assigned`, `Resolved`
       - `Resolved` ➔ `Closed`, `Under Review`
     - Mandatory transition remarks required for accountability.
     - Modal confirmation step before committing status updates.
     - Cross-bureau officer re-assignment dropdowns.

### 5. 🤖 Smart Duplicate Complaint Detection
- Identifies coordinated or repeat grievance filings against the same technical college.
- **Transparent Similarity Scoring Logic**:
  - *Institution PID / Name Exact Match*: 40% weight
  - *Grievance Category Alignment*: 30% weight
  - *Semantic / Keyword Token Overlap*: 30% weight
- Displays grouped duplicate clusters (e.g., Cluster `DUP-101` on Apex Institute Pune capitation fees).
- **Officer Review Actions**:
  - *Confirm Duplicate*: Links child complaint to master investigation file.
  - *Not Duplicate*: Dismisses similarity flag.
- Never automatically deletes or modifies complaint data; advisory notice explicitly outlines that scores are machine suggestions.

### 6. ⏱️ Smart Delay & Overdue SLA Monitoring
- Tracks complaint aging against configurable Citizen Charter resolution limits:
  - **Urgent**: 7 Days (e.g. Ragging, physical harassment)
  - **High**: 15 Days (e.g. Capitation fee, withheld certificates)
  - **Medium**: 30 Days (e.g. Faculty salaries, examination delays)
  - **Low**: 45 Days (e.g. Hostel infrastructure, campus amenities)
- **Automated Escalation Protocol Engine**:
  - Recommends formal AICTE show-cause notices.
  - Recommends surprise physical or virtual regional office inspections.
  - Interactive "Escalate" action triggers formal notice in the case audit timeline.

### 7. 📈 Interactive Analytics & Business Intelligence
- Real-time Recharts visualizations that update dynamically when filters change:
  - **Status Breakdown**: Multi-color donut chart.
  - **Workload by Bureau**: Grouped bar chart comparing Pending vs Resolved.
  - **Monthly Intake vs Disposal Velocity**: Dual-area chart tracking throughput.
  - **Turnaround Days Comparison**: Horizontal bar chart comparing actual resolution days against statutory SLA targets.

### 8. 🔍 Complaint Tracking & Milestone Stepper
- Fast public-style verification by Complaint ID or Reference Token (`TRK-XXXXXX`).
- 6-stage visual milestone stepper highlighting current active stage with pulse animation.

### 9. 🖨️ Statutory Printable Reports
- Executive complaint summary docket formatted for printing (`Ctrl + P` / `Cmd + P`).
- Includes official AICTE letterhead, executive KPIs, bureau performance ledger, and official sign-off block.

### 10. 🔔 Incident Notifications & Audit Stream
- Real-time notification bell with unread count badge.
- Event categories: New Ingestion, Officer Assignment, Status Transition, Overdue Alert, and Duplicate Flag.

### 11. 🔄 Factory Reset & Sandbox Controls
- Prominent **"Reset Demo Data"** button to restore the 32+ original sample cases, clear demo notes, and reset SLA benchmarks at any time.

---

## 🔒 Security, Compliance & Data Privacy

1. **Synthetic Data Only**: All institution names (e.g., *Apex Institute Pune*, *Vidyapeeth Polytechnic Bengaluru*), complainant identities, and case details are synthetic data designed for SIH 2026. No real citizen PII is used.
2. **Zero Hardcoded Secrets**: No secret keys, database credentials, or server tokens are present in client code.
3. **Enterprise Role-Based Access**: Demonstrates authorization separation; real production deployments interface with National Informatics Centre (NIC) Single Sign-On (Jan Parichay) and OAuth2.0 / OIDC.

---

## 💻 Execution & Setup Guide

### 🚀 Instant Launch (Zero Installation Required)
This project is packaged cleanly with **under 100 files** (exactly 61 files) and can be run immediately:

1. **One-Click Launcher (Windows)**:
   Double-click [`start_website.bat`](file:///c:/Users/bhada/OneDrive/Desktop/SIH/start_website.bat) to immediately launch the dashboard in your default browser.

2. **Direct Browser Open (Offline)**:
   Simply double-click [`standalone.html`](file:///c:/Users/bhada/OneDrive/Desktop/SIH/standalone.html) in Google Chrome, Microsoft Edge, Firefox, or Brave. All interactive features, dashboards, analytics charts, and personas work 100% offline with zero server required!

---

### 🛠️ Developer Mode (Node.js & Vite)

If you wish to edit source code and run the Vite live reload server:

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🏆 Smart India Hackathon Presentation Guide

When demonstrating to SIH judges:
1. **Showcase the Dashboard:** Note the official Indian Government aesthetic, live IST clock, and the 6 dynamic KPI counters.
2. **Demonstrate Complaint Management:** Search for `"Apex"`, filter by Priority `"Urgent"`, and export the filtered list to CSV.
3. **Open the Case Dossier:** Click `"View Details"` on `AICTE-2026-B101`. Walk through the *Activity Audit Trail*, log a confidential internal note, and test a valid status transition with confirmation.
4. **Highlight Smart Duplicate Detection:** Open the *Duplicate Detection* tab, explain the transparent multi-factor scoring (PID + Category + Semantic tokens), and click *"Confirm Duplicate"*.
5. **Showcase Delay & SLA Monitoring:** Open *Delay Monitor*, show overdue cases, explain the escalation recommendation, and click *"Escalate"*.
6. **Review Reports:** Open *Reports*, demonstrate the date filter, and show the clean *Print Official Report* layout.
7. **Reset Anytime:** Click *"Reset Demo"* to return to pristine baseline state.

---

**Developed for Smart India Hackathon 2026 • Problem Statement SIH26264**
*Integrated Portal for Technical Education Grievance Governance*
