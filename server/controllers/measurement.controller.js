const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all measurements for user
const getAll = async (req, res) => {
  try {
    const data = await prisma.bodyMeasurement.findMany({
      where: { user_id: req.user.id },
      orderBy: { recorded_at: 'desc' },
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
  }
};

// GET single measurement
const getOne = async (req, res) => {
  try {
    const data = await prisma.bodyMeasurement.findFirst({
      where: { id: parseInt(req.params.id), user_id: req.user.id },
    });
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
  }
};

// CREATE
const create = async (req, res) => {
  try {
    const { weight, body_fat_pct, chest, waist, hips, arms, thighs, notes } = req.body;
    if (!weight) return res.status(400).json({ success: false, message: 'Berat badan wajib diisi.' });

    // Auto-calculate lean mass
    const lean_mass = body_fat_pct
      ? parseFloat((weight * (1 - body_fat_pct / 100)).toFixed(2))
      : null;

    const data = await prisma.bodyMeasurement.create({
      data: {
        user_id: req.user.id,
        weight: parseFloat(weight),
        body_fat_pct: body_fat_pct ? parseFloat(body_fat_pct) : null,
        lean_mass,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        hips: hips ? parseFloat(hips) : null,
        arms: arms ? parseFloat(arms) : null,
        thighs: thighs ? parseFloat(thighs) : null,
        notes,
      },
    });
    res.status(201).json({ success: true, message: 'Data berhasil disimpan.', data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan data.' });
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    const existing = await prisma.bodyMeasurement.findFirst({
      where: { id: parseInt(req.params.id), user_id: req.user.id },
    });
    if (!existing) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });

    const { weight, body_fat_pct, chest, waist, hips, arms, thighs, notes } = req.body;
    const lean_mass = body_fat_pct && weight
      ? parseFloat((weight * (1 - body_fat_pct / 100)).toFixed(2))
      : existing.lean_mass;

    const data = await prisma.bodyMeasurement.update({
      where: { id: parseInt(req.params.id) },
      data: {
        weight: weight ? parseFloat(weight) : existing.weight,
        body_fat_pct: body_fat_pct ? parseFloat(body_fat_pct) : existing.body_fat_pct,
        lean_mass,
        chest: chest ? parseFloat(chest) : existing.chest,
        waist: waist ? parseFloat(waist) : existing.waist,
        hips: hips ? parseFloat(hips) : existing.hips,
        arms: arms ? parseFloat(arms) : existing.arms,
        thighs: thighs ? parseFloat(thighs) : existing.thighs,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });
    res.json({ success: true, message: 'Data berhasil diupdate.', data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengupdate data.' });
  }
};

// DELETE
const remove = async (req, res) => {
  try {
    const existing = await prisma.bodyMeasurement.findFirst({
      where: { id: parseInt(req.params.id), user_id: req.user.id },
    });
    if (!existing) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });

    await prisma.bodyMeasurement.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus data.' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
