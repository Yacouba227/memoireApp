import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null
    const id_membre_raw = form.get('id_membre') as string | null

    if (!file || !id_membre_raw) {
      return NextResponse.json({ error: 'Fichier et id_membre requis' }, { status: 400 })
    }

    const id_membre = parseInt(id_membre_raw)
    if (isNaN(id_membre)) {
      return NextResponse.json({ error: 'id_membre invalide' }, { status: 400 })
    }

    const membre = await prisma.membre.findUnique({ where: { id_membre } })
    if (!membre) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', String(id_membre))
    await mkdir(uploadsDir, { recursive: true })

    const ext = (file.name?.split('.').pop() || 'png').toLowerCase()
    const safeExt = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) ? ext : 'png'
    const fileName = `avatar_${Date.now()}.${safeExt}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, bytes)

    const publicUrl = `/uploads/${id_membre}/${fileName}`

    try {
      const updated = await prisma.membre.update({
        where: { id_membre },
        data: ({ photo_url: publicUrl } as any)
      })
      const { mot_de_passe: _pwd, ...safeUser } = updated as any
      return NextResponse.json({ message: 'Photo mise à jour', user: safeUser })
    } catch (err) {
      // Client peut ne pas connaître encore le champ: fallback SQL brut
      try {
        await (prisma as any).$executeRawUnsafe(
          `UPDATE membres SET photo_url = ? WHERE id_membre = ?`,
          publicUrl,
          id_membre
        )
        const updated = await prisma.membre.findUnique({ where: { id_membre } })
        const { mot_de_passe: _pwd, ...safeUser } = (updated as any) || {}
        return NextResponse.json({ message: 'Photo mise à jour', user: safeUser })
      } catch (inner) {
        console.error('Erreur fallback raw SQL photo:', inner)
        return NextResponse.json({ error: 'Erreur lors de la mise à jour de la photo' }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Erreur upload photo:', error)
    return NextResponse.json({ error: 'Erreur lors du téléversement' }, { status: 500 })
  }
}


