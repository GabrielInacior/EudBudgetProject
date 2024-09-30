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
const ClienteRepository_1 = __importDefault(require("../Repository/ClienteRepository"));
class ClienteEntity {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.telefone = data.telefone;
        this.endereco = data.endereco;
    }
    saveCliente() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                const updated = yield ClienteRepository_1.default.update(this.id, {
                    nome: this.nome,
                    telefone: this.telefone,
                    endereco: this.endereco,
                });
                return updated ? new ClienteEntity(updated) : null;
            }
            else {
                const created = yield ClienteRepository_1.default.create({
                    nome: this.nome,
                    telefone: this.telefone,
                    endereco: this.endereco,
                });
                return new ClienteEntity(created);
            }
        });
    }
    static getAllClientes() {
        return __awaiter(this, void 0, void 0, function* () {
            const clientes = yield ClienteRepository_1.default.getAll();
            return clientes.map((cliente) => new ClienteEntity(cliente));
        });
    }
    static getClienteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cliente = yield ClienteRepository_1.default.getById(id);
            return cliente ? new ClienteEntity(cliente) : null;
        });
    }
    static deleteCliente(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cliente = yield ClienteRepository_1.default.delete(id);
            return cliente ? new ClienteEntity(cliente) : null;
        });
    }
}
exports.default = ClienteEntity;
