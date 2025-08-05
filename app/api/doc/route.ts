// app/api/docs/get.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const docs = await prisma.doc.findMany();
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom_doc, type_doc, url_doc } = body;

    if (!nom_doc || !type_doc || !url_doc) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const newDoc = await prisma.doc.create({
      data: { nom_doc, type_doc, url_doc },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}