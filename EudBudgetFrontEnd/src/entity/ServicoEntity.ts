export default class ServicoEntity {
  id: number
  nome: string
  data: Date
  valor: number
  clienteId: number

  constructor(data: any) {
    this.id = data.id
    this.nome = data.nome
    this.data = data.data
    this.valor = data.valor
    this.clienteId = data.clienteId
  }
}
