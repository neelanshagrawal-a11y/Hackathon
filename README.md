# Trainer-Member PT Authorization Model

## Problem Statement

Many gyms and fitness centers struggle with unauthorized personal training (PT) sessions.
In some cases, a trainer conducts a PT session for a member without officially recording it in the system. This creates two major problems:

1. The gym loses revenue because the session is not billed through the official platform.
2. The trainer can collect the payment privately, outside the authorized process.

This project aims to build a system that creates a transparent, trackable, and verifiable interaction flow between the user and the trainer so that every PT session is properly authorized, recorded, and auditable.

## Product Goal

Build a PT governance model that ensures:

- every PT session is requested or scheduled through the system
- every session is accepted by an authorized trainer
- every session is verified by both member and trainer
- every completed session is linked to payment or package usage
- suspicious or unauthorized trainer behavior can be detected early
- gym revenue leakage is measurable and preventable
- operations teams can take action on suspicious cases quickly

## Business Model

This system is not just a booking tool. It is an authorization, revenue-protection, and audit layer for personal training operations.

### Business Objective

The gym earns revenue from PT services through:

- PT packages purchased by members
- one-off PT sessions
- trainer-led premium programs that should be billed officially

The business loses revenue when trainer effort happens, but the session is not captured in the official system.

### What The Product Protects

The product should protect three things:

1. Revenue
   Every delivered PT session should map to a package deduction, invoice, or approved free session.

2. Compliance
   Only authorized trainers should be allowed to deliver PT sessions.

3. Trust
   Members, trainers, and admins should all see the same source of truth for session activity.

### Primary Business Questions

The model should help answer:

- how many PT sessions were officially booked?
- how many were actually attended?
- how many were completed and verified?
- how many consumed a paid entitlement?
- which trainers show signs of unofficial PT activity?
- what is the estimated revenue leakage by branch, trainer, and period?

## Core Stakeholders

### 1. Member / User

The gym customer who wants to book or attend a PT session.

### 2. Trainer

The fitness trainer who conducts the PT session.

### 3. Gym Admin / Management

The authority responsible for approving trainers, monitoring sessions, handling billing, and detecting fraud.

## Core Problem We Are Solving

The fraud pattern looks like this:

1. A member interacts directly with a trainer.
2. A PT session happens outside the official system.
3. The trainer does not "punch" or register the session in the platform.
4. The trainer collects the money personally.
5. The gym has no official record of the service.

Because of this, the platform needs to make session creation, attendance, completion, and payment tightly connected.

## Proposed Product Direction

We will build a PT session authorization and tracking model where each session goes through a controlled lifecycle.

### Session Lifecycle

1. Request
   The member requests a PT session from the app or the admin schedules it.

2. Assignment
   The session is assigned only to an approved trainer.

3. Confirmation
   The trainer confirms availability and the member receives confirmation.

4. Check-in / Punch
   At session start, the trainer and member both validate attendance.
   This could later happen using a QR code, OTP, geolocation, NFC, or front-desk verification.

5. Completion
   After the session, both sides confirm that the PT session happened.

6. Billing / Package Deduction
   The system automatically deducts from a PT package or marks the payment as due/paid.

7. Audit
   The admin can review missing punches, mismatched confirmations, unusual trainer activity, and unbilled sessions.

## Business Workflow

The workflow below describes the official path a PT session must follow.

### 1. Eligibility

- member must have an active membership
- member must have a valid PT entitlement or approved payment flow
- trainer must be authorized to deliver PT
- trainer must belong to the correct branch, shift, or operating scope

### 2. Session Creation

- session is created by member, admin, or approved staff workflow
- booking gets a unique booking ID
- booking is tied to branch, trainer, member, and time slot

### 3. Trainer Acceptance

- trainer accepts or is assigned the session
- assignment event is logged
- any reassignment is also logged

### 4. Session Validation

- trainer starts session through official flow
- member validates attendance through check-in, OTP, QR, or another approved method
- system records time, actor, and verification mode

### 5. Session Completion

- trainer marks session complete
- member confirms the session happened
- system verifies whether completion is valid against booking and check-in status

### 6. Financial Closure

- package session is deducted, or
- invoice/payment is linked, or
- approved exception is recorded

### 7. Audit And Risk Review

- suspicious sessions are flagged
- missing links between booking, attendance, and payment are highlighted
- repeat offenders are visible at trainer and branch level

## Initial Interaction Model

### Member to Trainer Interaction

- member selects PT service
- member chooses preferred date and time
- system shows only authorized trainers
- trainer accepts or rejects the request
- confirmed session gets a unique booking ID

### Trainer to Session Interaction

- trainer views assigned sessions
- trainer starts the session through the platform
- trainer cannot mark completion without a valid booking
- trainer must complete required session checkpoints

### Member to Session Interaction

- member receives booking confirmation
- member checks in using booking ID / QR / OTP
- member confirms session completion
- member can report a session if it happened without official record

### Admin to Oversight Interaction

- admin approves trainers
- admin monitors booked vs completed sessions
- admin sees exceptions such as:
  - session completed without member confirmation
  - trainer activity outside assigned schedule
  - repeated cancellations followed by offline sessions
  - members training with trainers without bookings

## Entity Model

Below is the first conceptual model for the system.

### Core Entity Relationships

- one user can have many PT packages
- one user can have many PT bookings
- one trainer can handle many PT bookings
- one PT booking can have one or more validation events
- one PT booking can have one completion record
- one PT booking should link to one financial outcome
- one suspicious event can create one or more audit alerts

### Entities

#### User

