import GastoRepository from "../Repository/GastoRepository";

export default class GastoEntity {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  data: Date;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.valor = data.valor;
    this.data = data.data;
  }

  async saveGasto(): Promise<GastoEntity | null> {
    try {
      if (this.id) {
        const updated = await GastoRepository.updateGasto(this.id, {
          nome: this.nome,
          descricao: this.descricao,
          valor: this.valor,
          data: this.data,
        });
        return updated ? new GastoEntity(updated) : null;
      } else {
        const created = await GastoRepository.createGasto({
          nome: this.nome,
          descricao: this.descricao,
          valor: this.valor,
          data: this.data,
        });
        return new GastoEntity(created);
      }
    } catch (error) {
      console.error("Erro ao salvar gasto:", error);
      throw error;
    }
  }

  static async getGastosByFilters({
    startDate,
    endDate,
    nome,
  }: {
    startDate?: Date | null;
    endDate?: Date | null;
    nome?: string | null;
  }): Promise<GastoEntity[]> {
    const servicos = await GastoRepository.getGastosByFilters({
      startDate,
      endDate,
      nome,
    });
    return servicos.map((gasto) => new GastoEntity(gasto));
  }

  static async getGastosByDateRange(startDate: Date, endDate: Date) {
    const gastos = await GastoRepository.getGastosByDateRange(
      startDate,
      endDate
    );
    return gastos.map((gasto) => new GastoEntity(gasto));
  }

  static async getAllGastos(): Promise<GastoEntity[]> {
    try {
      const gastos = await GastoRepository.getAllGastos();
      return gastos.map((gasto) => new GastoEntity(gasto));
    } catch (error) {
      console.error("Erro ao obter todos os gastos:", error);
      throw error;
    }
  }

  static async getGastoById(id: number): Promise<GastoEntity | null> {
    try {
      const gasto = await GastoRepository.getGastoById(id);
      return gasto ? new GastoEntity(gasto) : null;
    } catch (error) {
      console.error("Erro ao obter gasto por ID:", error);
      throw error;
    }
  }

  static async deleteGasto(id: number): Promise<GastoEntity | null> {
    try {
      const gasto = await GastoRepository.deleteGasto(id);
      return gasto ? new GastoEntity(gasto) : null;
    } catch (error) {
      console.error("Erro ao deletar gasto:", error);
      throw error;
    }
  }
}
