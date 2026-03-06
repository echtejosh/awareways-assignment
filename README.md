# Awareways Technical Assignment

This repository implements a small event ingestion and dashboard system for user activity.

The assignment asks for a way to bridge raw activity records and a final representation the Product team can consume. This implementation does that with:

- a Laravel API for ingestion and query access
- a React UI for dashboard and event creation
- a lightweight SQLite-backed persistence model
- a clean-architecture split in both API and UI layers

## Stack

- PHP 8.3
- Laravel 12
- SQLite
- React
- Vite
- TypeScript
- TanStack Query
- shadcn-based UI components
- Docker Compose

## What Is Implemented

- event ingestion via `POST /api/events`
- recent user activity via `GET /api/users/{user_id}/activities`
- user engagement metrics via `GET /api/users/{user_id}/metrics`
- user directory search via `GET /api/users`
- user creation via `POST /api/users`
- malformed-ingestion rejection with `422` response and logging
- dashboard UI with:
  - metric cards
  - activity timeline chart
  - recent activity table
- ingest UI with:
  - event form
  - API response body viewer
- shared user picker flow with:
  - searchable select-style user picker
  - create-user modal
  - empty-state guidance when no user is selected

Supported event types:

- `training_started`
- `progress_made`
- `points_scored`
- `training_completed`

## Run Instructions

### Docker

From the repository root:

```bash
docker compose up --build
```

Services:

- API: `http://127.0.0.1:8001`
- UI: `http://127.0.0.1:5173`

The API container automatically:

- installs Composer dependencies
- ensures `database/database.sqlite` exists
- runs migrations
- starts Laravel's dev server

The UI container automatically:

- installs npm dependencies
- starts the Vite dev server with HMR enabled

### Seed Demo Data

Demo data is not loaded automatically on `docker compose up`. If you want a seeded user and an initial event, run:

```bash
docker compose exec api php artisan db:seed --force
```

Seeded demo user ID:

```text
52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6
```

Useful URLs after seeding:

- `http://127.0.0.1:5173/dashboard?user_id=52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6`
- `http://127.0.0.1:5173/ingest?user_id=52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6`

### Local Development

The project is designed primarily around Docker Compose for this assignment. Local setup is still straightforward, but Docker is the intended reviewer path.

## Usage Examples

### 1. Search Available Users

```bash
curl "http://127.0.0.1:8001/api/users?search=52db&limit=10"
```

Example response:

```json
{
  "data": [
    {
      "id": "52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6",
      "name": "Seeded Demo User"
    }
  ],
  "meta": {
    "search": "52db",
    "limit": 10,
    "count": 1
  }
}
```

### 2. Create a User

```bash
curl -X POST "http://127.0.0.1:8001/api/users" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Planning Demo User\"
  }"
```

Example response:

```json
{
  "data": {
    "id": "b61e427d-ecf8-43c1-a4ba-381d6acee1d3",
    "name": "Planning Demo User"
  }
}
```

### 3. Ingest an Event

```bash
curl -X POST "http://127.0.0.1:8001/api/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6\",
    \"event_type\": \"points_scored\",
    \"occurred_at\": \"2026-03-06T10:15:00Z\",
    \"payload\": {
      \"points\": 25,
      \"reason\": \"quiz_bonus\"
    }
  }"
```

Example response:

```json
{
  "data": {
    "id": "8cf435f8-4e73-4303-a3f7-a28137cc4b2d",
    "user_id": "52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6",
    "event_type": "points_scored",
    "occurred_at": "2026-03-06T10:15:00+00:00",
    "payload": {
      "points": 25,
      "reason": "quiz_bonus"
    },
    "ingested_at": "2026-03-06T10:15:03+00:00"
  }
}
```

Note: `user_id` must exist in the user directory.

### 4. Ingest Invalid Data

Example invalid payload:

```bash
curl -X POST "http://127.0.0.1:8001/api/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6\",
    \"event_type\": \"points_scored\",
    \"occurred_at\": \"2026-03-06T10:15:00Z\",
    \"payload\": {}
  }"
```

Example response:

```json
{
  "message": "The payload.points field is required.",
  "errors": {
    "payload.points": [
      "The payload.points field is required."
    ]
  }
}
```

The request is rejected, not persisted, and logged to the dedicated ingestion log channel.

### 5. Get Recent Activities

```bash
curl "http://127.0.0.1:8001/api/users/52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6/activities?limit=20"
```

Example response:

```json
{
  "data": [
    {
      "id": "b2b96d7f-c5fd-49c4-a343-89ed7c15f4b8",
      "user_id": "52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6",
      "event_type": "training_started",
      "occurred_at": "2026-03-05T11:12:13+00:00",
      "payload": {
        "training_id": "seed-training-101"
      },
      "ingested_at": "2026-03-06T11:12:13+00:00"
    }
  ],
  "meta": {
    "user_id": "52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6",
    "limit": 20,
    "from": null,
    "to": null,
    "count": 1
  }
}
```

### 6. Get Engagement Metrics

```bash
curl "http://127.0.0.1:8001/api/users/52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6/metrics"
```

