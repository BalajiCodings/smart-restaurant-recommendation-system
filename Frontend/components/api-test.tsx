"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResult("")

    try {
      console.log("Testing API connection...")

      // Test basic connectivity
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Health check response:", response)

      if (response.ok) {
        const data = await response.text()
        setTestResult(`✅ API is reachable! Health check response: ${data}`)
      } else {
        setTestResult(`❌ API responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error("API test error:", error)
      setTestResult(`❌ Failed to connect to API: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const testRegisterEndpoint = async () => {
    setLoading(true)
    setTestResult("")

    try {
      console.log("Testing register endpoint...")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "testpassword123",
        }),
      })

      console.log("Register test response:", response)

      const responseText = await response.text()
      console.log("Register response text:", responseText)

      if (response.ok) {
        setTestResult(`✅ Register endpoint is working! Response: ${responseText}`)
      } else {
        setTestResult(`❌ Register endpoint error (${response.status}): ${responseText}`)
      }
    } catch (error) {
      console.error("Register test error:", error)
      setTestResult(`❌ Failed to test register endpoint: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test API Health"}
          </Button>
          <Button onClick={testRegisterEndpoint} disabled={loading} variant="outline">
            {loading ? "Testing..." : "Test Register Endpoint"}
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded-md text-sm">
            <pre className="whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
