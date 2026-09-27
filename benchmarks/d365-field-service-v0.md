# Benchmark 01 — Dynamics 365 Field Service

Status: Documentation-grounded baseline (v0)
Date: 2026-09-27
Purpose: Establish a real-product benchmark before live-tenant validation.

## Why this system

Dynamics 365 Field Service matches the proposed offer unusually well:
- enterprise system
- role-based operational workflows
- dispatcher + frontline handoffs
- scheduling, status, evidence and billing dependencies
- familiar domain for the founder
- commercially relevant to industrial / resources / service businesses

## Benchmark role

**Field Service Dispatcher / Service Coordinator**

Microsoft documents the Field Service - Dispatcher role as one of the security roles that can create work orders. Scheduling is also a dispatcher responsibility in the typical lifecycle.

## Three benchmark workflows

### 1. Create a work order

Official baseline:
1. Go to Field Service > Service area.
2. Open Scheduling > Work Orders.
3. Select New.
4. Provide the required business context.
5. Add optional tasks/products/services as needed.
6. Save, Save & Close, or Save & Book depending on process.

Key system/process concepts to teach:
- Service Account / service context
- Work Order Type
- Unscheduled system status
- Price List
- Tax handling where applicable
- service tasks, products and services
- service location hierarchy

Source:
https://learn.microsoft.com/en-us/dynamics365/field-service/create-work-order

### 2. Schedule a standard work order

Official baseline:
1. Review the generated resource requirement.
2. Confirm duration, location, date range and promise window.
3. Find the right resource using Schedule Assistant, Schedule Board, manual booking or Quick Scheduling.
4. Create a Bookable Resource Booking.
5. Confirm resource, start/end time, travel estimate and Scheduled status.

Key system/process concepts to teach:
- requirement vs booking
- availability
- skills/characteristics
- travel
- territory
- promise window
- booking status

Source:
https://learn.microsoft.com/en-us/dynamics365/field-service/scenario-normal-scheduling

### 3. Monitor booking progress and handoff

Official baseline:
Booking lifecycle:
Scheduled → Traveling → In Progress → Completed

Important behavior:
- booking status changes create timestamps
- Traveling / In Progress / Completed can update related work-order timing/status data
- all related bookings affect work-order completion state
- after field work, a supervisor/back-office role may review and eventually post the work order

Key concepts to teach:
- booking lifecycle
- work order lifecycle
- timestamps
- multiple bookings
- escalation / incomplete follow-up
- dispatcher vs technician vs supervisor responsibilities

Source:
https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status

## Adoption package target

For this benchmark, the final client-style package should contain:

1. Role + workflow blueprint
2. Fresh role-based user guide
3. Guided walkthrough for each workflow
4. Practice mode
5. Assessment mode
6. Job aid / quick reference
7. FAQ + common errors
8. Trainer / manager guide
9. Source traceability map
10. Version/change register

## Definition of Done

A learner should be able to:
- explain the difference between a work order, requirement and booking
- create a valid work order in the target process
- schedule the right resource against the requirement
- interpret booking lifecycle/status correctly
- know which actions belong to dispatcher, frontline worker and supervisor
- find help without relying on the SME sitting beside them

## Validation levels

### V0 — documentation-grounded
Current stage.
Uses current Microsoft Learn documentation to establish the canonical workflow and training structure.

### V1 — live tenant validated
Required before claiming this is client-ready Dynamics training.
Must use an actual Dynamics 365 Field Service tenant / trial / sandbox and confirm:
- current UI
- actual field labels
- role permissions
- required vs optional fields
- schedule-board behavior
- status transitions
- screenshots / recordings
- edge cases
- any customer-specific customizations

### V2 — client process validated
Requires:
- client tenant
- client SMEs
- configured security roles
- client-specific process / custom fields
- brand and terminology
- sign-off

## Measurement plan

Track during V1:
- time to understand system/workflow
- time spent by founder
- AI production time
- guide production time
- simulation build time
- QA defects
- hallucinations / unsupported statements
- SME corrections
- total tool cost
- repeatable asset percentage

These metrics determine whether the product can support an A$7.5k–10k solo pilot profitably.

## Current limitation

This file does **not** claim live-tenant verification. It is a source-grounded benchmark specification derived from current Microsoft documentation.