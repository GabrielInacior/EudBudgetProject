export default class ClienteEntity {
  id: number
  nome: string
  endereco: string
  telefone: string

  constructor(data: any) {
    this.id = data.id
    this.nome = data.nome
    this.endereco = data.endereco
    this.telefone = data.telefone
  }
}
