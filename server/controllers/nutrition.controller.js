const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const data = await prisma.nutritionLog.findMany({ where: { user_id: req.user.id }, orderBy: { logged_at: 'desc' } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const getOne = async (req, res) => {
  try {
    const data = await prisma.nutritionLog.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const create = async (req, res) => {
  try {
    const { calories, protein, carbs, fat, water_intake, meal_notes } = req.body;
    if (!calories || !protein || !carbs || !fat || !water_intake)
      return res.status(400).json({ success: false, message: 'Semua field nutrisi wajib diisi.' });
    const data = await prisma.nutritionLog.create({
      data: {
        user_id: req.user.id,
        calories: parseFloat(calories), protein: parseFloat(protein),
        carbs: parseFloat(carbs), fat: parseFloat(fat),
        water_intake: parseFloat(water_intake), meal_notes,
      },
    });
    res.status(201).json({ success: true, message: 'Nutrisi berhasil dicatat.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menyimpan data.' }); }
};

const update = async (req, res) => {
  try {
    const existing = await prisma.nutritionLog.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    const { calories, protein, carbs, fat, water_intake, meal_notes } = req.body;
    const data = await prisma.nutritionLog.update({
      where: { id: parseInt(req.params.id) },
      data: {
        calories: calories ? parseFloat(calories) : existing.calories,
        protein: protein ? parseFloat(protein) : existing.protein,
        carbs: carbs ? parseFloat(carbs) : existing.carbs,
        fat: fat ? parseFloat(fat) : existing.fat,
        water_intake: water_intake ? parseFloat(water_intake) : existing.water_intake,
        meal_notes: meal_notes !== undefined ? meal_notes : existing.meal_notes,
      },
    });
    res.json({ success: true, message: 'Data berhasil diupdate.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengupdate data.' }); }
};

const remove = async (req, res) => {
  try {
    const existing = await prisma.nutritionLog.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    await prisma.nutritionLog.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menghapus data.' }); }
};

module.exports = { getAll, getOne, create, update, remove };
