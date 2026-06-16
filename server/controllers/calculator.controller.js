// Pure calculation - no DB needed

const calculate = (req, res) => {
  try {
    const { gender, age, height, weight, activity_level, goal } = req.body;
    if (!gender || !age || !height || !weight || !activity_level || !goal)
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });

    const h = parseFloat(height), w = parseFloat(weight), a = parseInt(age);

    // BMR - Mifflin-St Jeor
    const bmr = gender === 'male'
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const activityMultipliers = {
      sedentary: 1.2, lightly_active: 1.375,
      moderately_active: 1.55, very_active: 1.725, extra_active: 1.9,
    };
    const tdee = bmr * (activityMultipliers[activity_level] || 1.55);

    // Calorie target
    const calorieAdjustment = { bulking: 300, cutting: -400, maintaining: 0 };
    const targetCalories = tdee + (calorieAdjustment[goal] || 0);

    // Macros
    const protein = parseFloat((w * 2.0).toFixed(1));         // 2g/kg
    const fat     = parseFloat((targetCalories * 0.25 / 9).toFixed(1));
    const carbsCal = targetCalories - (protein * 4) - (fat * 9);
    const carbs   = parseFloat((carbsCal / 4).toFixed(1));

    // Water intake: 35ml/kg + extra for activity
    const activityWaterBonus = { sedentary: 0, lightly_active: 0.3, moderately_active: 0.5, very_active: 0.7, extra_active: 1.0 };
    const water = parseFloat(((w * 0.035) + (activityWaterBonus[activity_level] || 0.5)).toFixed(2));

    // Body fat estimate - US Navy (approx, needs measurements)
    // Returning BMI-based estimate as fallback
    const bmi = w / ((h / 100) ** 2);
    const estimatedBodyFat = gender === 'male'
      ? parseFloat((1.20 * bmi + 0.23 * a - 16.2).toFixed(1))
      : parseFloat((1.20 * bmi + 0.23 * a - 5.4).toFixed(1));

    res.json({
      success: true,
      data: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        target_calories: Math.round(targetCalories),
        macros: { protein, carbs, fat },
        water_intake: water,
        estimated_body_fat: estimatedBodyFat,
        bmi: parseFloat(bmi.toFixed(1)),
        goal,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghitung kalori.' });
  }
};

module.exports = { calculate };
