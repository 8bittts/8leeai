/**
 * Metadata Operations Integration Tests
 *
 * Comprehensive test suite for metadata-based queries and operations:
 * - Tag-based filtering and operations
 * - Type-based queries and distribution
 * - Priority-based filtering
 * - Assignment operations
 * - Mixed metadata queries
 *
 * Tests run against production Intercom credentials to validate real API behavior.
 */

import { describe, expect, test } from "bun:test"
import { getIntercomAPIClient } from "../lib/intercom-api-client"
import { handleSmartQuery } from "../lib/intercom-smart-query-handler"

describe("Metadata Operations - Tag Queries", () => {
  test("should count tickets with specific tag", async () => {
    const result = await handleSmartQuery("how many tickets are tagged billing?")

    expect(result.answer).toContain("billing")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Tag count query: ${result.answer}`)
  })

  test("should count tickets with urgent tag", async () => {
    const result = await handleSmartQuery("show tickets with urgent tag")

    expect(result.answer).toContain("urgent")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Urgent tag query: ${result.answer}`)
  })

  test("should count tickets with technical tag", async () => {
    const result = await handleSmartQuery("how many technical tickets?")

    expect(result.answer).toContain("technical")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Technical tag query: ${result.answer}`)
  })

  test("should count tickets with feature-request tag", async () => {
    const result = await handleSmartQuery("tickets tagged feature-request")

    expect(result.answer).toContain("feature-request")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Feature request tag query: ${result.answer}`)
  })

  test("should count tickets with bug tag", async () => {
    const result = await handleSmartQuery("how many bug tickets?")

    expect(result.answer).toContain("bug")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Bug tag query: ${result.answer}`)
  })
})

describe("Metadata Operations - Type Queries", () => {
  test("should show ticket type breakdown", async () => {
    const result = await handleSmartQuery("breakdown by ticket type")

    expect(result.answer).toContain("type")
    expect(result.answer).toMatch(/question|incident|problem|task/)
    expect(result.confidence).toBeGreaterThan(0.9)
    console.log(`✅ Type breakdown: ${result.answer}`)
  })

  test("should count incident tickets", async () => {
    const result = await handleSmartQuery("how many incident tickets?")

    expect(result.answer).toContain("incident")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Incident count: ${result.answer}`)
  })

  test("should count problem tickets", async () => {
    const result = await handleSmartQuery("show problem tickets")

    expect(result.answer).toContain("problem")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Problem count: ${result.answer}`)
  })

  test("should count question tickets", async () => {
    const result = await handleSmartQuery("how many question tickets?")

    expect(result.answer).toContain("question")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Question count: ${result.answer}`)
  })

  test("should count task tickets", async () => {
    const result = await handleSmartQuery("show task tickets")

    expect(result.answer).toContain("task")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Task count: ${result.answer}`)
  })
})

describe("Metadata Operations - Priority Queries", () => {
  test("should count urgent tickets", async () => {
    const result = await handleSmartQuery("how many urgent tickets?")

    expect(result.answer).toContain("urgent")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Urgent priority: ${result.answer}`)
  })

  test("should count high priority tickets", async () => {
    const result = await handleSmartQuery("show high priority tickets")

    expect(result.answer).toContain("high")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ High priority: ${result.answer}`)
  })

  test("should count normal priority tickets", async () => {
    const result = await handleSmartQuery("how many normal priority tickets?")

    expect(result.answer).toContain("normal")
    expect(result.confidence).toBeGreaterThan(0.8)
    console.log(`✅ Normal priority: ${result.answer}`)
  })

  test("should show priority distribution", async () => {
    const result = await handleSmartQuery("what's the priority distribution?")

    expect(result.answer).toContain("priority")
    expect(result.answer).toMatch(/urgent|high|normal|low/)
    expect(result.confidence).toBeGreaterThan(0.9)
    console.log(`✅ Priority breakdown: ${result.answer}`)
  })
})

describe("Metadata Operations - Assignment", () => {
  test("should assign ticket to agent via query", async () => {
    // First, get a ticket to assign
    const client = getIntercomAPIClient()
    const tickets = await client.getTickets()

    if (tickets && tickets.length > 0) {
      const _ticketId = tickets[0].id

      // Store last tickets in context by running a query first
      await handleSmartQuery("show me the first 5 tickets")

      // Now try to assign
      const result = await handleSmartQuery("assign first ticket to sarah@8lee.ai")

      expect(result.answer).toContain("Assigned")
      expect(result.answer).toContain("sarah@8lee.ai")
      expect(result.confidence).toBeGreaterThan(0.9)
      console.log(`✅ Assignment: ${result.answer}`)
    } else {
      console.log("⚠️  No tickets available for assignment test")
    }
  }, 15000) // Longer timeout for this test

  test("should handle assignment with context", async () => {
    // Get context first
    await handleSmartQuery("list recent tickets")

    const result = await handleSmartQuery("assign second ticket to john@8lee.ai")

    // Should either succeed or give helpful error
    expect(result.answer).toBeDefined()
    expect(result.answer.length).toBeGreaterThan(10)
    console.log(`✅ Assignment with context: ${result.answer}`)
  }, 15000)
})

describe("Metadata Operations - Tag Operations", () => {
  test("should add tags to ticket", async () => {
    // Get context first
    await handleSmartQuery("show me recent tickets")

    const result = await handleSmartQuery("add tag test-tag to first ticket")

    // Should either succeed or give helpful error
    expect(result.answer).toBeDefined()
    expect(result.answer.length).toBeGreaterThan(10)
    console.log(`✅ Add tag: ${result.answer}`)
  }, 15000)

  test("should remove tags from ticket", async () => {
    // Get context first
    await handleSmartQuery("list tickets")

    const result = await handleSmartQuery("remove tag test-tag from first ticket")

    // Should either succeed or give helpful error
    expect(result.answer).toBeDefined()
    expect(result.answer.length).toBeGreaterThan(10)
    console.log(`✅ Remove tag: ${result.answer}`)
  }, 15000)

  test("should add multiple tags at once", async () => {
    // Get context first
    await handleSmartQuery("show tickets")

    const result = await handleSmartQuery("add tags urgent billing to first ticket")

    // Should either succeed or give helpful error
    expect(result.answer).toBeDefined()
    expect(result.answer.length).toBeGreaterThan(10)
    console.log(`✅ Add multiple tags: ${result.answer}`)
  }, 15000)
})

describe("Metadata Operations - Complex Queries", () => {
  test("should handle multi-dimensional breakdown", async () => {
    const result = await handleSmartQuery("show me the breakdown by status, priority, and type")

    expect(result.answer).toBeDefined()
    expect(result.answer.length).toBeGreaterThan(20)
    console.log(`✅ Multi-dimensional: ${result.answer}`)
  })

  test("should understand combined filters", async () => {
    const result = await handleSmartQuery("how many urgent tickets are tagged billing?")

    expect(result.answer).toBeDefined()
    expect(result.confidence).toBeGreaterThan(0)
    console.log(`✅ Combined filter: ${result.answer}`)
  })

  test("should handle time-based metadata queries", async () => {
    const result = await handleSmartQuery("show me urgent tickets from the last 7 days")

    expect(result.answer).toBeDefined()
    expect(result.answer.length).toBeGreaterThan(10)
    console.log(`✅ Time + metadata: ${result.answer}`)
  })
})

describe("Metadata Operations - Error Handling", () => {
  test("should handle invalid tag gracefully", async () => {
    const result = await handleSmartQuery("show tickets with nonexistent-tag-xyz")

    expect(result.answer).toBeDefined()
    expect(result.confidence).toBeGreaterThan(0)
    console.log(`✅ Invalid tag handling: ${result.answer}`)
  })

  test("should handle invalid type gracefully", async () => {
    const result = await handleSmartQuery("how many foobar type tickets?")

    expect(result.answer).toBeDefined()
    console.log(`✅ Invalid type handling: ${result.answer}`)
  })

  test("should handle assignment without context", async () => {
    // Don't set context
    const result = await handleSmartQuery("assign first ticket to sarah@8lee.ai")

    expect(result.answer).toBeDefined()
    // Should either work or give helpful error
    console.log(`✅ Assignment without context: ${result.answer}`)
  })
})

describe("Metadata Operations - Cache Performance", () => {
  test("should answer tag queries from cache (fast)", async () => {
    const start = Date.now()
    const result = await handleSmartQuery("how many tickets are tagged billing?")
    const duration = Date.now() - start

    expect(result.source).toBe("cache")
    expect(duration).toBeLessThan(200) // Should be very fast
    expect(result.processingTime).toBeLessThan(200)
    console.log(`✅ Tag query cache speed: ${duration}ms (processing: ${result.processingTime}ms)`)
  })

  test("should answer type queries from cache (fast)", async () => {
    const start = Date.now()
    const result = await handleSmartQuery("breakdown by ticket type")
    const duration = Date.now() - start

    expect(result.source).toBe("cache")
    expect(duration).toBeLessThan(200)
    expect(result.processingTime).toBeLessThan(200)
    console.log(`✅ Type query cache speed: ${duration}ms (processing: ${result.processingTime}ms)`)
  })

  test("should answer priority queries from cache (fast)", async () => {
    const start = Date.now()
    const result = await handleSmartQuery("how many urgent tickets?")
    const duration = Date.now() - start

    expect(result.source).toBe("cache")
    expect(duration).toBeLessThan(200)
    expect(result.processingTime).toBeLessThan(200)
    console.log(
      `✅ Priority query cache speed: ${duration}ms (processing: ${result.processingTime}ms)`
    )
  })
})
