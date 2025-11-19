#!/bin/bash

# Test API Routes for NotionChartKit
API_URL="http://localhost:3000"

echo "================================"
echo "Testing NotionChartKit API Routes"
echo "================================"
echo ""

# Test 1: GET /api/datasets (should return empty array initially)
echo "1. Testing GET /api/datasets"
echo "----------------------------"
curl -s -X GET "$API_URL/api/datasets"
echo ""
echo ""

# Test 2: GET /api/charts (should return empty array initially)
echo "2. Testing GET /api/charts"
echo "----------------------------"
curl -s -X GET "$API_URL/api/charts"
echo ""
echo ""

# Test 3: POST /api/datasets (should fail without proper data)
echo "3. Testing POST /api/datasets (without data - should fail)"
echo "-----------------------------------------------------------"
curl -s -X POST "$API_URL/api/datasets" \
  -H "Content-Type: application/json" \
  -d '{}'
echo ""
echo ""

# Test 4: POST /api/datasets (with valid-ish data - will fail on DB constraints)
echo "4. Testing POST /api/datasets (with data - will fail due to missing user/connection)"
echo "------------------------------------------------------------------------------------"
curl -s -X POST "$API_URL/api/datasets" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Dataset",
    "databaseId": "test-notion-db-id",
    "connectionId": "00000000-0000-0000-0000-000000000000",
    "config": {
      "databaseId": "test-notion-db-id",
      "groupBy": "status",
      "aggregationType": "count"
    },
    "refreshIntervalMinutes": 60
  }'
echo ""
echo ""

echo "================================"
echo "Tests Complete!"
echo ""
echo "Note: Most tests will fail because:"
echo "  - No user exists in database yet"
echo "  - No Notion connections set up"
echo "  - This is expected behavior"
echo ""
echo "The important thing is:"
echo "  ✓ API routes respond"
echo "  ✓ Validation works"
echo "  ✓ Error messages are clear"
echo "================================"
