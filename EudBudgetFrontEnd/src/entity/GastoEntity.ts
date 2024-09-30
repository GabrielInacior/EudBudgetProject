export default class GastoEntity {
  id: number
  nome: string
  valor: number
  data: Date

  constructor(data: any) {
    this.id = data.id
    this.nome = data.nome
    this.valor = data.valor
    this.data = data.data
  }
}
