const { performance } = require('perf_hooks');

const members = Array.from({ length: 1000 }, (_, i) => ({
  id: `member-${i}`,
  experience_points: Math.floor(Math.random() * 10000),
  level: { level_number: Math.floor(Math.random() * 50) + 1 }
}));

const levels = Array.from({ length: 100 }, (_, i) => ({
  level_number: i + 1,
  required_progress: i * 1000
}));

// Before optimization
function before() {
  const start = performance.now();
  for (let iter = 0; iter < 100; iter++) {
    const entries = members.map((m, index) => {
      const currentXP = m.experience_points || 0;
      const currentLevelNum = m.level?.level_number || 1;
      const nextLevel = levels.find((l) => l.level_number === currentLevelNum + 1);
      const nextLevelXP = nextLevel?.required_progress || currentXP;
      return { nextLevelXP };
    });
  }
  const end = performance.now();
  return end - start;
}

// After optimization
function after() {
  const start = performance.now();
  for (let iter = 0; iter < 100; iter++) {
    const levelMap = new Map();
    levels.forEach(l => levelMap.set(l.level_number, l));

    const entries = members.map((m, index) => {
      const currentXP = m.experience_points || 0;
      const currentLevelNum = m.level?.level_number || 1;
      const nextLevel = levelMap.get(currentLevelNum + 1);
      const nextLevelXP = nextLevel?.required_progress || currentXP;
      return { nextLevelXP };
    });
  }
  const end = performance.now();
  return end - start;
}

const timeBefore = before();
const timeAfter = after();

console.log(`Before: ${timeBefore} ms`);
console.log(`After: ${timeAfter} ms`);
console.log(`Improvement: ${((timeBefore - timeAfter) / timeBefore * 100).toFixed(2)}%`);
