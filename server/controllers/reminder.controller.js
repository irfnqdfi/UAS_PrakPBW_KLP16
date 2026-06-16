const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const data = await prisma.reminder.findMany({ where: { user_id: req.user.id }, orderBy: { time: 'asc' } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data.' }); }
};

const create = async (req, res) => {
  try {
    const { type, label, time, days } = req.body;
    if (!type || !label || !time || !days)
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    const data = await prisma.reminder.create({ data: { user_id: req.user.id, type, label, time, days } });
    res.status(201).json({ success: true, message: 'Reminder berhasil dibuat.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menyimpan data.' }); }
};

const update = async (req, res) => {
  try {
    const existing = await prisma.reminder.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Reminder tidak ditemukan.' });
    const { type, label, time, days, is_active } = req.body;
    const data = await prisma.reminder.update({
      where: { id: parseInt(req.params.id) },
      data: {
        type: type ?? existing.type, label: label ?? existing.label,
        time: time ?? existing.time, days: days ?? existing.days,
        is_active: is_active !== undefined ? Boolean(is_active) : existing.is_active,
      },
    });
    res.json({ success: true, message: 'Reminder berhasil diupdate.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengupdate data.' }); }
};

const remove = async (req, res) => {
  try {
    const existing = await prisma.reminder.findFirst({ where: { id: parseInt(req.params.id), user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Reminder tidak ditemukan.' });
    await prisma.reminder.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Reminder berhasil dihapus.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal menghapus data.' }); }
};

module.exports = { getAll, create, update, remove };
