import ServicoRepository from "../Repository/ServicoRepository";

export default class ServicoEntity {
  id: number;
  nome: string;
  data: Date;
  valor: number;
  clienteId: number;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.data = data.data;
    this.valor = data.valor;
    this.clienteId = data.clienteId;
  }

  async saveServico(): Promise<ServicoEntity | null> {
    try {
      if (this.id) {
        const updated = await ServicoRepository.updateServico(this.id, {
          nome: this.nome,
          data: this.data,
          valor: this.valor,
          clienteId: this.clienteId,
        });
        return updated ? new ServicoEntity(updated) : null;
      } else {
        const created = await ServicoRepository.createServico({
          nome: this.nome,
          data: this.data,
          valor: this.valor,
          clienteId: this.clienteId,
        });
        return new ServicoEntity(created);
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      throw error;
    }
  }

  static async getServicosByClienteId(
    clienteId: number
  ): Promise<ServicoEntity[]> {
    try {
      const servicos = await ServicoRepository.getServicosByClienteId(
        clienteId
      );
      return servicos.map((servico) => new ServicoEntity(servico));
    } catch (error) {
      console.error("Erro ao obter serviços pelo clienteId:", error);
      throw error;
    }
  }

  static async getServicoById(id: number): Promise<ServicoEntity | null> {
    try {
      const servico = await ServicoRepository.getServicoById(id);
      return servico ? new ServicoEntity(servico) : null;
    } catch (error) {
      console.error("Erro ao obter serviço por ID:", error);
      throw error;
    }
  }

  static async deleteServico(id: number): Promise<ServicoEntity | null> {
    try {
      const servico = await ServicoRepository.deleteServico(id);
      return servico ? new ServicoEntity(servico) : null;
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      throw error;
    }
  }
}
