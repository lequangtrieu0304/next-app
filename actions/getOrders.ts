import prisma from "@/libs/prismadb";

export default async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createDate: 'desc',
      }
    })
  }
  catch (error: any){
    throw new Error(error);
  }
}