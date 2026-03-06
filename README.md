# Awareways Assignment

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

Docker Compose is the intended way to run this project for review. Local setup is possible, but Docker is the main path.

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

The request is rejected, not stored, and logged to the ingestion channel.

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

The sidebar user picker uses `/api/users`, supports search, and always includes a `Create User` action. If no user is selected, both the dashboard and ingest pages explain how to create one or choose an existing one.

## Project Structure Overview

### API

The Laravel API is split into these layers:

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

The React UI follows the same structure:

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

The assignment is based on activity events, so the data model follows the same shape.

The core table stores:

- `id`
- `user_id`
- `event_type`
- `occurred_at`
- `payload`
- `ingested_at`

This keeps the write model close to the events coming into the system. It also keeps the records flexible enough to support different event types and payloads.

There is also a dedicated `activity_users` directory. This keeps user selection and creation separate from raw activity data, and it avoids building the user list from existing events.

### Why SQLite

SQLite fits the assignment well because it is:

- fast to bootstrap
- no external database dependency
- migration-friendly
- sufficient for local filtering, ordering, and basic aggregation

It keeps setup simple while still supporting the required queries.

### How Invalid or Dirty Data Is Handled

Invalid payloads are rejected during request validation.

Current behavior:

- validation failure returns `422`
- malformed ingestion payloads are logged
- invalid events are not persisted

Example rule:

- `points_scored` requires `payload.points >= 1`
- `user_id` must exist in `activity_users`

This keeps the stored event data consistent.

## Trade-offs

Some parts are intentionally simplified to fit the assignment timebox.

What was intentionally simplified:

- SQLite instead of a production-grade event or relational platform
- synchronous request/response ingestion
- direct reads from persisted events instead of dedicated read projections
- no auth or authorization
- no queues, workers, or event broker
- limited event type set tied to the assignment examples
- no broad automated test suite in the current submission state

The goal was to build a working end-to-end system with clear boundaries, not a production-ready platform.

## Production Vision

If this needed to process 5 million events a day continuously, the architecture would need to change.

The main change would be separating ingestion from query storage.

### Production-direction architecture

1. Ingestion API accepts and validates events.
2. Events are published to a broker or event log such as Kafka.
3. Consumers process the event stream asynchronously.
4. Consumers update read-optimized projections.
5. The dashboard API reads from those projections, not from the raw write stream.

### Why change it this way

At that scale, direct request-time writes and on-demand aggregation from the same store would not be enough.

The system would need:

- a durable event log
- idempotent ingestion
- partitioning by event key or user ID
- retry and dead-letter handling
- read-optimized projection stores
- observability and alerting
- horizontal scaling of stateless services

### Projections

The current assignment implementation calculates metrics directly from stored events.

A production version would likely maintain dedicated read models such as:

- user activity feed projection
- user metrics projection
- daily activity summary projection

That avoids recalculating dashboard values in multiple places and helps keep query speed predictable.

## Current Submission State

Implemented:

- API
- UI
- Docker Compose run flow
- clean architecture separation
- ingestion validation and logging
- dashboard metrics and timeline
- ingest response body viewer