- user_id
- name
- membership_id
- contact_details
- active_package
- home_branch
- membership_status

#### Trainer

- trainer_id
- name
- employee_id
- authorization_status
- specialization
- shift_schedule
- branch_id
- employment_type

#### PT Package

- package_id
- user_id
- total_sessions
- remaining_sessions
- validity_start
- validity_end
- payment_status
- package_type
- package_value

#### PT Booking

- booking_id
- user_id
- trainer_id
- session_date
- start_time
- end_time
- booking_status
- booking_source
- branch_id
- created_by
- service_type

#### Session Check-in

- checkin_id
- booking_id
- trainer_checkin_time
- member_checkin_time
- verification_method
- location_or_branch
- verification_status

#### Session Completion

- completion_id
- booking_id
- trainer_confirmation
- member_confirmation
- completion_time
- issue_flag
- completion_status

#### Financial Event

- financial_event_id
- booking_id
- package_id
- amount
- event_type
- payment_reference
- payment_status
- recorded_at

#### Audit / Fraud Alert

- alert_id
- booking_id
- trainer_id
- user_id
- alert_type
- risk_score
- status
- remarks

#### Operational Event Log

- event_id
- booking_id
- actor_type
- actor_id
- event_name
- event_time
- event_metadata

## Metrics Framework

We should define metrics in layers so the business can separate normal operations from revenue leakage.

### Session Metrics

- sessions_booked
- sessions_accepted
- sessions_started
- sessions_completed
- sessions_member_confirmed
- sessions_trainer_confirmed
- sessions_fully_verified
- sessions_cancelled
- sessions_no_show

### Trainer Metrics

- active_trainers
- authorized_trainers
- trainers_with_bookings
- trainers_with_completed_sessions
- trainer_session_completion_rate
- trainer_verification_gap_rate
- trainer_unbilled_session_rate
- trainer_risk_score

### Member Metrics

- members_with_pt_packages
- members_with_pt_bookings
- members_with_completed_pt_sessions
- members_with_unverified_sessions
- member_package_utilization_rate

### Revenue Metrics

- package_sessions_sold
- package_sessions_consumed
- paid_sessions_completed
- completed_sessions_without_financial_link
- estimated_revenue_leakage
- revenue_leakage_by_trainer
- revenue_leakage_by_branch

### Compliance Metrics

- sessions_without_booking
- sessions_without_member_confirmation
- sessions_without_trainer_confirmation
- sessions_without_package_or_payment
- sessions_by_unauthorized_trainers
- repeated_manual_override_count

## Metric Definitions To Finalize

These definitions need business input before they are treated as source-of-truth metrics:

### What Counts As A Session?

Options to finalize:

- booked session
- attended session
- completed session
- fully verified session

### What Counts As An Unauthorized PT?

Options to finalize:

- trainer delivered PT without booking
- booking exists but no payment/package linkage
- trainer is not authorized for PT at that branch
- member reports offline PT outside the system

### What Counts As Revenue Leakage?

Options to finalize:

- completed PT with no billing event
- trainer activity with no matching booking
- package usage mismatch
- member-trainer interaction outside approved flow

### What Is The Required Proof Of Attendance?

Options to finalize:

- trainer check-in only
- member check-in only
- both trainer and member confirmation
- OTP / QR / geolocation / front desk validation

## Fraud Detection Ideas

The model should eventually detect high-risk patterns such as:

- trainer has many member interactions but low official PT bookings
- members frequently confirm sessions that were never scheduled
- trainer check-ins happen without member check-ins
- repeated manual overrides by the same trainer or admin
- revenue mismatch between trainer activity and official PT sales
- sessions delivered by trainers outside assigned shift or branch
- high member repeat rate with a trainer but low official PT conversion
- members receiving PT despite having no package or invoice

## MVP Scope

For the first phase, we should build:

1. trainer and member profiles
2. PT booking flow
3. session check-in / punch flow
4. dual confirmation at completion
5. admin dashboard for suspicious activity
6. audit logs for every PT session event
7. revenue-linkage validation for every completed session

## Suggested System Rules

- no PT completion without an existing booking
- no trainer can take a PT session unless authorized by admin
- no session can be billed manually without traceable approval
- all status changes must be logged with timestamp and actor
- repeated violations should automatically trigger an alert

## Success Metrics

We will know this model is working if:

- unauthorized PT sessions are reduced
- session-to-payment matching improves
- gym revenue leakage decreases
- trainer accountability increases
- admin can detect suspicious activity quickly

## Inputs Needed From Business

To finalize the data model and future queries, we need answers for:

1. What is the official definition of a completed PT session?
2. Which systems currently record booking, punch, trainer assignment, and payment?
3. Is a member allowed to take PT without a package in any approved flow?
4. What proof is mandatory at session start and session completion?
5. How is trainer authorization managed today?
6. What should happen when a suspicious case is detected?

## Next Working Step

Once we have table/query access, we should map actual data sources to these entities:

- member master
- trainer master
- booking table
- attendance or punch events
- PT package sales and balances
- payments or invoices
- branch and shift mapping
- support or complaint signals

## Roadmap

### Phase 1

Define the business model, entities, and workflow.

### Phase 2

Design database schema and APIs for bookings, check-ins, confirmations, and alerts.

### Phase 3

Build member, trainer, and admin interfaces.

### Phase 4

Add fraud scoring, reporting, and operational dashboards.

## Next Step

The next logical step is to convert this business model into:

1. a database schema
2. API design
3. user flow wireframes
4. fraud detection rules engine

This project starts with trust, authorization, and auditability as the core design principles.
