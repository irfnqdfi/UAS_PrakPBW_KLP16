const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Hash passwords ──────────────────────────────────────────
  const hash = await bcrypt.hash('password123', 10);

  // ── 1. USERS ────────────────────────────────────────────────
  const user1 = await prisma.user.upsert({
    where: { email: 'irfan@gymtrack.com' },
    update: {},
    create: {
      name: 'Irfan Maulana',
      email: 'irfan@gymtrack.com',
      password: hash,
      gender: 'male',
      age: 21,
      height: 173,
      weight: 68,
      activity_level: 'moderately_active',
      goal: 'bulking',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sari@gymtrack.com' },
    update: {},
    create: {
      name: 'Sari Dewi',
      email: 'sari@gymtrack.com',
      password: hash,
      gender: 'female',
      age: 22,
      height: 160,
      weight: 55,
      activity_level: 'lightly_active',
      goal: 'cutting',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'budi@gymtrack.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'budi@gymtrack.com',
      password: hash,
      gender: 'male',
      age: 25,
      height: 178,
      weight: 80,
      activity_level: 'very_active',
      goal: 'maintaining',
    },
  });

  console.log('✅ Users seeded');

  // ── 2. BODY MEASUREMENTS ─────────────────────────────────────
  const measurements = [
    { user_id: user1.id, weight: 68.0, body_fat_pct: 18.0, lean_mass: 55.76, chest: 96, waist: 80, hips: 94, arms: 33, thighs: 55 },
    { user_id: user1.id, weight: 68.5, body_fat_pct: 17.8, lean_mass: 56.27, chest: 97, waist: 79, hips: 94, arms: 33.5, thighs: 55.5 },
    { user_id: user1.id, weight: 69.0, body_fat_pct: 17.5, lean_mass: 56.93, chest: 97, waist: 79, hips: 95, arms: 34, thighs: 56 },
    { user_id: user2.id, weight: 55.0, body_fat_pct: 24.0, lean_mass: 41.80, chest: 82, waist: 65, hips: 90, arms: 27, thighs: 50 },
    { user_id: user2.id, weight: 54.5, body_fat_pct: 23.5, lean_mass: 41.69, chest: 82, waist: 64, hips: 89, arms: 27, thighs: 49.5 },
    { user_id: user2.id, weight: 54.0, body_fat_pct: 23.0, lean_mass: 41.58, chest: 81, waist: 63, hips: 89, arms: 26.5, thighs: 49 },
    { user_id: user3.id, weight: 80.0, body_fat_pct: 15.0, lean_mass: 68.0, chest: 104, waist: 85, hips: 98, arms: 38, thighs: 60 },
    { user_id: user3.id, weight: 80.2, body_fat_pct: 14.8, lean_mass: 68.33, chest: 104, waist: 84, hips: 98, arms: 38, thighs: 60 },
    { user_id: user3.id, weight: 80.5, body_fat_pct: 14.9, lean_mass: 68.50, chest: 105, waist: 84, hips: 98, arms: 38.5, thighs: 60.5 },
    { user_id: user1.id, weight: 69.5, body_fat_pct: 17.2, lean_mass: 57.54, chest: 98, waist: 78, hips: 95, arms: 34.5, thighs: 56.5 },
  ];

  for (const m of measurements) {
    await prisma.bodyMeasurement.create({ data: m });
  }
  console.log('✅ Body measurements seeded');

  // ── 3. WORKOUT LOGS ──────────────────────────────────────────
  const workouts = [
    { user_id: user1.id, session_name: 'Push Day', category: 'chest', exercise_name: 'Bench Press', sets: 4, reps: 8, weight_used: 60 },
    { user_id: user1.id, session_name: 'Push Day', category: 'shoulders', exercise_name: 'Overhead Press', sets: 3, reps: 10, weight_used: 40 },
    { user_id: user1.id, session_name: 'Pull Day', category: 'back', exercise_name: 'Deadlift', sets: 4, reps: 6, weight_used: 100 },
    { user_id: user1.id, session_name: 'Pull Day', category: 'back', exercise_name: 'Barbell Row', sets: 3, reps: 8, weight_used: 60 },
    { user_id: user1.id, session_name: 'Leg Day', category: 'legs', exercise_name: 'Squat', sets: 4, reps: 8, weight_used: 80 },
    { user_id: user2.id, session_name: 'Full Body', category: 'full_body', exercise_name: 'Dumbbell Squat', sets: 3, reps: 12, weight_used: 15 },
    { user_id: user2.id, session_name: 'Cardio', category: 'cardio', exercise_name: 'Treadmill', sets: 1, reps: 1, duration_min: 30 },
    { user_id: user2.id, session_name: 'Full Body', category: 'arms', exercise_name: 'Bicep Curl', sets: 3, reps: 12, weight_used: 8 },
    { user_id: user3.id, session_name: 'PPL - Push', category: 'chest', exercise_name: 'Incline Press', sets: 4, reps: 10, weight_used: 70 },
    { user_id: user3.id, session_name: 'PPL - Legs', category: 'legs', exercise_name: 'Leg Press', sets: 4, reps: 12, weight_used: 120 },
  ];

  for (const w of workouts) {
    await prisma.workoutLog.create({ data: w });
  }
  console.log('✅ Workout logs seeded');

  // ── 4. NUTRITION LOGS ────────────────────────────────────────
  const nutrition = [
    { user_id: user1.id, calories: 2800, protein: 160, carbs: 320, fat: 80, water_intake: 3.0 },
    { user_id: user1.id, calories: 2750, protein: 155, carbs: 310, fat: 78, water_intake: 2.8 },
    { user_id: user1.id, calories: 2900, protein: 165, carbs: 335, fat: 82, water_intake: 3.2 },
    { user_id: user1.id, calories: 2650, protein: 150, carbs: 300, fat: 75, water_intake: 2.5 },
    { user_id: user2.id, calories: 1600, protein: 120, carbs: 160, fat: 50, water_intake: 2.0 },
    { user_id: user2.id, calories: 1550, protein: 118, carbs: 155, fat: 48, water_intake: 2.2 },
    { user_id: user2.id, calories: 1620, protein: 122, carbs: 162, fat: 51, water_intake: 2.1 },
    { user_id: user3.id, calories: 3000, protein: 180, carbs: 350, fat: 90, water_intake: 3.5 },
    { user_id: user3.id, calories: 2980, protein: 178, carbs: 345, fat: 88, water_intake: 3.3 },
    { user_id: user3.id, calories: 3020, protein: 182, carbs: 355, fat: 92, water_intake: 3.6 },
  ];

  for (const n of nutrition) {
    await prisma.nutritionLog.create({ data: n });
  }
  console.log('✅ Nutrition logs seeded');

  // ── 5. FITNESS GOALS ─────────────────────────────────────────
  const goals = [
    {
      user_id: user1.id, goal_type: 'bulking',
      target_weight: 75, target_body_fat: 15,
      target_calories: 2800, target_protein: 160, target_water: 3.0,
      deadline: new Date('2026-09-01'),
    },
    {
      user_id: user2.id, goal_type: 'cutting',
      target_weight: 50, target_body_fat: 20,
      target_calories: 1600, target_protein: 120, target_water: 2.5,
      deadline: new Date('2026-08-01'),
    },
    {
      user_id: user3.id, goal_type: 'maintaining',
      target_weight: 80, target_body_fat: 14,
      target_calories: 3000, target_protein: 180, target_water: 3.5,
      deadline: new Date('2026-12-31'),
    },
    {
      user_id: user1.id, goal_type: 'bulking',
      target_weight: 72, target_body_fat: 16,
      target_calories: 2600, target_protein: 150, target_water: 2.8,
      deadline: new Date('2026-07-01'),
      is_active: false,
    },
  ];

  for (const g of goals) {
    await prisma.fitnessGoal.create({ data: g });
  }
  console.log('✅ Fitness goals seeded');

  // ── 6. REMINDERS ─────────────────────────────────────────────
  const reminders = [
    { user_id: user1.id, type: 'workout', label: 'Sesi Gym Pagi', time: '06:30', days: 'mon,wed,fri' },
    { user_id: user1.id, type: 'water', label: 'Minum Air Pagi', time: '07:00', days: 'everyday' },
    { user_id: user1.id, type: 'protein', label: 'Sarapan Protein', time: '08:00', days: 'everyday' },
    { user_id: user1.id, type: 'progress_check', label: 'Catat Berat Badan', time: '07:30', days: 'mon' },
    { user_id: user2.id, type: 'workout', label: 'Cardio Sore', time: '16:00', days: 'tue,thu,sat' },
    { user_id: user2.id, type: 'water', label: 'Minum Air Siang', time: '12:00', days: 'everyday' },
    { user_id: user2.id, type: 'protein', label: 'Makan Siang Sehat', time: '12:30', days: 'everyday' },
    { user_id: user3.id, type: 'workout', label: 'Sesi PPL', time: '05:30', days: 'mon,tue,wed,thu,fri,sat' },
    { user_id: user3.id, type: 'water', label: 'Hydration Check', time: '10:00', days: 'everyday' },
    { user_id: user3.id, type: 'progress_check', label: 'Weekly Check-in', time: '08:00', days: 'sun' },
  ];

  for (const r of reminders) {
    await prisma.reminder.create({ data: r });
  }
  console.log('✅ Reminders seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Test accounts:');
  console.log('   irfan@gymtrack.com  | password123 (Bulking)');
  console.log('   sari@gymtrack.com   | password123 (Cutting)');
  console.log('   budi@gymtrack.com   | password123 (Maintaining)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
