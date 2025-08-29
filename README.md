# API Monetization Platform PoC

## Overview

This is a PoC for monetizing APIs with three models: Pay-Per-Use, Bundle Discounts, and Event-Based Charging.

## Setup

1. Install dependencies: `npm install`
2. Start MongoDB.
3. Seed demo data: `node simulations/demoClients.js`
4. Run: `npm start`

## Endpoints

### Client Management

-   `POST /clients/create` - Create a new client
-   `GET /clients/:id` - Get client details

### Subscription Management

-   `POST /subscriptions/subscribe` - Subscribe to a plan

### API Usage

-   `GET /api/getData` - Simulate data retrieval
-   `GET /api/getData2` - Simulate data posting

### Billing

-   `GET /billing/invoice/:clientId/:month` - Generate monthly invoice

## API Examples

### Create Client

```bash
curl -X POST http://localhost:3000/clients/create \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Subscribe to Bundle

```bash
curl -X POST http://localhost:3000/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "CLIENT_ID",
    "type": "bundle",
    "details": { "bundleId": "BUNDLE_ID" }
  }'
```

### Call API (with billing)

```bash
curl -X GET http://localhost:3000/api/getData \
  -H "client-id: CLIENT_ID"
```

### Generate Invoice

```bash
curl -X GET http://localhost:3000/billing/invoice/CLIENT_ID/2024-10
```

## Workflow

1. Create clients and APIs.
2. Subscribe clients to plans.
3. Simulate API usage.
4. Generate invoices.

## Error Codes

-   `400` - Bad Request (missing/invalid parameters)
-   `404` - Not Found (client/bundle/event not found)
-   `409` - Conflict (duplicate email/subscription)
-   `500` - Internal Server Error

## Data Models

### Client

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"subscriptions": ["subscription_id"]
}
```

### Subscription Types

-   **payPerUse**: Standard per-call billing
-   **bundle**: Volume discounts after threshold
-   **event**: Fixed-price for complex workflows

## Testing

1. Start the server: `npm start`
2. Create a client
3. Subscribe to a plan
4. Make API calls with client-id header
5. Generate monthly invoice
