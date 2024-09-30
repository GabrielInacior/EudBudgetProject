"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServicoRepository_1 = __importDefault(require("../Repository/ServicoRepository"));
class ServicoEntity {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.valor = data.valor;
        this.clienteId = data.clienteId;
    }
    saveServico() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                const updated = yield ServicoRepository_1.default.updateServico(this.id, {
                    nome: this.nome,
                    valor: this.valor,
                    clienteId: this.clienteId,
                });
                return updated ? new ServicoEntity(updated) : null;
            }
            else {
                const created = yield ServicoRepository_1.default.createServico({
                    nome: this.nome,
                    valor: this.valor,
                    clienteId: this.clienteId,
                });
                return new ServicoEntity(created);
            }
        });
    }
    static getAllServicos() {
        return __awaiter(this, void 0, void 0, function* () {
            const servicos = yield ServicoRepository_1.default.getAllServico();
            return servicos.map((servico) => new ServicoEntity(servico));
        });
    }
    static getServicoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const servico = yield ServicoRepository_1.default.getServicoById(id);
            return servico ? new ServicoEntity(servico) : null;
        });
    }
    static deleteServico(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const servico = yield ServicoRepository_1.default.deleteServico(id);
            return servico ? new ServicoEntity(servico) : null;
        });
    }
}
exports.default = ServicoEntity;
