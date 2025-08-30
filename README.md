# API Monetization Platform PoC

## Overview

A Proof of Concept (PoC) for monetizing REST APIs with three flexible pricing models: **Pay-Per-Use**, **Bundle Discounts**, and **Event-Based Charging**. The platform enables API providers to implement sophisticated billing strategies while maintaining real-time usage tracking and automated invoicing.

### Key Features

-   🔄 **Multiple Pricing Models**: Pay-per-use, volume-based bundles, and event-driven pricing
-   📊 **Real-time Billing**: Automatic usage tracking and cost calculation
-   🎯 **Priority-based Resolution**: Intelligent plan selection based on subscription priorities
-   📈 **Volume Discounts**: Automatic discount application after usage thresholds
-   🧾 **Automated Invoicing**: Monthly invoice generation with detailed breakdowns
-   ⚡ **Rate Limiting**: Built-in protection against API abuse
-   🔒 **Middleware Validation**: Comprehensive request validation and error handling

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │────│   API Gateway   │────│  Billing Engine │
│                 │    │   (Express)     │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Usage Logger  │
                       │   & Invoicer    │
                       └─────────────────┘
```

### Core Components

-   **API Gateway**: Express.js server handling requests with rate limiting and validation
-   **Billing Engine**: MongoDB-based usage tracking and cost calculation
-   **Usage Logger**: Real-time API call logging with automatic pricing resolution
-   **Invoice Generator**: Monthly billing with discount calculations

## Technologies

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Validation**: Joi schema validation
-   **Security**: CORS, Rate Limiting (express-rate-limit)
-   **Environment**: dotenv for configuration management

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (v4.4 or higher)
-   npm or yarn

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd api-monetization-platform
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Configuration**

    Create a `.env` file in the root directory:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/api-monetization
    ```

4. **Start MongoDB**

    ```bash
    # Using local MongoDB
    mongod

    # Or using Docker
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    ```

5. **Seed Demo Data**

    ```bash
    node simulations/demoClients.js
    ```

6. **Start the Server**

    ```bash
    # Production mode
    npm start

    # Development mode (with auto-restart)
    npm run dev
    ```

The server will start on `http://localhost:3000`

## Project Structure

```
api-monetization-platform/
├── config/                 # Database and global configuration
├── constants/              # Application constants and pricing rules
├── controller/             # Route controllers
├── middleware/             # Custom middleware (validation, billing)
├── models/                 # Mongoose data models
├── routes/                 # API route definitions
├── services/               # Business logic services
├── simulations/            # Demo data seeding scripts
├── validation/             # Joi validation schemas
├── server.js              # Application entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## API Documentation

### Base URL

```
http://localhost:3000/api/v1/my_api
```

### Authentication

All monetized API calls require a `clientId` in the request body.

### Endpoints

#### Health Check

-   `GET /health` - Server health check

#### Client Management

-   `GET /clients/` - Get all clients
-   `POST /clients/` - Create a new client
-   `GET /clients/:id` - Get client details by ID

#### Subscription Management

-   `POST /subscriptions/subscribe` - Subscribe client to a pricing plan
-   `GET /subscriptions/` - Get all available subscriptions

#### API Usage (Monetized)

-   `GET /my_api/` - Get list of available APIs
-   `GET /my_api/getData` - Simulate data retrieval (monetized)
-   `GET /my_api/getData_2` - Simulate data posting (monetized)
-   `GET /my_api/getData_base` - Simulate base data retrieval (monetized)

#### Billing & Analytics

-   `GET /billing/?clientId=:clientId&month=:month` - Generate monthly invoice

## Pricing Models

### 1. Pay-Per-Use

-   **Description**: Standard per-API-call billing
-   **Cost**: $0.01 per API call (configurable)
-   **Use Case**: Simple, predictable pricing for basic API usage

### 2. Bundle Discounts

-   **Description**: Volume-based pricing with automatic discounts
-   **Base Price**: $0.05 per call initially
-   **Threshold**: 100,000 calls per month
-   **Discount**: 10% off after threshold
-   **Use Case**: High-volume clients requiring cost predictability

### 3. Event-Based Charging

-   **Description**: Fixed-price for complex workflows/events
-   **Cost**: $1.00 per event (configurable)
-   **Scope**: Covers multiple API calls within an event
-   **Use Case**: Complex operations with predictable resource usage

### Priority Resolution

When multiple subscriptions exist, the system applies the highest priority plan:

1. **Event** (Priority: 3) - Fixed pricing for complex workflows
2. **Bundle** (Priority: 2) - Volume discounts for high usage
3. **Pay-Per-Use** (Priority: 1) - Standard per-call billing

## Data Models

### Client

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"subscriptions": ["subscription_id_1", "subscription_id_2"]
}
```

