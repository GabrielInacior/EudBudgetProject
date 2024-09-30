import prisma from "../config/prisma";
import GastoEntity from "../Entity/GastoEntity";

export default class GastoRepository {
  static async getAllGastos(): Promise<GastoEntity[]> {
    const gastos = await prisma.gasto.findMany();
    return gastos.map((gasto) => new GastoEntity(gasto));
  }

  static async getGastoById(id: number): Promise<GastoEntity | null> {
    const gasto = await prisma.gasto.findUnique({
      where: { id },
    });
    return gasto ? new GastoEntity(gasto) : null;
  }

  static async createGasto(data: {
    nome: string;
    valor: number;
    data: Date;
  }): Promise<GastoEntity> {
    const gasto = await prisma.gasto.create({
      data,
    });
    return new GastoEntity(gasto);
  }

  static async updateGasto(
    id: number,
    data: { nome?: string; valor?: number; data?: Date }
  ): Promise<GastoEntity | null> {
    const gasto = await prisma.gasto.update({
      where: { id },
      data,
    });
    return gasto ? new GastoEntity(gasto) : null;
  }

  static async deleteGasto(id: number): Promise<GastoEntity | null> {
    const gasto = await prisma.gasto.findUnique({
      where: { id },
    });
    if (gasto) {
      await prisma.gasto.delete({
        where: { id },
      });
      return new GastoEntity(gasto);
    }
    return null;
  }
}
