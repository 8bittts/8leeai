#!/bin/bash

# Credential Test Script - Quick validation of Intercom and OpenAI APIs
# Usage: ./app/intercom/scripts/test-credentials.sh

set -e

echo "================================================"
echo "INTERCOM CREDENTIAL VALIDATION TEST"
echo "================================================"
echo ""

# Load environment variables
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found"
    exit 1
fi

# Source the environment file
set -a
source .env.local
set +a

# Validate required environment variables
echo "📋 Checking environment variables..."
echo ""

MISSING=false

if [ -z "$INTERCOM_ACCESS_TOKEN" ]; then
    echo "❌ INTERCOM_ACCESS_TOKEN not set"
    MISSING=true
else
    echo "✅ INTERCOM_ACCESS_TOKEN: ${INTERCOM_ACCESS_TOKEN:0:15}...${INTERCOM_ACCESS_TOKEN: -15}"
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set"
    MISSING=true
else
    echo "✅ OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -10}"
fi

if [ "$MISSING" = true ]; then
    echo ""
    echo "❌ Missing required environment variables"
    exit 1
fi

echo ""
echo "================================================"
echo "🧪 TESTING INTERCOM API"
echo "================================================"
echo ""

# Test Intercom API - Get conversations
INTERCOM_URL="https://api.intercom.io/conversations?per_page=1"

echo "Testing: $INTERCOM_URL"
echo ""

INTERCOM_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $INTERCOM_ACCESS_TOKEN" \
    -H "Accept: application/json" \
    -H "Intercom-Version: 2.11" \
    "$INTERCOM_URL")

HTTP_CODE=$(echo "$INTERCOM_RESPONSE" | tail -n1)
BODY=$(echo "$INTERCOM_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ INTERCOM API - AUTHENTICATED ✅"
    echo ""
    CONV_COUNT=$(echo "$BODY" | jq -r '.conversations | length' 2>/dev/null || echo "unknown")
    echo "Conversations retrieved: $CONV_COUNT"
    echo ""
    echo "First conversation (sample):"
    echo "$BODY" | jq '.conversations[0] | {id, state, priority, created_at}' 2>/dev/null || echo "Could not parse response"
else
    echo "❌ INTERCOM API - FAILED ❌"
    echo "Status Code: $HTTP_CODE"
    echo ""
    echo "Response:"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
fi

echo ""
echo "================================================"
echo "🧪 TESTING OPENAI API"
echo "================================================"
echo ""

echo "Testing: https://api.openai.com/v1/models"
echo ""

OPENAI_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    https://api.openai.com/v1/models)

HTTP_CODE=$(echo "$OPENAI_RESPONSE" | tail -n1)
BODY=$(echo "$OPENAI_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OPENAI API - AUTHENTICATED ✅"
    echo ""
    MODEL_COUNT=$(echo "$BODY" | jq -r '.data | length' 2>/dev/null || echo "unknown")
    echo "Available models: $MODEL_COUNT"
    echo ""
    echo "GPT-4 Models:"
    echo "$BODY" | jq -r '.data[] | select(.id | contains("gpt-4")) | .id' 2>/dev/null | head -5
else
    echo "❌ OPENAI API - FAILED ❌"
    echo "Status Code: $HTTP_CODE"
    echo ""
    echo "Response:"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
fi

echo ""
echo "================================================"
echo "SUMMARY"
echo "================================================"
echo ""
echo "If both tests show ✅ AUTHENTICATED:"
echo "  → Your Intercom and OpenAI credentials are valid"
echo "  → The Intercom Intelligence Portal is ready to use"
echo ""
echo "If either test failed:"
echo "  → Check the error message above"
echo "  → Verify INTERCOM_ACCESS_TOKEN in .env.local"
echo "  → Verify OPENAI_API_KEY in .env.local"
echo "  → Regenerate tokens if needed"
echo ""
echo "To run the API test script:"
echo "  bun app/intercom/scripts/intercom-api-test.ts"
echo ""
