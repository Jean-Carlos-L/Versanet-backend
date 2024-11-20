import { HistoryService } from "../services/history.service.js";

export const getHistoryByEntity = async (req, res) => {
  try {
    const { entity } = req.params;
    const filters = req.query;
    const response = await HistoryService.getHistoryByEntity(entity, filters);
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const countHistoryByEntity = async (req, res) => {
  try {
    const { entity } = req.params;
    const response = await HistoryService.countHistoryByEntity(entity);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params; // El ID llega desde la ruta
    const response = await HistoryService.getHistoryById(id);
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllHistory = async (req, res) => {
  try {
    const response = await HistoryService.getAllHistory();
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
