"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginApoderado() {
  const [rut, setRut] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      rut,
      redirect: false,
    })

    if (result?.error) {
      setError("RUT no encontrado. Verifica que el RUT sea correcto.")
    } else {
      router.push("/historial")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Portal Apoderados
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Ingresa el RUT de tu hijo/a para ver sus evaluaciones
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUT del paciente
            </label>
            <input
              type="text"
              placeholder="12345678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Buscando..." : "Ver evaluaciones"}
          </button>
        </form>
      </div>
    </main>
  )
}