import { Request, Response } from "express";
import ServicoEntity from "../Entity/ServicoEntity";

export async function getServicosByClienteId(req: Request, res: Response) {
  const { clienteId } = req.params;
  try {
    const servicos = await ServicoEntity.getServicosByClienteId(
      Number(clienteId)
    );
    res.status(200).json(servicos);
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json({ message: "Error getting services" });
  }
}

export async function getServicosByFilters(req: Request, res: Response) {
  const { startDate, endDate, clienteId, nome } = req.query;

  try {
    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    const servicos = await ServicoEntity.getServicosByFilters({
      startDate: start,
      endDate: end,
      clienteId: Number(clienteId),
      nome: nome ? String(nome) : null, // garante que nome seja null se não estiver presente
    });

    res.status(200).json(servicos);
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json({ message: "Error getting services" });
  }
}

export async function getAllServicosByFilters(req: Request, res: Response) {
  const { startDate, endDate, nome } = req.query;

  try {
    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    const servicos = await ServicoEntity.getAllServicosByFilters({
      startDate: start,
      endDate: end,
      nome: nome ? String(nome) : null,
    });

    res.status(200).json(servicos);
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json({ message: "Error getting services" });
  }
}

export async function getServicosByDateRange(req: Request, res: Response) {
  const { startDate, endDate, clienteId } = req.query;

  try {
    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Datas inválidas fornecidas" });
    }

    const servicos = await ServicoEntity.getServicosByDateRange(
      start,
      end,
      Number(clienteId)
    );
    res.status(200).json(servicos);
  } catch (error) {
    console.error("Error getting services by date range:", error);
    res.status(500).json({ message: "Error getting services by date range" });
  }
}
export async function getServicoById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const servico = await ServicoEntity.getServicoById(Number(id));
    servico
      ? res.status(200).json(servico)
      : res.status(404).json({ message: "Service not found" });
  } catch (error) {
    console.error("Error getting service:", error);
    res.status(500).json({ message: "Error getting service" });
  }
}

export async function createServico(req: Request, res: Response) {
  const servicoData = req.body;
  try {
    const servico = new ServicoEntity(servicoData);
    const createdServico = await servico.saveServico();
    res.status(201).json(createdServico);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Error creating service" });
  }
}

export async function updateServico(req: Request, res: Response) {
  const { id } = req.params;
  const servicoData = req.body;
  try {
    const servico = await ServicoEntity.getServicoById(Number(id));
    if (servico) {
      Object.assign(servico, servicoData);
      const updatedServico = await servico.saveServico();
      res.status(200).json(updatedServico);
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Error updating service" });
  }
}

export async function deleteServico(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const servico = await ServicoEntity.deleteServico(Number(id));
    servico
      ? res.status(200).json({ message: "Service deleted successfully" })
      : res.status(404).json({ message: "Service not found" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Error deleting service" });
  }
}
