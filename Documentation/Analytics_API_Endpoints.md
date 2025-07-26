# Analytics API Endpoints Documentation

## Overview

This document outlines all the API endpoints required for the Analytics Dashboard. The analytics system is designed to be scalable and feature-based, allowing for easy addition of new statistics and features.

## Base URL

All analytics endpoints are prefixed with `/api/analytics`

## General Endpoints

### 1. Overview Analytics

**Endpoint:** `GET /api/analytics/overview`
**Description:** Returns high-level statistics for all features
**Query Parameters:**

-   `timeRange` (optional): `7d`, `30d`, `90d`, `1y` (default: `30d`)

**Response:**

```json
{
    "success": true,
    "payload": {
        "totalUsers": 1234,
        "totalSeminars": 45,
        "totalEIC": 2456,
        "totalDistributions": 699,
        "totalInventoryItems": 1892,
        "userGrowth": 15.5,
        "seminarGrowth": 8.2,
        "eicGrowth": -2.3,
        "distributionGrowth": 12.8,
        "inventoryGrowth": 5.1,
        "lastUpdated": "2024-01-15T10:30:00Z"
    }
}
```

## Feature-Specific Endpoints

### 2. User Analytics

**Endpoint:** `GET /api/analytics/users`
**Description:** Detailed user statistics and trends
**Query Parameters:**

-   `timeRange` (optional): `7d`, `30d`, `90d`, `1y`
-   `groupBy` (optional): `day`, `week`, `month`

**Response:**

```json
{
    "success": true,
    "payload": {
        "totalUsers": 1234,
        "activeUsers": 856,
        "newUsersThisPeriod": 156,
        "userGrowthRate": 15.5,
        "monthlyRegistrations": [120, 135, 145, 160, 180, 195, 210],
        "userTypes": {
            "farmers": 890,
            "admins": 12,
            "staff": 332
        },
        "usersByRegion": {
            "Region 1": 445,
            "Region 2": 323,
            "Region 3": 267,
            "Others": 199
        },
        "averageSessionDuration": "00:23:45",
        "topActivities": [
            "Seminar Registration",
            "EIC Requests",
            "Profile Updates"
        ]
    }
}
```

### 3. Seminar Analytics

**Endpoint:** `GET /api/analytics/seminars`
**Description:** Seminar performance and attendance statistics
**Query Parameters:**

-   `timeRange` (optional): `7d`, `30d`, `90d`, `1y`

**Response:**

```json
{
    "success": true,
    "payload": {
        "totalSeminars": 45,
        "activeSeminars": 12,
        "completedSeminars": 33,
        "averageRating": 4.8,
        "totalAttendees": 1567,
        "averageAttendance": 87,
        "completionRate": 78,
        "monthlyCompletions": [5, 8, 12, 15, 18, 20, 22],
        "seminarsByCategory": {
            "farming": 25,
            "technology": 12,
            "business": 8
        },
        "topSeminars": [
            {
                "id": 1,
                "title": "Modern Farming Techniques",
                "attendees": 123,
                "rating": 4.9
            }
        ],
        "attendanceByRegion": {
            "Region 1": 456,
            "Region 2": 234,
            "Region 3": 167
        }
    }
}
```

### 4. EIC Analytics

**Endpoint:** `GET /api/analytics/eic`
**Description:** EIC distribution and utilization statistics
**Query Parameters:**

-   `timeRange` (optional): `7d`, `30d`, `90d`, `1y`

**Response:**

```json
{
    "success": true,
    "payload": {
        "totalEIC": 2456,
        "availableEIC": 1667,
        "distributedEIC": 789,
        "utilizationRate": 67,
        "monthlyDistribution": [150, 180, 200, 220, 250, 280, 300],
        "eicByCategory": {
            "seeds": 45,
            "tools": 30,
            "fertilizer": 25
        },
        "topEICItems": [
            {
                "name": "Pechay Seeds",
                "quantity": 450,
                "requests": 89
            },
            {
                "name": "Mangrove Seeds",
                "quantity": 300,
                "requests": 67
            }
        ],
        "distributionByRegion": {
            "Region 1": 234,
            "Region 2": 178,
            "Region 3": 145
        },
        "averageProcessingTime": "2.3 days"
    }
}
```

### 5. Distribution Analytics