### API

```json
{
	"name": "Data Retrieval API",
	"endpoint": "/api/getData",
	"pricePerCall": 0.01,
	"bundles": ["bundle_id_1"]
}
```

### Bundle

```json
{
	"name": "Enterprise Bundle",
	"description": "High-volume API access with discounts",
	"apiIds": ["api_id_1", "api_id_2"],
	"basePrice": 0.05,
	"discountRules": {
		"threshold": 100000,
		"discountPercentage": 0.1
	}
}
```

### Event

```json
{
	"name": "Data Processing Workflow",
	"fixedPrice": 1.0,
	"apiIds": ["api_id_1", "api_id_2", "api_id_3"]
}
```

### Subscription

```json
{
	"type": "bundle",
	"status": "active",
	"priority": 2,
	"details": {
		"bundleId": "bundle_id_1"
	}
}
```

## API Examples

### Health Check

```bash
curl -X GET http://localhost:3000/health
```

### Create Client

```bash
curl -X POST http://localhost:3000/api/v1/my_api/clients/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Get All Clients

```bash
curl -X GET http://localhost:3000/api/v1/my_api/clients/
```

### Get Client by ID

```bash
curl -X GET http://localhost:3000/api/v1/my_api/clients/CLIENT_ID
```

### Subscribe to Plan

```bash
curl -X POST http://localhost:3000/api/v1/my_api/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "CLIENT_ID",
    "subscriptionId": "SUBSCRIPTION_ID"
  }'
```

### Get All Subscriptions

```bash
curl -X GET http://localhost:3000/api/v1/my_api/subscriptions/
```

### Get Available APIs

```bash
curl -X GET http://localhost:3000/api/v1/my_api/my_api/
```

### Make Monetized API Call

```bash
curl -X GET http://localhost:3000/api/v1/my_api/my_api/getData \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "CLIENT_ID"
  }'
```

### Generate Monthly Invoice

```bash
curl -X GET "http://localhost:3000/api/v1/my_api/billing/?clientId=CLIENT_ID&month=2024-10"
```

## Rate Limiting

-   **Window**: 15 minutes
-   **Max Requests**: 100 requests per window
-   **Response**: JSON error with rate limit message

## Error Handling

| Code | Description                               |
| ---- | ----------------------------------------- |
| 400  | Bad Request - Missing/invalid parameters  |
| 403  | Forbidden - No matching subscription plan |
| 404  | Not Found - Resource not found            |
| 409  | Conflict - Duplicate resource             |
| 429  | Too Many Requests - Rate limit exceeded   |
| 500  | Internal Server Error                     |

## Testing Workflow

1. **Start the server**: `npm start`
2. **Create a client**: Use the create client endpoint
3. **Subscribe to a plan**: Choose from available subscriptions
4. **Make API calls**: Include `clientId` in request body for billing
5. **Generate invoice**: Request monthly invoice with query parameters

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

    - Ensure MongoDB is running
    - Check `MONGO_URI` in `.env` file
    - Verify MongoDB port (default: 27017)

2. **Rate Limiting Errors**

    - Wait 15 minutes for limit reset
    - Check rate limit constants in `constants/constants.js`

3. **403 Forbidden on API Calls**

    - Verify client has active subscription
    - Check if API is included in client's plan
    - Ensure correct `clientId` in request body

4. **Validation Errors**
    - Check request format matches API documentation
    - Verify required fields are present
    - Review Joi validation schemas

### Development Guidelines

-   Follow ESLint configuration
-   Add unit tests for new features
-   Update documentation for API changes
-   Use conventional commit messages
