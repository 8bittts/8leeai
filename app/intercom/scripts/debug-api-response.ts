#!/usr/bin/env bun

/**
 * Debug API Response - Direct API Call to see raw response
 */

async function main() {
  const token = process.env.INTERCOM_ACCESS_TOKEN
  if (!token) {
    console.error("Missing INTERCOM_ACCESS_TOKEN")
    process.exit(1)
  }

  console.log("🔍 Direct API Test")
  console.log("=".repeat(52))

  try {
    console.log("\n1. Testing POST /tickets/search:")
    const searchResponse = await fetch("https://api.intercom.io/tickets/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Intercom-Version": "2.11",
      },
      body: JSON.stringify({
        query: {
          operator: "AND",
          value: [{ field: "state", operator: "=", value: "submitted" }],
        },
        pagination: {
          per_page: 10,
        },
      }),
    })

    console.log(`   Status: ${searchResponse.status}`)
    const searchData = await searchResponse.json()
    console.log("   Response:", JSON.stringify(searchData, null, 2))

    console.log("\n2. Testing GET /tickets (if it exists):")
    const listResponse = await fetch("https://api.intercom.io/tickets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Intercom-Version": "2.11",
      },
    })

    console.log(`   Status: ${listResponse.status}`)
    if (listResponse.ok) {
      const listData = await listResponse.json()
      console.log("   Response:", JSON.stringify(listData, null, 2).substring(0, 500))
    } else {
      const errorData = await listResponse.text()
      console.log("   Error:", errorData)
    }
  } catch (error) {
    console.error("\n❌ Error:", error)
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
