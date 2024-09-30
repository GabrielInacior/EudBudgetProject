-- DropForeignKey
ALTER TABLE "servico" DROP CONSTRAINT "servico_clienteId_fkey";

-- AddForeignKey
ALTER TABLE "servico" ADD CONSTRAINT "servico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
