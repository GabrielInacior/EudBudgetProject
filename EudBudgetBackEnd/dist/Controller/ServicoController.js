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
exports.getAllServicos = getAllServicos;
exports.getServicoById = getServicoById;
exports.createServico = createServico;
exports.updateServico = updateServico;
exports.deleteServico = deleteServico;
const ServicoEntity_1 = __importDefault(require("../Entity/ServicoEntity"));
function getAllServicos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const servicos = yield ServicoEntity_1.default.getAllServicos();
            res.status(200).json(servicos);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao obter serviços" });
        }
    });
}
function getServicoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const servico = yield ServicoEntity_1.default.getServicoById(Number(id));
            if (servico) {
                res.status(200).json(servico);
            }
            else {
                res.status(404).json({ message: "Serviço não encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao obter serviço" });
        }
    });
}
function createServico(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const servicoData = req.body;
        try {
            const servico = new ServicoEntity_1.default(servicoData);
            const createdServico = yield servico.saveServico();
            res.status(201).json(createdServico);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao criar serviço" });
        }
    });
}
function updateServico(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const servicoData = req.body;
        try {
            const servico = yield ServicoEntity_1.default.getServicoById(Number(id));
            if (servico) {
                Object.assign(servico, servicoData);
                const updatedServico = yield servico.saveServico();
                res.status(200).json(updatedServico);
            }
            else {
                res.status(404).json({ message: "Serviço não encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar serviço" });
        }
    });
}
function deleteServico(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const servico = yield ServicoEntity_1.default.deleteServico(Number(id));
            if (servico) {
                res.status(200).json({ message: "Serviço deletado com sucesso" });
            }
            else {
                res.status(404).json({ message: "Serviço não encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao deletar serviço" });
        }
    });
}
