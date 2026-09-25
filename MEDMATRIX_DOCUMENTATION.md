# MedMatrix — Technical System Architecture & Detailed Feature Documentation

## 1. Executive Summary

**MedMatrix** is an intelligent, software-first medication adherence management platform designed specifically for the Indian healthcare context. Unlike traditional reminder applications that merely send static push notifications, MedMatrix implements a closed-loop adherence intelligence framework:

$$\text{DETECT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{INTERVENE} \longrightarrow \text{LEARN}$$

### Key Architectural Pillars
- **Software-First & Modular**: The software intelligence layer operates autonomously, accepting hardware telemetry (ESP32 pill dispensers) as an optional evidence source.
- **Medical Safety Guardrails**: Strictly avoids clinical diagnoses, treatment advice, or autonomous dosage changes. Never claims swallowing or ingestion confirmation; uses precise terminology like *"Dose dispensed"* and *"Dose collected"*.
- **Indian Market Accessibility**: Dual-language support (English & हिंदी), large touch-target patient action buttons, and actionable caregiver notifications.
- **Explainable Rule-Based Logic**: Uses deterministic, explainable rule-based inference without opaque AI models, ensuring 100% demo reliability.

---

## 2. Core Modules & Engine Specifications

### 2.1. Medication Event Engine (`src/services/EventStateMachine.ts`)
Manages the finite state machine lifecycle for medication intake events.

- **Supported States**:
  - `SCHEDULED`: Initial state created from prescription schedule.
  - `READY`: Compartment unlocked / dose ready for intake.
  - `DISPENSING`: Dispensing motor sequence initiated.
  - `DISPENSED`: Pill release verified by optical sensor.
  - `COLLECTED`: Cup/compartment removal registered by proximity sensor or patient tap.
  - `COMPLETED`: Terminal successful state for confirmed intake.
  - `DELAYED`: Dose uncollected past 30-minute grace window.
  - `MISSED`: Dose uncollected past 60-minute window.
  - `FAILED`: Device dispensing malfunction (e.g. motor jam / optical sensor failure).
  - `UNCERTAIN`: Ambiguous or conflicting sensor signal requiring follow-up.

- **Evidence & Confidence Matrix**:
  - Evidence sources: `schedule`, `dispensing`, `collection`, `patient confirmation`, `sensor`, `device failure`, `unknown`.
  - Confidence assignment:
    - `HIGH`: Confirmed by both sensor telemetry and patient action.
    - `MEDIUM`: Confirmed by single source or schedule match.
    - `LOW`: Hardware fault or ambiguous sensor signal.

---

### 2.2. Adherence Intelligence Engine (`src/services/AdherenceAnalyticsEngine.ts`)
Calculates quantitative metrics and behavioral patterns from event history.

- **Calculated Metrics**:
  - Total Scheduled Doses, Completed Events Count, Delayed Count, Missed Count.
  - Device Failure Count & Uncertain Event Count.
  - Overall Adherence Percentage, Weekday vs. Weekend Adherence Percentage.
  - Time-of-Day Window Breakdown: Morning (06:00-12:00), Afternoon (12:00-17:00), Evening (17:00-21:00), Night (21:00-06:00).
  - 7-Day Trend Line & Timing Consistency (average delay in minutes).

- **Critical Medical Safeguards**:
  - **Safeguard 1 (Hardware Fault Exemption)**: Device dispensing failures (`FAILED`) are explicitly excluded from the patient adherence penalty denominator:
    $$\text{Evaluated Doses} = \text{Total Scheduled} - \text{Device Failures} - \text{Uncertain Events}$$
  - **Safeguard 2 (Uncertain Event Isolation)**: Inconclusive sensor signals are isolated as `UNCERTAIN` for verification rather than marked missed.

---

### 2.3. Adherence Barrier Identification Engine (`src/services/BarrierIdentificationEngine.ts`)
Infers probable root causes of non-adherence using explainable rule-based pattern evaluation.

- **Supported Barrier Categories**:
  - `forgetfulness`
  - `schedule_disruption`
  - `medication_complexity`
  - `intentional_non_adherence`
  - `side_effect_concern`
  - `medication_availability`
  - `affordability`
  - `lack_of_understanding`
  - `travel_or_routine_disruption`
  - `caregiver_support`
  - `device_failure`
  - `unknown`

- **Inference Rules**:
  - **Rule 1 (Refill Barrier)**: Remaining inventory stock $\le$ refill threshold or stock == 0 $\rightarrow$ `medication_availability` (Confidence: HIGH).
  - **Rule 2 (Hardware Dispensing Failure)**: Optical sensor failure or `FAILED` state $\rightarrow$ `device_failure` (Source: `HARDWARE_SENSOR`, Confidence: HIGH).
  - **Rule 3 (Evening Forgetfulness)**: $\ge 2$ uncollected doses during 17:00-22:00 window $\rightarrow$ `forgetfulness` (Confidence: HIGH for $\ge 3$).
  - **Rule 4 (Weekend Routine Shift)**: High weekday adherence ($>80\%$) with $\ge 2$ weekend misses $\rightarrow$ `schedule_disruption` (Confidence: MEDIUM).
  - **Rule 5 (Medication-Specific Barrier)**: Isolated single prescription miss rate $>50\%$ while other meds maintain $>70\%$ adherence $\rightarrow$ `medication_complexity` / `side_effect_concern`.

- **Safety Terminology Enforcement**:
  - Mandatory prefixes: *"Probable barrier"*, *"Detected pattern"*, *"Patient-confirmed"*.

---

### 2.4. Personalized Intervention Selection Engine (`src/services/PersonalizedInterventionEngine.ts`)
Selects tailored behavioral interventions and generates human-readable explanations.

- **12 Supported Intervention Types**:
  1. `standard_reminder`: Mobile push notification text.
  2. `voice_reminder`: English personalized audio prompt.
  3. `local_language_reminder`: Multilingual Hindi voice prompt.
  4. `schedule_aware_reminder`: Shifted timing prompt aligned with weekend routine.
  5. `education_prompt`: Simple chronic illness education context.
  6. `side_effect_check_in`: Symptom check-in prompt.
  7. `refill_reminder`: Pharmacy refill notice & caregiver alert.
  8. `caregiver_notification`: Actionable caregiver check-in notice.
  9. `caregiver_escalation`: High-priority caregiver phone alert.
  10. `device_troubleshooting`: Technical hardware inspection alert.
  11. `follow_up_prompt`: Post-delay check-in.
  12. `no_immediate_intervention`: Maintenance state.

- **Explainable Rationale (`reason`)**:
  - Every recommendation includes an explicit string detailing **WHY** it was selected (e.g. *"Selected Multilingual Hindi Voice Prompt because standard text reminders were unacknowledged during the dinner window, and history shows an 85% response rate to Hindi audio prompts."*).
- **Speech Synthesis Integration**:
  - Interactive **"Play Audio"** button utilizing `SpeechSynthesisUtterance` (`hi-IN`) for real-time audio playback.

---

### 2.5. Intervention Learning Engine (`src/services/InterventionLearningEngine.ts`)
Evaluates behavioral response feedback to dynamically update intervention strategy preferences.

- **Deterministic Response Evaluation**:
  - `responded` + `COMPLETED` dose $\longrightarrow$ **Successful** ($100\%$ effectiveness).
  - `delayed_response` + `COMPLETED` dose $\longrightarrow$ **Partially Successful** ($75\%$ effectiveness).
  - `no_response` or `MISSED` dose $\longrightarrow$ **Unsuccessful** ($0\%$ effectiveness).
- **Patient Preference Profile Generation**:
  - `effectiveInterventions`: High-response strategies ($\ge 70\%$ success rate).
  - `lowResponseInterventions`: De-prioritized strategies ($< 50\%$ success rate).
  - `contextualPreferences`: Preferred intervention by medication and time window context.
- **Non-Clinical Disclaimers**: Prominently labeled as *"Adaptive intervention learning"* / *"Prototype behavioral learning"*.

---

### 2.6. Hardware Integration Boundary (`src/services/hardware/HardwareEventAdapter.ts`)
Decouples application logic from specific ESP32 physical hardware or microcontroller pinouts.

- **Adapter Interface (`HardwareEventAdapter`)**:
  - Standardized methods for `connect()`, `disconnect()`, `onHardwareSignal()`, `simulateSignal()`, and `getQueuedSignalsCount()`.
- **Raw Telemetry Signals**:
  - `DISPENSE_SUCCESS`, `COLLECTION_SUCCESS`, `DISPENSE_FAILURE`, `SENSOR_CONFLICT`, `DOOR_OPENED`, `DOOR_CLOSED`, `DEVICE_OFFLINE`, `DEVICE_RECONNECTED`.
- **Offline Telemetry Queueing**:
  - When `DEVICE_OFFLINE` occurs, signals are buffered in an offline queue. Upon `DEVICE_RECONNECTED`, queued events are batch-synced into the event pipeline without data loss.

---

### 2.7. Indian Market Context & Caregiver Dashboard (`src/pages/CaregiverPage.tsx`, `PatientActionPanel.tsx`)

- **Bilingual Interface**: Toggle between **English** and **हिंदी (Hindi)**.
- **5 Accessible Patient Action Buttons**:
  1. `"Medicine taken"` / `"दवा ले ली"` (Emerald Button) $\rightarrow$ Confirms dose intake.
  2. `"Remind me later"` / `"मुझे बाद में याद दिलाएं"` (Amber Button) $\rightarrow$ Logs 30-min delay.
  3. `"I don't have this medicine"` / `"मेरे पास यह दवा नहीं है"` (Orange Button) $\rightarrow$ Triggers refill alert.
  4. `"I'm having a problem"` / `"मुझे कोई समस्या हो रही है"` (Purple Button) $\rightarrow$ Logs side-effect check-in.
  5. `"I need help"` / `"मुझे सहायता चाहिए"` (Rose Button) $\rightarrow$ Triggers immediate caregiver escalation.

- **Non-Generic Caregiver Notifications**:
  - Instead of *"Patient missed dose"* $\rightarrow$ **Enforced**: `"Evening dose has not been confirmed."`
  - Low stock alert $\rightarrow$ **Enforced**: `"Medication supply may require refill."`
  - Sensor fault alert $\rightarrow$ **Enforced**: `"Medication dispensing could not be verified. Patient non-adherence has not been concluded."`
- **Simulated Caregiver Escalation**: Interactive modal previewing simulated SMS & WhatsApp alert payloads (`"[MedMatrix Alert] Dear Ananya Sharma..."`).

---

### 2.8. 1-Click Interactive Hackathon Demo Player (`src/pages/DemoPage.tsx` & `ScenarioPipelineRunner.ts`)
Optimized for a 3–5 minute presentation to hackathon judges.

- **6 Pre-Configured Core Demonstration Scenarios**:
  1. `SUCCESSFUL DOSE`: Normal intake on schedule $\rightarrow$ $100\%$ adherence.
  2. `FORGETFULNESS`: 3 missed evening doses $\rightarrow$ Hindi Voice Prompt.
  3. `REFILL ISSUE`: Stock drops to 4 tablets $\rightarrow$ Refill alert.
  4. `DEVICE FAILURE`: Optical sensor fault $\rightarrow$ Excluded from adherence penalty.
  5. `INTERVENTION FAILURE`: Text reminder fails $\rightarrow$ Adaptive learning promotes voice prompt.
  6. `OFFLINE MODE`: Device drops offline, queues event, reconnects, and batch-syncs.

- **Prominent MedMatrix Intelligence Panel**:
  Renders live dynamic answers to the 4 core product questions:
  - **WHAT HAPPENED?**
  - **WHY MIGHT IT BE HAPPENING?** (Observed Pattern & Probable Barrier)
  - **WHAT SHOULD WE DO?** (Recommended Intervention & Rationale)
  - **DID IT WORK?** (Previous Response & Next Evaluated Action)

---

## 3. Application Routing Sitemap

The application includes 11 fully configured routes accessible via persistent sidebar, header search, and mobile navigation:

| Route Path | Page Title | Core Purpose |
| :--- | :--- | :--- |
| `/dashboard` | Home (Patient Overview) | Main overview featuring greeting, today's dose summary, next medicine card, natural language insight, and timeline. |
| `/medications` | My Medications | Prescription cards with adherence %, dosage, scheduled times, food instructions, and Medication Detail modal with tabs. |
| `/schedule` | Medication Schedule | Interactive daily & weekly schedule calendar with intake confirmation controls. |
| `/adherence` | My Adherence | Analytics breakdown with tabs (Overview, Trends, Patterns, Medication Comparison) and Recharts. |
| `/barriers` | Why Doses May Be Missed | Probable barrier cards, safe probabilistic wording, and progressive disclosure evidence drawers. |
| `/interventions` | Personalized Support | Active intervention strategy, rationale, voice audio prompt player, and adaptive learning summary. |
| `/patient` | My Profile | Patient demographics, chronic conditions tags, adherence fingerprint, and preferences. |
| `/caregiver` | Family Support | Registered family caregiver contact card, today's adherence summary, and urgent actionable alerts. |
| `/device` | My Device | Smart dispenser connection status, battery level, optical/door sensor checks, and offline queue indicator. |
| `/demo` | Demo Scenario Runner | SIH demonstration player running 6 core scenarios live through all 5 engines. |
| `/settings` | Settings | Language toggle (English / Hindi), sound & voice reminder preferences, device status, and demo data reset. |

---

## 4. Verification & Testing Metrics

### 4.1. Unit Test Runner Results (`npx tsx src/testRunner.ts`)
All 56 engine unit tests pass cleanly:
- `✓ EventStateMachine Unit Tests`: 10/10 Passed
- `✓ AdherenceAnalyticsEngine Unit Tests`: 7/7 Passed
- `✓ BarrierIdentificationEngine Unit Tests`: 7/7 Passed
- `✓ PersonalizedInterventionEngine Unit Tests`: 6/6 Passed
- `✓ InterventionLearningEngine Unit Tests`: 5/5 Passed
- `✓ CaregiverNotification Wording Unit Tests`: 4/4 Passed
- `✓ HardwareEventAdapter Unit Tests`: 9/9 Passed
- `✓ ScenarioPipelineRunner Unit Tests`: 8/8 Passed

### 4.2. Static Type Check (`npx tsc --noEmit`)
- **Status**: `0` errors.

### 4.3. Production Build (`npm run build`)
- **Status**: Production bundle generated in `dist/` in `9.27s`.
- **Active Dev Server**: Served locally at `http://localhost:5173/`.

