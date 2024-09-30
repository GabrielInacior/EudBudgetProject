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
const prisma_1 = __importDefault(require("../config/prisma"));
class ClienteRepository {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.cliente.findMany();
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.cliente.findUnique({ where: { id } });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.cliente.create({ data });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.cliente.update({ where: { id }, data });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.cliente.delete({ where: { id } });
        });
    }
}
exports.default = ClienteRepository;
