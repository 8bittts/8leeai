#!/bin/bash

# Credential Test Script - Quick validation of Zendesk and OpenAI APIs
# Usage: ./scripts/test-credentials.sh

set -e

echo "================================================"
echo "CREDENTIAL VALIDATION TEST"
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

if [ -z "$ZENDESK_EMAIL" ]; then
    echo "❌ ZENDESK_EMAIL not set"
    MISSING=true
else
    echo "✅ ZENDESK_EMAIL: $ZENDESK_EMAIL"
fi

if [ -z "$ZENDESK_API_TOKEN" ]; then
    echo "❌ ZENDESK_API_TOKEN not set"
    MISSING=true
else
    echo "✅ ZENDESK_API_TOKEN: ${ZENDESK_API_TOKEN:0:10}...${ZENDESK_API_TOKEN: -10}"
fi

if [ -z "$ZENDESK_SUBDOMAIN" ]; then
    echo "❌ ZENDESK_SUBDOMAIN not set"
    MISSING=true
else
    echo "✅ ZENDESK_SUBDOMAIN: $ZENDESK_SUBDOMAIN"
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
echo "🧪 TESTING ZENDESK API"
echo "================================================"
echo ""

# Test Zendesk API
ZENDESK_URL="https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json?limit=1"
ZENDESK_AUTH=$(echo -n "${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}" | base64)

echo "Testing: $ZENDESK_URL"
echo ""

ZENDESK_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -u "${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}" \
    "$ZENDESK_URL")

HTTP_CODE=$(echo "$ZENDESK_RESPONSE" | tail -n1)
BODY=$(echo "$ZENDESK_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ ZENDESK API - AUTHENTICATED ✅"
    echo ""
    TICKET_COUNT=$(echo "$BODY" | jq -r '.count // "unknown"' 2>/dev/null || echo "unknown")
    echo "Total tickets in account: $TICKET_COUNT"
    echo ""
    echo "First ticket (sample):"
    echo "$BODY" | jq '.tickets[0] // "No tickets"' 2>/dev/null || echo "Could not parse response"
else
    echo "❌ ZENDESK API - FAILED ❌"
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
echo "  → Your credentials are valid"
echo "  → The system is ready to use"
echo ""
echo "If either test failed:"
echo "  → Check the error message above"
echo "  → Verify your credentials in .env.local"
echo "  → Regenerate tokens if needed"
echo ""
