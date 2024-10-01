import prisma from "../config/prisma";
import ServicoEntity from "../Entity/ServicoEntity";

export default class ServicoRepository {
  static async getServicosByClienteId(
    clienteId: number
  ): Promise<ServicoEntity[]> {
    const servicos = await prisma.servico.findMany({
      where: { clienteId },
      orderBy: {
        data: "desc",
      },
    });
    return servicos.map((servico) => new ServicoEntity(servico));
  }

  static async getServicosByFilters({
    startDate,
    endDate,
    clienteId,
    nome,
  }: {
    startDate?: Date | null;
    endDate?: Date | null;
    clienteId: number;
    nome?: string | null;
  }): Promise<ServicoEntity[]> {
    const whereConditions: any = {
      clienteId,
    };

    if (startDate && endDate) {
      whereConditions.data = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (nome) {
      whereConditions.nome = {
        contains: nome,
        mode: "insensitive",
      };
    }

    const servicos = await prisma.servico.findMany({
      where: whereConditions,
      orderBy: {
        data: "desc",
      },
    });

    return servicos.map((servico) => new ServicoEntity(servico));
  }

  static async getAllServicosByFilters({
    startDate,
    endDate,
    nome,
  }: {
    startDate?: Date | null;
    endDate?: Date | null;
    nome?: string | null;
  }): Promise<ServicoEntity[]> {
    const whereConditions: any = {};

    if (startDate && endDate) {
      whereConditions.data = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (nome) {
      whereConditions.nome = {
        contains: nome,
        mode: "insensitive",
      };
    }

    const servicos = await prisma.servico.findMany({
      where: whereConditions,
      orderBy: {
        data: "desc",
      },
    });

    return servicos.map((servico) => new ServicoEntity(servico));
  }

  static async getServicosByDateRange(
    startDate: Date,
    endDate: Date,
    clienteId: number
  ) {
    return await prisma.servico.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
  static async getServicoById(id: number): Promise<ServicoEntity | null> {
    const servico = await prisma.servico.findUnique({
      where: { id },
    });
    return servico ? new ServicoEntity(servico) : null;
  }

  static async createServico(data: {
    nome: string;
    data: Date;
    valor: number;
    clienteId: number;
  }): Promise<ServicoEntity> {
    const servico = await prisma.servico.create({
      data,
    });
    return new ServicoEntity(servico);
  }

  static async updateServico(
    id: number,
    data: { nome?: string; data?: Date; valor?: number; clienteId?: number }
  ): Promise<ServicoEntity | null> {
    const servico = await prisma.servico.update({
      where: { id },
      data,
    });
    return servico ? new ServicoEntity(servico) : null;
  }

  static async deleteServico(id: number): Promise<ServicoEntity | null> {
    const servico = await prisma.servico.findUnique({
      where: { id },
    });
    if (servico) {
      await prisma.servico.delete({
        where: { id },
      });
      return new ServicoEntity(servico);
    }
    return null;
  }
}
