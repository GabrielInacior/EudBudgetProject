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
exports.getAllClientes = getAllClientes;
exports.getClienteById = getClienteById;
exports.createCliente = createCliente;
exports.updateCliente = updateCliente;
exports.deleteCliente = deleteCliente;
const ClienteEntity_1 = __importDefault(require("../Entity/ClienteEntity"));
function getAllClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientes = yield ClienteEntity_1.default.getAllClientes();
            res.status(200).json(clientes);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao obter clientes" });
        }
    });
}
function getClienteById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const cliente = yield ClienteEntity_1.default.getClienteById(Number(id));
            if (cliente) {
                res.status(200).json(cliente);
            }
            else {
                res.status(404).json({ message: "Cliente não encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao obter cliente" });
        }
    });
}
function createCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const clienteData = req.body;
        try {
            const cliente = new ClienteEntity_1.default(clienteData);
            const createdCliente = yield cliente.saveCliente();
            res.status(201).json(createdCliente);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao criar cliente" });
        }
    });
}
function updateCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const clienteData = req.body;
        try {
            const cliente = yield ClienteEntity_1.default.getClienteById(Number(id));
            if (cliente) {
                Object.assign(cliente, clienteData);
                const updatedCliente = yield cliente.saveCliente();
                res.status(200).json(updatedCliente);
            }
            else {
                res.status(404).json({ message: "Cliente não encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar cliente" });
        }
    });
}
function deleteCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const cliente = yield ClienteEntity_1.default.deleteCliente(Number(id));
            if (cliente) {
                res.status(200).json({ message: "Cliente deletado com sucesso" });
            }
            else {
                res.status(404).json({ message: "Cliente não encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao deletar cliente" });
        }
    });
}
