import ClienteRepository from "../Repository/ClienteRepository";

export default class ClienteEntity {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  totalServicos: number;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.endereco = data.endereco;
    this.telefone = data.telefone;
    this.totalServicos = data.totalServicos;
  }

  async saveCliente(): Promise<ClienteEntity | null> {
    try {
      if (this.id) {
        const updated = await ClienteRepository.updateCliente(this.id, {
          nome: this.nome,
          endereco: this.endereco,
          telefone: this.telefone,
        });
        return updated ? new ClienteEntity(updated) : null;
      } else {
        const created = await ClienteRepository.createCliente({
          nome: this.nome,
          endereco: this.endereco,
          telefone: this.telefone,
        });
        return new ClienteEntity(created);
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      throw error;
    }
  }

  static async getClientesByFilters({
    nome,
  }: {
    nome?: string | null;
  }): Promise<ClienteEntity[]> {
    const servicos = await ClienteRepository.getClientesByFilters({
      nome,
    });
    return servicos.map((cliente) => new ClienteEntity(cliente));
  }

  static async getAllClientes(): Promise<ClienteEntity[]> {
    try {
      const clientes = await ClienteRepository.getAllClientes();
      return clientes.map((cliente) => new ClienteEntity(cliente));
    } catch (error) {
      console.error("Erro ao obter todos os clientes:", error);
      throw error;
    }
  }

  static async getClienteById(id: number): Promise<ClienteEntity | null> {
    try {
      const cliente = await ClienteRepository.getClienteById(id);
      return cliente ? new ClienteEntity(cliente) : null;
    } catch (error) {
      console.error("Erro ao obter cliente por ID:", error);
      throw error;
    }
  }

  static async deleteCliente(id: number): Promise<ClienteEntity | null> {
    try {
      const cliente = await ClienteRepository.deleteCliente(id);
      return cliente ? new ClienteEntity(cliente) : null;
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  }
}
