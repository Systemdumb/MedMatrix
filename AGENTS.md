# AGENTS.md — MedMatrix Agent Guidelines

## Core Directives for Antigravity AI Agents

1. **Software-First & Modular**:
   - Software intelligence is primary. Hardware (ESP32 pill dispenser) is an optional evidence source.
   - Keep modules decoupled: Data Store -> Event Layer -> Pattern Engine -> Barrier Identification -> Intervention Selection -> Learning Engine -> UI.

2. **Core Philosophy**:
   - The central loop must always be:
     `DETECT` → `UNDERSTAND` → `INTERVENE` → `LEARN`
   - Move beyond generic reminders ("Medicine missed"). Always attempt to answer:
     1. WHAT happened?
     2. WHY might it have happened?
     3. WHAT should we do?
     4. DID the intervention work?

3. **Medical Safety & Terminology**:
   - Never present system inferences as clinical diagnoses or medical facts.
   - Never alter dosages, prescriptions, or clinical treatment plans.
   - Use correct terminology: `Probable barrier`, `Adherence pattern`, `Adherence evidence`, `Medium confidence`.

4. **Indian Market Design Principles**:
   - Patient accessibility first: large touch targets, minimal text, Hindi + English support, voice prompt simulation.
   - Actionable caregiver notifications: do not just state non-adherence; provide probable reasons and recommended actions (e.g. check refill).

5. **Demo Reliability (Sept 18, 2026 Demo)**:
   - Provide a 1-click interactive demo scenario player covering the 6 core scenarios:
     1. Normal Adherence
     2. Evening Forgetfulness + Multilingual Voice Intervention
     3. Supply Depletion / Availability Barrier
     4. Device Dispensing Failure Safeguard
     5. Intervention Failure & Adaptation
     6. Offline Queueing & Reconnect Sync
