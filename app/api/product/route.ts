import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import {getCurrentUser} from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.error();
  }

  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      ...body,
      price: parseFloat(body.price),
    }
  })

  return NextResponse.json(product);
}