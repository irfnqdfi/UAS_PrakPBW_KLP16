const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
  try {
    const { name, gender, age, height, weight, activity_level, goal } = req.body;
    const data = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name ?? undefined,
        gender: gender ?? undefined,
        age: age ? parseInt(age) : undefined,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        activity_level: activity_level ?? undefined,
        goal: goal ?? undefined,
      },
      select: { id: true, name: true, email: true, gender: true, age: true, height: true, weight: true, activity_level: true, goal: true },
    });
    res.json({ success: true, message: 'Profil berhasil diupdate.', data });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengupdate profil.' }); }
};

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password)
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const match = await bcrypt.compare(old_password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Password lama salah.' });
    const hashed = await bcrypt.hash(new_password, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengubah password.' }); }
};

module.exports = { updateProfile, changePassword };
