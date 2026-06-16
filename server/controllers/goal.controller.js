const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const data = await prisma.fitnessGoal.findMany({ where: { user_id: req.user.id }, orderBy: { created_at: 'desc' } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const getOne = async (req, res) => {
  try {
    const data = await prisma.fitnessGoal.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!data) return res.status(404).json({ success: false, message: 'Goal tidak ditemukan.' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const create = async (req, res) => {
  try {
    const { goal_type, target_weight, target_body_fat, target_calories, target_protein, target_water, deadline, notes } = req.body;
    if (!goal_type) return res.status(400).json({ success: false, message: 'Tipe goal wajib dipilih.' });
    const data = await prisma.fitnessGoal.create({
      data: {
        user_id: req.user.id, goal_type,
        target_weight: target_weight ? parseFloat(target_weight) : null,
        target_body_fat: target_body_fat ? parseFloat(target_body_fat) : null,
        target_calories: target_calories ? parseFloat(target_calories) : null,
        target_protein: target_protein ? parseFloat(target_protein) : null,
        target_water: target_water ? parseFloat(target_water) : null,
        deadline: deadline ? new Date(deadline) : null, notes,
      },
    });
    res.status(201).json({ success: true, message: 'Goal berhasil dibuat.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menyimpan data.' }); }
};

const update = async (req, res) => {
  try {
    const existing = await prisma.fitnessGoal.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Goal tidak ditemukan.' });
    const { goal_type, target_weight, target_body_fat, target_calories, target_protein, target_water, deadline, is_active, notes } = req.body;
    const data = await prisma.fitnessGoal.update({
      where: { id: parseInt(req.params.id) },
      data: {
        goal_type: goal_type ?? existing.goal_type,
        target_weight: target_weight !== undefined ? parseFloat(target_weight) : existing.target_weight,
        target_body_fat: target_body_fat !== undefined ? parseFloat(target_body_fat) : existing.target_body_fat,
        target_calories: target_calories !== undefined ? parseFloat(target_calories) : existing.target_calories,
        target_protein: target_protein !== undefined ? parseFloat(target_protein) : existing.target_protein,
        target_water: target_water !== undefined ? parseFloat(target_water) : existing.target_water,
        deadline: deadline ? new Date(deadline) : existing.deadline,
        is_active: is_active !== undefined ? Boolean(is_active) : existing.is_active,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });
    res.json({ success: true, message: 'Goal berhasil diupdate.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengupdate data.' }); }
};

const remove = async (req, res) => {
  try {
    const existing = await prisma.fitnessGoal.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Goal tidak ditemukan.' });
    await prisma.fitnessGoal.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Goal berhasil dihapus.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menghapus data.' }); }
};

module.exports = { getAll, getOne, create, update, remove };
