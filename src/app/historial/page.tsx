import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export default async function Historial() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const evaluaciones = await prisma.evaluacion.findMany({
    where: { pacienteId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const paciente = await prisma.paciente.findUnique({
    where: { id: session.user.id },
  })

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Evaluaciones de {paciente?.nombre}
        </h1>
        <p className="text-gray-500 text-sm mb-6">RUT: {paciente?.rut}</p>

        {evaluaciones.length === 0 ? (
          <p className="text-gray-500 text-center mt-12">
            No hay evaluaciones registradas aún.
          </p>
        ) : (
          <div className="space-y-4">
            {evaluaciones.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400">
                    {new Date(ev.createdAt).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-gray-400">
                    Kinesiologa: {ev.kinesiologa}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {ev.diagnostico}
                </p>
                <p className="text-sm text-gray-600 mb-4">{ev.recomendacion}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <span>Índice craneal: <strong>{ev.indiceCraneal.toFixed(1)}</strong></span>
                  <span>Asimetría: <strong>{ev.indiceAsimetria.toFixed(1)} mm</strong></span>
                  <span>Anteroposterior: <strong>{ev.anteroposterior} mm</strong></span>
                  <span>Biparietal: <strong>{ev.biparietal} mm</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}