import prisma from "../config/prisma";
import ClienteEntity from "../Entity/ClienteEntity";

export default class ClienteRepository {
  static async getAllClientes(): Promise<ClienteEntity[]> {
    const clientes = await prisma.cliente.findMany();
    return clientes.map((cliente) => new ClienteEntity(cliente));
  }

  static async getClienteById(id: number): Promise<ClienteEntity | null> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });
    return cliente ? new ClienteEntity(cliente) : null;
  }

  static async createCliente(data: {
    nome: string;
    endereco?: string;
    telefone?: string;
  }): Promise<ClienteEntity> {
    const cliente = await prisma.cliente.create({
      data,
    });
    return new ClienteEntity(cliente);
  }

  static async updateCliente(
    id: number,
    data: { nome?: string; endereco?: string; telefone?: string }
  ): Promise<ClienteEntity | null> {
    const cliente = await prisma.cliente.update({
      where: { id },
      data,
    });
    return cliente ? new ClienteEntity(cliente) : null;
  }

  static async deleteCliente(id: number): Promise<ClienteEntity | null> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });
    if (cliente) {
      await prisma.cliente.delete({
        where: { id },
      });
      return new ClienteEntity(cliente);
    }
    return null;
  }
}
