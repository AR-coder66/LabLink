# LabLink — AI-Powered Campus Laboratory Resource Platform

> **"One Campus. Infinite Possibilities. Shared Resources."**

LabLink connects students, faculty supervisors, and laboratory administrators across universities to discover specialized equipment, reserve time slots, resolve scheduling overlaps with deterministic AI arbitration, and verify physical equipment check-ins via digital QR passes.

---

## 🚀 Live Demo & Access

The application is running live at:
**[http://localhost:5173](http://localhost:5173)**

### Pre-Configured Demo Accounts (Instant Role Switcher)

Switch between roles with one click in the top navigation bar:

| Role | Name | Department / Affiliation | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** *(Default)* | Aarav Sharma | Computer Science & AI | Browse equipment, reserve slots, ask "Find My Lab" AI, view digital QR check-in passes, track project approval progress. |
| **Student (Team Beta)** | Priya Venkatesh | Robotics & Automation | Competitor in active H100 GPU contention showcase; tests multi-user arbitration. |
| **Faculty** | Dr. Evelyn Reed | Computer Science & Eng. | Review incoming student requests, inspect AI conflict recommendations, approve/reject/override schedules. |
| **Lab Administrator** | Marcus Vance | Central Lab Operations | Equipment commissioning, status toggling, maintenance pipeline, utilization charts, fairness meter. |

---

## 🌟 Signature Features Implemented

### 1. 🧠 LabLink AI Conflict Resolver (Deterministic Priority Engine)
When two or more student teams request overlapping time windows for the same specialized equipment (e.g. *NVIDIA HGX H100 80GB AI Supernode* on Nov 24, 10:00 AM – 1:00 PM):
- **7-Parameter Deterministic Scoring:**
  - Submission deadline urgency (up to 40 pts)
  - Academic milestone criticality (Capstone Final Year = 25 pts)
  - Historical fairness usage meter (fewer past compute hours = up to 20 pts)
  - Specific architectural requirement (e.g. 80GB VRAM vs 48GB = 10 pts)
- **Natural Language Arbitration:** AI explains why Team Alpha received priority (score 92.4 vs 84.1).
- **Zero-Waste Alternative Slot Generation:** Automatically maps Team Beta to an open slot on the compatible *Dell Precision RTX 6000 Ada Workstation* or a later window on the H100.
- **Faculty Audit & Manual Override:** Faculty can enforce or override the AI decision with a recorded academic justification.

### 2. 🤖 "Find My Lab" Natural Language Assistant
- Translates project descriptions in plain English (e.g., *"I want to build an AI-powered autonomous robot with vision"*) into:
  - Technical requirements breakdown
  - Recommended campus laboratories
  - Matched hardware units with 1-click booking actions
  - Step-by-step phased execution schedule

### 3. 🔬 Comprehensive Equipment Marketplace
- **16 verified laboratory instruments** across **8 campus departments**:
  - NVIDIA HGX H100 80GB AI Supernode
  - KUKA KR 6 R900 6-Axis Industrial Arm
  - Formlabs Form 3L SLA 3D Printer
  - Keysight MXA 26.5 GHz Signal Analyzer
  - NVIDIA Jetson AGX Orin 64GB Developer Kit
  - NI Ettus USRP X310 Software Defined Radio
  - Haas Mini Mill 3-Axis CNC Machining Center
  - Dell Precision 7960 Dual RTX 6000 Ada Workstation
  - Unitree Go2 Pro Quadruped Robotic Research Platform
  - Markforged X7 Continuous Carbon Fiber 3D Printer
  - TI C2000 Delfino Dual-Core Motor Control Rack
  - Applied Biosystems QuantStudio 5 Real-Time PCR
  - MultiTech LoRaWAN IP67 Environmental Gateway
  - Universal Robots UR5e Cobot with 3D Vision
  - Google Coral & Edge TPU Distributed Acceleration Board
  - Instron 5969 50 kN Dual-Column Tensile Tester
- Filter by category, department, availability, and sort by popularity/duration.

### 4. 📲 Digital QR Code Check-In
- Approved reservations automatically produce cryptographically tagged digital QR passes (`LL-PASS-<booking_id>-<resource_id>`).
- Interactive simulator validates token authenticity upon laboratory arrival.

### 5. 📊 Analytics, Maintenance & Campus Equity Meter
- **Recharts Data Visualizations:** Most-utilized equipment, weekly laboratory occupancy, and department inventory spread.
- **Fairness Meter:** Real-time distribution ratio to prevent department monopolization.
- **Preventative Maintenance Reporting:** Student fault logging and automated status locks.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (Midnight Navy `#0B1020`, Electric Blue `#527BFF`, Vibrant Violet `#9875FF`, Emerald `#10B981`)
- **Icons:** Lucide React
- **Visualizations:** Recharts
- **QR Utilities:** `qrcode` & `canvas-confetti`
- **State Management:** Reactive LocalStorage persistent store with instant reset capability

