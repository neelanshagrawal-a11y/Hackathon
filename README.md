# Trainer-Member PT Authorization Model

## Problem Statement

Many gyms and fitness centers struggle with unauthorized personal training (PT) sessions.
In some cases, a trainer conducts a PT session for a member without officially recording it in the system. This creates two major problems:

1. The gym loses revenue because the session is not billed through the official platform.
2. The trainer can collect the payment privately, outside the authorized process.

This project aims to build a system that creates a transparent, trackable, and verifiable interaction flow between the user and the trainer so that every PT session is properly authorized, recorded, and auditable.

## Goal

Build a model that ensures:

- every PT session is requested or scheduled through the system
- every session is accepted by an authorized trainer
- every session is verified by both member and trainer
- every completed session is linked to payment or package usage
- suspicious or unauthorized trainer behavior can be detected early

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

## First Data Model

Below is the first conceptual model for the system.

### Entities

#### User

- user_id
- name
- membership_id
- contact_details
- active_package

#### Trainer

- trainer_id
- name
- employee_id
- authorization_status
- specialization
- shift_schedule

#### PT Package

- package_id
- user_id
- total_sessions
- remaining_sessions
- validity_start
- validity_end
- payment_status

#### PT Booking

- booking_id
- user_id
- trainer_id
- session_date
- start_time
- end_time
- booking_status
- booking_source

#### Session Check-in

- checkin_id
- booking_id
- trainer_checkin_time
- member_checkin_time
- verification_method
- location_or_branch

#### Session Completion

- completion_id
- booking_id
- trainer_confirmation
- member_confirmation
- completion_time
- issue_flag

#### Audit / Fraud Alert

- alert_id
- booking_id
- trainer_id
- user_id
- alert_type
- risk_score
- status
- remarks

## Fraud Detection Ideas

The model should eventually detect high-risk patterns such as:

- trainer has many member interactions but low official PT bookings
- members frequently confirm sessions that were never scheduled
- trainer check-ins happen without member check-ins
- repeated manual overrides by the same trainer or admin
- revenue mismatch between trainer activity and official PT sales

## MVP Scope

For the first phase, we should build:

1. trainer and member profiles
2. PT booking flow
3. session check-in / punch flow
4. dual confirmation at completion
5. admin dashboard for suspicious activity
6. audit logs for every PT session event

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

The README completes the modelling foundation.
The next logical step is to convert this conceptual model into:

1. a database schema
2. API design
3. user flow wireframes
4. fraud detection rules engine

This project starts with trust, authorization, and auditability as the core design principles.
