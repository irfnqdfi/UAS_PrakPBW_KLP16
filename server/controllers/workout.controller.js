const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const { category, date } = req.query;
    const where = { user_id: req.user.id };
    if (category) where.category = category;
    if (date) {
      const start = new Date(date); start.setHours(0,0,0,0);
      const end   = new Date(date); end.setHours(23,59,59,999);
      where.logged_at = { gte: start, lte: end };
    }
    const data = await prisma.workoutLog.findMany({ where, orderBy: { logged_at: 'desc' } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const getOne = async (req, res) => {
  try {
    const data = await prisma.workoutLog.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const create = async (req, res) => {
  try {
    const { session_name, category, exercise_name, sets, reps, weight_used, duration_min, notes } = req.body;
    if (!category || !exercise_name || !sets || !reps)
      return res.status(400).json({ success: false, message: 'Kategori, nama latihan, sets, dan reps wajib diisi.' });
    const data = await prisma.workoutLog.create({
      data: {
        user_id: req.user.id,
        session_name, category, exercise_name,
        sets: parseInt(sets), reps: parseInt(reps),
        weight_used: weight_used ? parseFloat(weight_used) : null,
        duration_min: duration_min ? parseInt(duration_min) : null,
        notes,
      },
    });
    res.status(201).json({ success: true, message: 'Latihan berhasil dicatat.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menyimpan data.' }); }
};

const update = async (req, res) => {
  try {
    const existing = await prisma.workoutLog.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    const { session_name, category, exercise_name, sets, reps, weight_used, duration_min, notes } = req.body;
    const data = await prisma.workoutLog.update({
      where: { id: parseInt(req.params.id) },
      data: {
        session_name: session_name ?? existing.session_name,
        category: category ?? existing.category,
        exercise_name: exercise_name ?? existing.exercise_name,
        sets: sets ? parseInt(sets) : existing.sets,
        reps: reps ? parseInt(reps) : existing.reps,
        weight_used: weight_used !== undefined ? parseFloat(weight_used) : existing.weight_used,
        duration_min: duration_min !== undefined ? parseInt(duration_min) : existing.duration_min,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });
    res.json({ success: true, message: 'Data berhasil diupdate.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengupdate data.' }); }
};

const remove = async (req, res) => {
  try {
    const existing = await prisma.workoutLog.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    await prisma.workoutLog.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menghapus data.' }); }
};

module.exports = { getAll, getOne, create, update, remove };
