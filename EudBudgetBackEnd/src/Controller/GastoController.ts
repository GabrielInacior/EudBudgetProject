import { Request, Response } from "express";
import GastoEntity from "../Entity/GastoEntity";

export async function getAllGastos(req: Request, res: Response) {
  try {
    const gastos = await GastoEntity.getAllGastos();
    res.status(200).json(gastos);
  } catch (error) {
    console.error("Error getting expenses:", error);
    res.status(500).json({ message: "Error getting expenses" });
  }
}

export async function getGastosByDateRange(req: Request, res: Response) {
  const { startDate, endDate } = req.query;

  try {
    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Datas inválidas fornecidas" });
    }

    const gastos = await GastoEntity.getGastosByDateRange(start, end);
    res.status(200).json(gastos);
  } catch (error) {
    console.error("Error getting expenses by date range:", error);
    res.status(500).json({ message: "Error getting expenses by date range" });
  }
}
export async function getGastosByFilters(req: Request, res: Response) {
  const { startDate, endDate, nome } = req.query;

  try {
    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    const servicos = await GastoEntity.getGastosByFilters({
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

export async function getGastoById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const gasto = await GastoEntity.getGastoById(Number(id));
    gasto
      ? res.status(200).json(gasto)
      : res.status(404).json({ message: "Expense not found" });
  } catch (error) {
    console.error("Error getting expense:", error);
    res.status(500).json({ message: "Error getting expense" });
  }
}

export async function createGasto(req: Request, res: Response) {
  const gastoData = req.body;
  try {
    const gasto = new GastoEntity(gastoData);
    const createdGasto = await gasto.saveGasto();
    res.status(201).json(createdGasto);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Error creating expense" });
  }
}

export async function updateGasto(req: Request, res: Response) {
  const { id } = req.params;
  const gastoData = req.body;
  try {
    const gasto = await GastoEntity.getGastoById(Number(id));
    if (gasto) {
      Object.assign(gasto, gastoData);
      const updatedGasto = await gasto.saveGasto();
      res.status(200).json(updatedGasto);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
}

export async function deleteGasto(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const gasto = await GastoEntity.deleteGasto(Number(id));
    gasto
      ? res.status(200).json({ message: "Expense deleted successfully" })
      : res.status(404).json({ message: "Expense not found" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
}
