#!/bin/bash

echo "🧪 Testing PlanGenerator API Endpoints..."
echo ""

# Test 1: Health check
echo "1️⃣  Testing health endpoint..."
curl -s http://localhost:3000/api/health | grep -q "ok" && echo "✅ Health check passed" || echo "❌ Health check failed"
echo ""

# Test 2: Categories
echo "2️⃣  Testing categories endpoint..."
CATEGORIES=$(curl -s http://localhost:3000/api/opportunities/categories | grep -o '"categories":\[' | wc -l)
if [ "$CATEGORIES" -eq 1 ]; then
    echo "✅ Categories endpoint passed"
else
    echo "❌ Categories endpoint failed"
fi
echo ""

# Test 3: Types
echo "3️⃣  Testing types endpoint..."
TYPES=$(curl -s http://localhost:3000/api/opportunities/types | grep -o '"types":\[' | wc -l)
if [ "$TYPES" -eq 1 ]; then
    echo "✅ Types endpoint passed"
else
    echo "❌ Types endpoint failed"
fi
echo ""

# Test 4: Opportunities (all)
echo "4️⃣  Testing opportunities endpoint (all)..."
ALL_OPPS=$(curl -s "http://localhost:3000/api/opportunities" | grep -o '"success":true' | wc -l)
if [ "$ALL_OPPS" -eq 1 ]; then
    echo "✅ All opportunities endpoint passed"
else
    echo "❌ All opportunities endpoint failed"
fi
echo ""

# Test 5: Filtered opportunities
echo "5️⃣  Testing opportunities endpoint (filtered by category)..."
FILTERED=$(curl -s "http://localhost:3000/api/opportunities?category=programming&limit=5" | grep -o '"success":true' | wc -l)
if [ "$FILTERED" -eq 1 ]; then
    echo "✅ Filtered opportunities endpoint passed"
else
    echo "❌ Filtered opportunities endpoint failed"
fi
echo ""

# Test 6: Search
echo "6️⃣  Testing opportunities endpoint (search)..."
SEARCH=$(curl -s "http://localhost:3000/api/opportunities?keyword=hackathon" | grep -o '"success":true' | wc -l)
if [ "$SEARCH" -eq 1 ]; then
    echo "✅ Search endpoint passed"
else
    echo "❌ Search endpoint failed"
fi
echo ""

echo "🎉 All API tests completed!"
