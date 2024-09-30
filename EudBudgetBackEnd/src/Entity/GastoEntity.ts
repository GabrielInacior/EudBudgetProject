import GastoRepository from "../Repository/GastoRepository";

export default class GastoEntity {
  id: number;
  nome: string;
  valor: number;
  data: Date;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.valor = data.valor;
    this.data = data.data;
  }

  async saveGasto(): Promise<GastoEntity | null> {
    try {
      if (this.id) {
        const updated = await GastoRepository.updateGasto(this.id, {
          nome: this.nome,
          valor: this.valor,
          data: this.data,
        });
        return updated ? new GastoEntity(updated) : null;
      } else {
        const created = await GastoRepository.createGasto({
          nome: this.nome,
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