Example response shape:

```json
{
  "data": {
    "user_id": "52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6",
    "from": "2026-02-05T11:12:13+00:00",
    "to": "2026-03-06T11:12:13+00:00",
    "total_events": 1,
    "event_counts": {
      "training_started": 1,
      "progress_made": 0,
      "points_scored": 0,
      "training_completed": 0
    },
    "total_points": 0,
    "completed_trainings": 0,
    "started_trainings": 1,
    "progress_events": 0,
    "active_days": 1,
    "latest_activity": "2026-03-05T11:12:13+00:00"
  }
}
```

### 7. UI Flow

UI routes:

- `/dashboard?user_id=<uuid>`
- `/ingest?user_id=<uuid>`

The sidebar user picker queries `/api/users`, supports inline search, and always exposes a `Create User` action that opens the same modal used by the page-level empty states. When no user is selected, both the dashboard and ingest pages explain how to create a user first or select an existing one.

## Project Structure Overview

### API

The Laravel API is organized with a clean-architecture split:

- `api/app/Domain`
  - pure domain contracts, entities, enums, and value objects
- `api/app/Application`
  - use cases and input DTOs
- `api/app/Infrastructure`
  - Eloquent models and repository implementations
- `api/app/Http`
  - controllers, requests, and resources

Important files:

- `api/routes/api.php`
- `api/app/Application/Events/UseCases`
- `api/app/Domain/Events`
- `api/app/Infrastructure/Persistence/Eloquent/Repositories`
- `api/app/Http/Controllers/Api`

### UI

The React UI mirrors the same separation:

- `ui/src/domain`
  - entities, repository interfaces, value objects
- `ui/src/application`
  - use cases and query keys
- `ui/src/infrastructure`
  - HTTP repositories, DI container, fetch utilities
- `ui/src/features`
  - dashboard, ingest, and user-focused presentation logic
- `ui/src/components`
  - shared UI and layout components

Important files:

- `ui/src/app/router.tsx`
- `ui/src/features/dashboard`
- `ui/src/features/ingest`
- `ui/src/infrastructure/events/http/http-event-repository.ts`

## Engineering Decisions

### Why This Data Model

The assignment is event-oriented, so the data model is event-oriented as well.

The core table stores:

- `id`
- `user_id`
- `event_type`
- `occurred_at`
- `payload`
- `ingested_at`

This keeps the write model close to the incoming domain facts instead of prematurely over-modeling derived concepts. It also keeps the stored records flexible enough to support multiple event types with different payloads.

In addition to event storage, there is now a dedicated `activity_users` directory. That keeps user selection and creation separate from raw activity data, and it avoids deriving the selectable user list from whatever events happen to already exist.

### Why SQLite

SQLite is appropriate for the assignment constraints:

- fast to bootstrap
- no external database dependency
- migration-friendly
- sufficient for local filtering, ordering, and basic aggregation

For this assignment, it reduces setup friction without obscuring the core design choices.

### How Invalid or Dirty Data Is Handled

Invalid payloads are rejected at the API boundary.

Current behavior:

- validation failure returns `422`
- malformed ingestion payloads are logged
- invalid events are not persisted

Example rule:

- `points_scored` requires `payload.points >= 1`
- `user_id` must exist in `activity_users`

That keeps the stored event data queryable and consistent.

## Trade-offs

This implementation deliberately cuts scope to stay within the assignment timebox.

What was intentionally simplified:

- SQLite instead of a production-grade event or relational platform
- synchronous request/response ingestion
- direct reads from persisted events instead of dedicated read projections
- no auth or authorization
- no queues, workers, or event broker
- limited event type set tied to the assignment examples
- no broad automated test suite in the current submission state

The goal was to prioritize a working end-to-end system with clean boundaries over production completeness.

## Production Vision

If this had to process 5 million events a day continuously, the architecture would change materially.

The main shift would be separating ingestion from query storage.

### Production-direction architecture

1. Ingestion API accepts and validates events.
2. Events are published to a broker or event log such as Kafka.
3. Consumers process the event stream asynchronously.
4. Consumers update read-optimized projections.
5. The dashboard API reads from those projections, not from the raw write stream.

### Why change it this way

At that scale, direct request-time writes and on-demand aggregation from the same store are not the right shape.

The system would need:

- a durable event log
- idempotent ingestion
- partitioning by event key or user ID
- retry and dead-letter handling
- read-optimized projection stores
- observability and alerting
- horizontal scaling of stateless services

### Projections

The current assignment implementation computes metrics directly from persisted events.

A production version would likely maintain dedicated read models such as:

- user activity feed projection
- user metrics projection
- daily activity summary projection

That avoids recalculating dashboard values independently in multiple places and keeps query latency predictable.

## Current Submission State

Implemented:

- API
- UI
- Docker Compose run flow
- clean architecture separation
- ingestion validation and logging
- dashboard metrics and timeline
- ingest response body viewer

Still worth adding after this submission pass:

- formal automated API tests
- a clean submission checklist pass
- broader end-to-end smoke coverage
