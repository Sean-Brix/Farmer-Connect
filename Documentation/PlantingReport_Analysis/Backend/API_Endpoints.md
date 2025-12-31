# Planting Report API Endpoints

**Base URL:** `/api/planting-reports`

## CRUD Operations

### Create Report
- **Endpoint:** `POST /reports`
- **Auth:** Admin (cookieAuth + adminAuth)
- **State:** Creates in State 1 (Request_Report)
- **Body:**
```json
{
  "farmerName": "string (required)",
  "farmLocation": "string (required)",
  "areaPlanted": "number (required)",
  "typeOfCrop": "Rice | Corn | High_Value_Crops (required)",
  "varietyId": "uuid (required)",
  "seedClassification": "Inbred_Certified | Hybrid_F1 | Inbred_Good | Inbred_Farmers (required)",
  "rsbsaNumber": "string (optional)",
  "croppingSeasonId": "uuid (optional)",
  "riceIrrigation": "Irrigated | Rainfed Lowland (optional)",
  "cropInsurance": "boolean (optional)",
  "requestNote": "string (optional)",
  "createdBy": "uuid (optional)",
  "lastUpdatedBy": "uuid (optional)"
}
```
- **Response:** `201 Created`

### Get All Reports
- **Endpoint:** `GET /reports`
- **Auth:** Admin
- **Query Params:** `page`, `limit`, `state`, `isArchived`, `distributionLinked`, `typeOfCrop`, `varietyId`, `croppingSeasonId`, `search`, `dateFrom`, `dateTo`
- **Response:** `200 OK` with data and pagination

### Get Report by ID
- **Endpoint:** `GET /reports/:id`
- **Auth:** Admin
- **Response:** `200 OK` or `404 Not Found`

### Update Report
- **Endpoint:** `PUT /reports/:id`
- **Auth:** Admin
- **Note:** State changes must use transition endpoints
- **Response:** `200 OK`

### Delete Report (Soft)
- **Endpoint:** `DELETE /reports/:id`
- **Auth:** Admin
- **Response:** `200 OK` with recovery deadline

## State Transitions

### Transition to Planted (State 1 → 2)
- **Endpoint:** `PATCH /reports/:id/transition/planted`
- **Auth:** Admin
- **Requirements:** Report in Request_Report; requires `dateOfPlanting`, `plantingMethod`, and `riceIrrigation` when crop is Rice
- **Auto:** Calculates `dateOfExpectedHarvest`

### Transition to Completed (State 2 → 3)
- **Endpoint:** `PATCH /reports/:id/transition/completed`
- **Auth:** Admin
- **Requirements:** Report in Planted; requires `harvestArea`, `numberOfBags`, `weightPerBag`
- **Auto:** Calculates `yieldMtPerHa`

## Archive Management

### Archive Report
- **Endpoint:** `PATCH /reports/:id/archive`
- **Auth:** Admin
- **Requirements:** Report in Completed and not archived

### Unarchive Report
- **Endpoint:** `PATCH /reports/:id/unarchive`
- **Auth:** Admin
- **Requirements:** Report currently archived

## Soft Delete Management

### Get Deleted Reports
- **Endpoint:** `GET /reports/deleted`
- **Auth:** Admin
- **Response:** `200 OK` with `daysUntilPermanentDelete` and `canRestore`

### Restore Report
- **Endpoint:** `PATCH /reports/:id/restore`
- **Auth:** Admin
- **Requirements:** Report soft-deleted within 30-day window

## Bulk Operations

### Bulk Archive
- **Endpoint:** `POST /reports/bulk/archive`
- **Auth:** Admin
- **Body:** `reportIds` (max 100), `archivedBy`, optional `reason`
- **Requirements:** Reports must be Completed and not already archived

### Bulk Delete
- **Endpoint:** `POST /reports/bulk/delete`
- **Auth:** Admin
- **Body:** `reportIds` (max 100), `deletedBy`

## Special Endpoints

### Reports by RSBSA
- **Endpoint:** `GET /reports/rsbsa/:rsbsaNumber`
- **Auth:** Admin
- **Query:** `page`, `limit`, `startDate`, `endDate`, `typeOfCrop`

### Recalculate Yield
- **Endpoint:** `POST /reports/:id/calculate-yield`
- **Auth:** Admin

## Planting Seasons
- **Endpoints:**
  - `POST /seasons`
  - `GET /seasons`
  - `GET /seasons/active`
  - `GET /seasons/:id`
  - `PUT /seasons/:id`
  - `DELETE /seasons/:id`
  - `PATCH /seasons/:id/deactivate`
- **Auth:** Admin

## Seed Varieties
- **Endpoints:**
  - `POST /varieties`
  - `GET /varieties`
  - `GET /varieties/crop-type/:cropType`
  - `GET /varieties/stats`
  - `GET /varieties/:id/reports`
  - `GET /varieties/:id`
  - `PUT /varieties/:id`
  - `DELETE /varieties/:id`
  - `PATCH /varieties/:id/deactivate`
- **Auth:** Admin

## Error Responses

Standard error shape:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error message",
  "details": {}
}
```

**Status Codes:** 400 (validation), 401 (unauthenticated), 403 (forbidden), 404 (not found/soft-deleted), 500 (server error)