**Endpoint:** `GET /api/analytics/distribution`
**Description:** Distribution request and fulfillment statistics
**Query Parameters:**

-   `timeRange` (optional): `7d`, `30d`, `90d`, `1y`

**Response:**

```json
{
    "success": true,
    "payload": {
        "totalRequests": 855,
        "pendingRequests": 156,
        "completedRequests": 543,
        "cancelledRequests": 23,
        "fulfillmentRate": 92,
        "averageProcessingTime": 2.3,
        "monthlyRequests": [80, 95, 110, 125, 140, 155, 170],
        "requestsByStatus": {
            "pending": 156,
            "processing": 89,
            "completed": 543,
            "cancelled": 23
        },
        "requestsByRegion": {
            "Region 1": 234,
            "Region 2": 178,
            "Region 3": 145,
            "Others": 98
        },
        "topRequestedItems": ["Pechay Seeds", "Fertilizer", "Farming Tools"]
    }
}
```

### 6. Inventory Analytics

**Endpoint:** `GET /api/analytics/inventory`
**Description:** Inventory levels and movement statistics
**Query Parameters:**

-   `timeRange` (optional): `7d`, `30d`, `90d`, `1y`

**Response:**

```json
{
    "success": true,
    "payload": {
        "totalItems": 1892,
        "lowStockItems": 234,
        "outOfStockItems": 45,
        "totalValue": 125000,
        "inventoryTurnover": 3.2,
        "stockLevels": [1800, 1850, 1900, 1950, 2000, 1950, 1892],
        "itemsByCategory": {
            "seeds": 40,
            "tools": 35,
            "fertilizer": 25
        },
        "topMovingItems": [
            {
                "name": "Pechay Seeds",
                "quantity": 234,
                "movement": "+15%"
            }
        ],
        "warehouseUtilization": 78,
        "reorderAlerts": [
            {
                "item": "Tomato Seeds",
                "currentStock": 12,
                "reorderLevel": 50
            }
        ]
    }
}
```

## Additional Endpoints

### 7. Export Analytics Data

**Endpoint:** `GET /api/analytics/export`
**Description:** Export analytics data in various formats
**Query Parameters:**

-   `feature`: `users`, `seminars`, `eic`, `distribution`, `inventory`, `all`
-   `format`: `csv`, `xlsx`, `pdf`
-   `timeRange`: `7d`, `30d`, `90d`, `1y`

**Response:** File download

### 8. Real-time Statistics

**Endpoint:** `GET /api/analytics/realtime`
**Description:** Get real-time statistics for dashboard
**Response:**

```json
{
    "success": true,
    "payload": {
        "activeUsers": 89,
        "ongoingSeminars": 3,
        "pendingDistributions": 23,
        "recentActivity": [
            {
                "type": "user_registration",
                "timestamp": "2024-01-15T10:25:00Z",
                "description": "New user registered"
            }
        ]
    }
}
```

### 9. Custom Analytics Query

**Endpoint:** `POST /api/analytics/custom`
**Description:** Execute custom analytics queries
**Request Body:**

```json
{
    "query": {
        "feature": "users",
        "metrics": ["count", "growth"],
        "filters": {
            "region": "Region 1",
            "userType": "farmer"
        },
        "timeRange": "30d",
        "groupBy": "week"
    }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
    "success": false,
    "error": {
        "code": "INVALID_TIME_RANGE",
        "message": "Invalid time range specified. Allowed values: 7d, 30d, 90d, 1y"
    }
}
```

## Implementation Notes

1. **Caching**: Implement Redis caching for frequently accessed analytics data
2. **Performance**: Use database indexing for time-based queries
3. **Real-time Updates**: Consider WebSocket connections for real-time dashboard updates
4. **Data Aggregation**: Pre-aggregate data for better performance on large datasets
5. **Rate Limiting**: Implement rate limiting to prevent API abuse
6. **Authentication**: All endpoints require admin authentication
7. **Pagination**: Implement pagination for large result sets

## Future Enhancements

1. **Predictive Analytics**: ML-based forecasting
2. **Custom Dashboards**: User-configurable analytics views
3. **Automated Reports**: Scheduled analytics reports
4. **Alerts**: Threshold-based notifications
5. **Data Visualization**: Advanced chart types and configurations
