import { Request, Response } from "express";
import ClienteEntity from "../Entity/ClienteEntity";

export async function getAllClientes(req: Request, res: Response) {
  try {
    const { filtro } = req.params;
    const clientes = await ClienteEntity.getAllClientes();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error getting clients:", error);
    res.status(500).json({ message: "Error getting clients" });
  }
}

export async function getClientesByFilters(req: Request, res: Response) {
  const { nome } = req.query;

  try {
    const servicos = await ClienteEntity.getClientesByFilters({
      nome: nome ? String(nome) : null,
    });

    res.status(200).json(servicos);
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json({ message: "Error getting services" });
  }
}

export async function getClienteById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const cliente = await ClienteEntity.getClienteById(Number(id));
    cliente
      ? res.status(200).json(cliente)
      : res.status(404).json({ message: "Client not found" });
  } catch (error) {
    console.error("Error getting client:", error);
    res.status(500).json({ message: "Error getting client" });
  }
}

export async function createCliente(req: Request, res: Response) {
  const clienteData = req.body;
  try {
    const cliente = new ClienteEntity(clienteData);
    const createdCliente = await cliente.saveCliente();
    res.status(201).json(createdCliente);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Error creating client" });
  }
}

export async function updateCliente(req: Request, res: Response) {
  const { id } = req.params;
  const clienteData = req.body;
  try {
    const cliente = await ClienteEntity.getClienteById(Number(id));
    if (cliente) {
      Object.assign(cliente, clienteData);
      const updatedCliente = await cliente.saveCliente();
      res.status(200).json(updatedCliente);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Error updating client" });
  }
}

export async function deleteCliente(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const cliente = await ClienteEntity.deleteCliente(Number(id));
    cliente
      ? res.status(200).json({ message: "Client deleted successfully" })
      : res.status(404).json({ message: "Client not found" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Error deleting client" });
  }
}
