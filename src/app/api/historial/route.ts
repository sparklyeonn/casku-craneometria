import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const evaluaciones = await prisma.evaluacion.findMany({
    where: { pacienteId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ evaluaciones })
}