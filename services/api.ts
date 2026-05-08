/**
 * Base API service for the Signage Pro CRM.
 * In the future, this will handle axios/fetch calls to the backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const apiService = {
  async get(endpoint: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`)
    if (!res.ok) throw new Error("API call failed")
    return res.json()
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("API call failed")
    return res.json()
  },
}
