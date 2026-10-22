import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nombre, rut, fnac, correo,
      ap, bp, di, dd,
      indiceCraneal, indiceAsimetria,
      diagnostico, recomendacion, kine,
    } = body

    // Buscar o crear paciente
    let paciente = await prisma.paciente.findUnique({ where: { rut } })

    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: {
          rut,
          nombre,
          fechaNacimiento: new Date(fnac),
        },
      })
    }

    // Crear evaluación
    const evaluacion = await prisma.evaluacion.create({
      data: {
        pacienteId: paciente.id,
        correoPadre: correo,
        anteroposterior: ap,
        biparietal: bp,
        diagonalIzq: di,
        diagonalDer: dd,
        indiceCraneal,
        indiceAsimetria,
        diagnostico,
        recomendacion,
        kinesiologa: kine,
      },
    })

    return NextResponse.json({ ok: true, evaluacionId: evaluacion.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: "Error al guardar" }, { status: 500 })
  }
}