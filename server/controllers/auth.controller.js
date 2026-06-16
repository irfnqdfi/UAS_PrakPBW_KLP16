const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// ── Register ─────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, gender, age, height, weight, activity_level, goal } = req.body;

    // Validasi field wajib
    if (!name || !email || !password || !gender || !age || !height || !weight) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    // Cek email sudah terdaftar
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        activity_level: activity_level || 'moderately_active',
        goal: goal || 'maintaining',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: { user: userWithoutPassword, token },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Gagal melakukan registrasi.' });
  }
};

// ── Login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Login berhasil!',
      data: { user: userWithoutPassword, token },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Gagal melakukan login.' });
  }
};

// ── Get Current User ──────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, gender: true,
        age: true, height: true, weight: true,
        activity_level: true, goal: true, created_at: true,
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
  }
};

module.exports = { register, login, getMe };
