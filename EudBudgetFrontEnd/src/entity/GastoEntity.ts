export default class GastoEntity {
  id: number
  nome: string
  descricao: string
  valor: number
  data: Date
  totalGasto: number

  constructor(data: any) {
    this.id = data.id
    this.nome = data.nome
    this.descricao = data.descricao
    this.valor = data.valor
    this.data = data.data
  }
}
