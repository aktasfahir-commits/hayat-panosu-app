const STORAGE_KEY = 'hayat-panosu';
const POINTS = { max: 10, exceedBonus: 3 };
const CATEGORY_ORDER = ['spor', 'saglik', 'zihin', 'gelisim', 'yasam'];

const CATEGORIES = {
  spor: { label: 'Spor', icon: '🏃', from: '#FF4D4D', to: '#FF6B6B' },
  saglik: { label: 'Sağlık', icon: '💧', from: '#4DA3FF', to: '#1E90FF' },
  zihin: { label: 'Zihin / Rahatlama', icon: '🧘', from: '#A66CFF', to: '#7B3FF2' },
  gelisim: { label: 'Gelişim', icon: '📚', from: '#2ECC71', to: '#27AE60' },
  yasam: { label: 'Yaşam / Hedefler', icon: '💰', from: '#FFA94D', to: '#FF8C42' },
};

const DEFAULT_GOALS = {
  // Spor
  adim: { name: 'Adım', unit: 'adım', icon: '🚶', suggest: 10000, category: 'spor', guide: { description: 'Günde en az 10.000 adım hedefle. Kısa yürüyüşler ve merdiven kullanımı yardımcı olur.', videoUrl: '' } },
  mekik: { name: 'Mekik', unit: 'tekrar', icon: '💪', suggest: 50, category: 'spor', guide: { description: 'Kontrollü mekik hareketiyle core kaslarını güçlendir.', videoUrl: '' } },
  kosu: { name: 'Koşu', unit: 'dakika', icon: '🏃', suggest: 20, category: 'spor', guide: { description: 'Tempolu koşu veya hızlı yürüyüşle kondisyonunu artır.', videoUrl: '' } },
  // Sağlık
  su: { name: 'Su', unit: 'litre', icon: '💧', suggest: 2, category: 'saglik', guide: { description: 'Gün boyunca düzenli su iç. Sabah kalkınca 1 bardak ile başla.', videoUrl: '' } },
  uyku: { name: 'Uyku', unit: 'saat', icon: '😴', suggest: 8, category: 'saglik', guide: { description: '7-8 saat kaliteli uyku hedefle. Yatmadan önce ekran süresini azalt.', videoUrl: '' } },
  vitamin: { name: 'Vitamin', unit: 'adet', icon: '💊', suggest: 1, category: 'saglik', guide: { description: 'Günlük vitamin/takviyeni düzenli al.', videoUrl: '' } },
  // Zihin / Rahatlama
  nefes: { name: 'Nefes', unit: 'dakika', icon: '🌬️', suggest: 5, category: 'zihin', guide: { description: 'Derin nefes egzersizleriyle stresini azalt. 4 saniye al, 4 saniye ver.', videoUrl: '' } },
  meditasyon: { name: 'Meditasyon', unit: 'dakika', icon: '🧘', suggest: 10, category: 'zihin', guide: { description: 'Sessiz bir ortamda nefesine odaklanarak meditasyon yap.', videoUrl: '' } },
  sukur: { name: 'Şükür', unit: 'madde', icon: '🙏', suggest: 3, category: 'zihin', guide: { description: 'Her gün minnettar olduğun birkaç şeyi yaz.', videoUrl: '' } },
  // Gelişim
  kitap: { name: 'Kitap', unit: 'sayfa', icon: '📖', suggest: 20, category: 'gelisim', guide: { description: 'Her gün düzenli kitap oku, sayfa hedefini koru.', videoUrl: '' } },
  dil: { name: 'Dil', unit: 'dakika', icon: '🗣️', suggest: 15, category: 'gelisim', guide: { description: 'Yabancı dil pratiği yap: kelime, dinleme veya konuşma.', videoUrl: '' } },
  ders: { name: 'Ders', unit: 'dakika', icon: '📚', suggest: 30, category: 'gelisim', guide: { description: 'Odaklanmış ders veya çalışma süresi ayır.', videoUrl: '' } },
  // Yaşam / Hedefler
  para: { name: 'Para Biriktirme', unit: '₺', icon: '💰', suggest: 50, category: 'yasam', guide: { description: 'Her gün küçük bir miktar biriktirerek hedefe yaklaş.', videoUrl: '' } },
  gorevler: { name: 'Görevler', unit: 'görev', icon: '✅', suggest: 3, category: 'yasam', guide: { description: 'Günün önemli görevlerini tamamla.', videoUrl: '' } },
  duzen: { name: 'Düzen', unit: 'dakika', icon: '🧹', suggest: 15, category: 'yasam', guide: { description: 'Yaşam alanını düzenlemeye her gün biraz zaman ayır.', videoUrl: '' } },
};

let data = { version: 8, goals: [], days: {}, setupComplete: false };
let selectedDate = today();
let currentView = 'dashboard'; // 'dashboard' | 'library'

// Onboarding state: 0 = kategori, 1 = hedef, 2 = değer
let wizardStep = 0;
let wizardSelectedCategories = [];
let wizardSelectedGoals = [];
let wizardEditMode = false; // pano kuruluyken (ilk açılış) false, sonradan ekleme yapılırken true

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function emptyDay() {
  return { progress: {} };
}

function getDay(date) {
  if (!data.days[date]) data.days[date] = emptyDay();
  return data.days[date];
}

function defaultGoalId(key) { return `default:${key}`; }
function findGoal(id) { return data.goals.find((g) => g.id === id); }
function getActual(date, id) { return data.days[date]?.progress?.[id] ?? 0; }
function hasGoals() { return data.goals.length > 0; }

function inferCategory(goal) {
  if (goal.category && CATEGORIES[goal.category]) return goal.category;
  if (goal.defaultKey && DEFAULT_GOALS[goal.defaultKey]) return DEFAULT_GOALS[goal.defaultKey].category;
  const n = (goal.name || '').toLowerCase();
  if (/adım|adim|mekik|koşu|kosu|antrenman|spor/.test(n)) return 'spor';
  if (/su|uyku|beslen|sağlık|saglik|vitamin/.test(n)) return 'saglik';
  if (/meditasyon|nefes|tapping|rahat|zihin|şükür|sukur/.test(n)) return 'zihin';
  if (/dil|kitap|çalış|calis|okuma|öğren|ogren|gelişim|ders/.test(n)) return 'gelisim';
  if (/para|görev|gorev|biriktir|yaşam|düzen|duzen/.test(n)) return 'yasam';
  return 'gelisim';
}

function getDailyGoals(date) {
  return data.goals.map((g) => ({
    id: g.id,
    name: g.name,
    category: g.category,
    target: g.target,
    unit: g.unit || '',
    icon: g.icon || CATEGORIES[g.category]?.icon || '🎯',
    actual: getActual(date, g.id),
    defaultKey: g.defaultKey || null,
    guide: g.guide || { description: '', videoUrl: '' },
  }));
}

/* ---------------- Veri yükleme / migration ---------------- */

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (parsed && parsed.version === 8) {
      data = {
        version: 8,
        goals: Array.isArray(parsed.goals) ? parsed.goals : [],
        days: parsed.days || {},
        setupComplete: !!parsed.setupComplete,
      };
      return;
    }
    migrateToV8(parsed || {});
  } catch {
    data = { version: 8, goals: [], days: {}, setupComplete: false };
  }
}

// Eski sürümlerden (v5/v6/v7) hedefleri ve günlük ilerlemeyi taşır.
// Ruh hali ve notlar yeni sürümde kaldırıldığı için bilinçli olarak düşürülür.
function migrateToV8(parsed) {
  let rawGoals = [];

  if (Array.isArray(parsed.goals)) {
    rawGoals = parsed.goals.slice();
  } else {
    Object.entries(parsed.defaultGoals || {}).forEach(([key, target]) => {
      if (target > 0 && DEFAULT_GOALS[key]) {
        const def = DEFAULT_GOALS[key];
        rawGoals.push({ id: defaultGoalId(key), name: def.name, target, unit: def.unit, defaultKey: key, icon: def.icon });
      }
    });
    (parsed.customGoals || []).forEach((g) => rawGoals.push(g));
    (parsed.habits || []).forEach((h) => {
      if (!rawGoals.some((x) => (x.name || '').toLowerCase() === (h.name || '').toLowerCase())) {
        rawGoals.push(h);
      }
    });
  }

  const goals = rawGoals
    .map((g) => ({
      id: g.id || (g.defaultKey ? defaultGoalId(g.defaultKey) : generateId()),
      name: g.name,
      target: Number(g.target) || 0,
      unit: g.unit || '',
      category: inferCategory(g),
      icon: g.icon || (g.defaultKey && DEFAULT_GOALS[g.defaultKey]?.icon) || '',
      ...(g.defaultKey ? { defaultKey: g.defaultKey } : {}),
      guide: g.guide || (g.defaultKey && DEFAULT_GOALS[g.defaultKey]?.guide) || { description: '', videoUrl: '' },
    }))
    .filter((g) => g.name && g.target > 0);

  const days = {};
  Object.entries(parsed.days || {}).forEach(([date, day]) => {
    const progress = { ...(day.progress || day.goalProgress || {}) };
    Object.entries(day.habitProgress || {}).forEach(([id, p]) => {
      if (p && p.actual !== undefined) progress[id] = p.actual;
    });
    Object.keys(progress).forEach((k) => {
      if (!(Number(progress[k]) > 0)) delete progress[k];
    });
    if (Object.keys(progress).length) days[date] = { progress };
  });

  data = {
    version: 8,
    goals,
    days,
    setupComplete: goals.length > 0 || !!parsed.setupComplete,
  };
  saveData();
}

function pruneEmptyDays() {
  Object.keys(data.days).forEach((date) => {
    const day = data.days[date];
    const has = Object.values(day.progress || {}).some((v) => v > 0);
    if (!has) delete data.days[date];
  });
}

function saveData() {
  pruneEmptyDays();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------------- Yardımcılar ---------------- */

function formatTurkishDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatNumber(n) {
  return Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();
}

function shiftDate(s, days) {
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function getProgress(actual, target) {
  const a = Number(actual) || 0;
  const t = Number(target) || 0;
  if (t <= 0) return { percent: 0, barWidth: 0, exceeded: false };
  const ratio = a / t;
  const percent = Math.round(ratio * 100);
  return { percent, barWidth: Math.min(100, percent), exceeded: ratio > 1 };
}

function calcPoints(actual, target) {
  const { exceeded } = getProgress(actual, target);
  if (!target || target <= 0) return { bonus: 0, total: 0 };
  const base = Math.min((actual || 0) / target, 1) * POINTS.max;
  const bonus = exceeded ? POINTS.exceedBonus : 0;
  return { bonus, total: Math.round((base + bonus) * 10) / 10 };
}

function dailyProgressPercent(date) {
  const goals = getDailyGoals(date);
  if (!goals.length) return { percent: 0, count: 0 };
  const sum = goals.reduce((s, g) => s + getProgress(g.actual, g.target).percent, 0);
  return { percent: Math.round(sum / goals.length), count: goals.length };
}

function dayHasActivity(date) {
  return getDailyGoals(date).some((g) => g.actual > 0);
}

function dayHasCategoryActivity(date, cat) {
  return getDailyGoals(date).filter((g) => g.category === cat).some((g) => g.actual > 0);
}

function calcStreak(checkFn) {
  let streak = 0;
  let date = today();
  if (!checkFn(date)) date = shiftDate(date, -1);
  while (checkFn(date)) {
    streak++;
    date = shiftDate(date, -1);
  }
  return streak;
}

function getGeneralStreak() { return calcStreak(dayHasActivity); }
function getCategoryStreak(cat) { return calcStreak((date) => dayHasCategoryActivity(date, cat)); }

function getActiveCategories() {
  const cats = new Set(data.goals.map((g) => g.category));
  return CATEGORY_ORDER.filter((c) => cats.has(c));
}

function escapeHtml(t) {
  const d = document.createElement('div');
  d.textContent = t == null ? '' : t;
  return d.innerHTML;
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add('hidden'), 2400);
}

function populateCategorySelects() {
  const options = CATEGORY_ORDER.map((id) => {
    const c = CATEGORIES[id];
    return `<option value="${id}">${c.icon} ${c.label}</option>`;
  }).join('');
  ['goal-category', 'lib-custom-category'].forEach((id) => {
    const sel = document.getElementById(id);
    if (sel) sel.innerHTML = options;
  });
}

/* ---------------- Dashboard render ---------------- */

function renderGoalCard(g) {
  const p = getProgress(g.actual, g.target);
  const pts = calcPoints(g.actual, g.target);
  const cat = CATEGORIES[g.category] || CATEGORIES.gelisim;
  const catStreak = getCategoryStreak(g.category);
  const unit = g.unit ? ` ${escapeHtml(g.unit)}` : '';
  const hasGuide = g.guide?.description || g.guide?.videoUrl;

  return `
    <article class="goal-card cat-${g.category}" id="goal-card-${g.id}" style="--cat-from:${cat.from};--cat-to:${cat.to}">
      <div class="goal-card-top">
        <span class="goal-card-name">${g.icon ? g.icon + ' ' : ''}${escapeHtml(g.name)}</span>
        <span class="goal-card-top-right">
          ${hasGuide ? `<button type="button" class="btn-guide" data-action="show-guide" data-id="${g.id}" title="Nasıl yapılır?" aria-label="Nasıl yapılır?">?</button>` : ''}
          <span class="goal-card-points${p.exceeded ? ' exceeded' : ''}">+${pts.total}${p.exceeded ? ' ⭐' : ''}</span>
        </span>
      </div>
      <div class="goal-card-bar">
        <div class="goal-card-bar-fill" style="width:${p.barWidth}%"></div>
      </div>
      <div class="goal-card-meta">
        <span class="goal-card-target">
          <strong>${formatNumber(g.actual || 0)}</strong> / ${formatNumber(g.target)}${unit}
          <button type="button" class="btn-edit-target" data-action="edit-target" data-id="${g.id}" title="Hedef değerini düzenle" aria-label="Hedef değerini düzenle">✏️</button>
        </span>
        <span class="goal-card-meta-right">
          <span class="goal-streak-mini">🔥 ${catStreak}</span>
          <span class="goal-card-percent">%${p.percent}</span>
        </span>
      </div>
      <div class="goal-edit-row hidden" id="edit-${g.id}">
        <label for="edit-input-${g.id}">Yeni hedef</label>
        <input type="number" class="goal-edit-input" id="edit-input-${g.id}" value="${formatNumber(g.target)}" min="0.01" step="any">
        ${g.unit ? `<span class="unit-label">${escapeHtml(g.unit)}</span>` : ''}
        <button type="button" class="btn btn-primary btn-sm" data-action="save-target" data-id="${g.id}">Kaydet</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="cancel-target" data-id="${g.id}">İptal</button>
      </div>
      <div class="goal-card-input">
        <div class="actual-input-wrap">
          <input type="number" id="actual-${g.id}" class="actual-input" data-action="update-goal"
            value="${g.actual || ''}" min="0" step="any" placeholder="0" aria-label="Gerçekleşen ${escapeHtml(g.name)}">
          ${g.unit ? `<span class="unit-label">${escapeHtml(g.unit)}</span>` : ''}
          <button type="button" class="btn-save" data-action="save-goal" data-id="${g.id}">Kaydet</button>
        </div>
        <span class="save-indicator" id="saved-${g.id}"><span class="save-check">✓</span> Kaydedildi</span>
      </div>
    </article>`;
}

function renderGoalsByCategory() {
  const container = document.getElementById('goals-by-category');
  const empty = document.getElementById('goals-empty');
  const goals = getDailyGoals(selectedDate);

  if (!goals.length) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  const grouped = {};
  goals.forEach((g) => {
    if (!grouped[g.category]) grouped[g.category] = [];
    grouped[g.category].push(g);
  });

  container.innerHTML = CATEGORY_ORDER.filter((c) => grouped[c]).map((catId) => {
    const cat = CATEGORIES[catId];
    const streak = getCategoryStreak(catId);
    return `
      <section class="category-block cat-${catId}" style="--cat-from:${cat.from};--cat-to:${cat.to}">
        <header class="category-header">
          <span class="category-badge">${cat.icon} ${cat.label}</span>
          <span class="category-streak">🔥 ${streak} gün streak</span>
        </header>
        <div class="category-goals">${grouped[catId].map(renderGoalCard).join('')}</div>
      </section>`;
  }).join('');
}

function renderStreaks() {
  const general = getGeneralStreak();
  document.getElementById('general-streak-text').textContent = `${general} gün streak`;

  const el = document.getElementById('category-streaks');
  const cats = getActiveCategories();
  el.innerHTML = cats.map((id) => {
    const c = CATEGORIES[id];
    const s = getCategoryStreak(id);
    return `<div class="cat-streak-chip cat-${id}" style="--cat-from:${c.from};--cat-to:${c.to}">
      ${c.icon} ${c.label.split(' / ')[0]}: <strong>${s}</strong> gün
    </div>`;
  }).join('');
}

function updateStats() {
  const goals = getDailyGoals(selectedDate);
  const total = goals.length;
  const progressed = goals.filter((g) => g.actual > 0).length;
  const prog = dailyProgressPercent(selectedDate);
  document.getElementById('progress-percent').textContent = `${prog.percent}%`;
  document.getElementById('progress-fill').style.width = `${Math.min(100, prog.percent)}%`;
  const prefix = selectedDate === today() ? 'Bugün' : 'Bu gün';
  document.getElementById('progress-detail').textContent =
    total > 0 ? `${prefix} ${progressed} / ${total} hedef ilerledi` : 'Henüz hedef yok';
}

function renderManageItem(g) {
  const cat = CATEGORIES[g.category] || CATEGORIES.gelisim;
  const unit = g.unit ? ` ${escapeHtml(g.unit)}` : '';
  return `<li class="template-item" data-id="${g.id}">
    <div class="template-item-info">
      <span class="template-item-name">${g.icon || cat.icon} ${escapeHtml(g.name)}
        <span class="tag-cat cat-${g.category}">${cat.label}</span></span>
      <span class="template-item-meta">${formatNumber(g.target)}${unit}</span>
    </div>
    <div class="template-item-actions">
      <button class="btn btn-icon btn-edit" data-action="edit-goal" data-id="${g.id}">✎</button>
      <button class="btn btn-icon" data-action="delete-goal" data-id="${g.id}">✕</button>
    </div></li>`;
}

function renderGoalsManage() {
  const list = document.getElementById('goals-manage-list');
  const empty = document.getElementById('goals-manage-empty');
  if (!data.goals.length) { list.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  list.innerHTML = data.goals.map(renderManageItem).join('');
}

function render() {
  document.getElementById('selected-date').value = selectedDate;
  document.getElementById('formatted-date').textContent = formatTurkishDate(selectedDate);
  document.getElementById('today-btn').classList.toggle('hidden', selectedDate === today());
  renderStreaks();
  renderGoalsByCategory();
  renderGoalsManage();
  updateStats();
}

/* ---------------- Hedef Kütüphanesi (keşif görünümü) ---------------- */

function renderLibrary() {
  const container = document.getElementById('library-list');
  container.innerHTML = CATEGORY_ORDER.map((catId) => {
    const cat = CATEGORIES[catId];
    const presets = Object.entries(DEFAULT_GOALS).filter(([, d]) => d.category === catId);
    const activeCount = presets.filter(([key]) => data.goals.some((g) => g.defaultKey === key)).length;

    const goals = presets.map(([key, d]) => {
      const active = data.goals.some((g) => g.defaultKey === key);
      const desc = d.guide?.description
        ? `<span class="lib-goal-desc">${escapeHtml(d.guide.description)}</span>` : '';
      const action = active
        ? '<span class="lib-added">✓ Panoda</span>'
        : `<button type="button" class="btn btn-primary btn-sm lib-add-btn" data-action="add-library" data-key="${key}">+ Ekle</button>`;
      return `<div class="lib-goal">
        <div class="lib-goal-info">
          <span class="lib-goal-name">${d.icon} ${escapeHtml(d.name)}</span>
          <span class="lib-goal-meta">~${formatNumber(d.suggest)} ${escapeHtml(d.unit)}</span>
          ${desc}
        </div>
        ${action}
      </div>`;
    }).join('');

    return `<section class="lib-category cat-${catId}" style="--cat-from:${cat.from};--cat-to:${cat.to}">
      <header class="lib-category-header">
        <span class="category-badge">${cat.icon} ${cat.label}</span>
        <span class="lib-category-count">${activeCount}/${presets.length} panoda</span>
      </header>
      <div class="lib-goals">${goals}</div>
    </section>`;
  }).join('');
}

function switchView(view) {
  currentView = view;
  document.getElementById('dashboard-view').classList.toggle('hidden', view !== 'dashboard');
  document.getElementById('library-view').classList.toggle('hidden', view !== 'library');
  if (view === 'library') renderLibrary();
  else render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addFromLibrary(key) {
  const def = DEFAULT_GOALS[key];
  if (!def) return;
  if (data.goals.some((g) => g.defaultKey === key)) return;
  addGoal({
    name: def.name,
    target: def.suggest,
    unit: def.unit,
    category: def.category,
    defaultKey: key,
    icon: def.icon,
    guide: { ...def.guide },
  });
  data.setupComplete = true;
  saveData();
  renderLibrary();
  render();
  showToast(`${def.name} panona eklendi! 🎯`);
}

/* ---------------- Hedef işlemleri ---------------- */

function addGoal({ name, target, unit, category, defaultKey, icon, guide }) {
  const goal = {
    id: defaultKey ? defaultGoalId(defaultKey) : generateId(),
    name,
    target,
    unit: unit || '',
    category: category || 'gelisim',
    icon: icon || '',
    guide: guide || { description: '', videoUrl: '' },
    ...(defaultKey ? { defaultKey } : {}),
  };
  // Aynı default hedef iki kez eklenmesin.
  if (defaultKey && data.goals.some((g) => g.defaultKey === defaultKey)) return null;
  data.goals.push(goal);
  saveData();
  return goal;
}

function deleteGoal(id) {
  data.goals = data.goals.filter((g) => g.id !== id);
  Object.values(data.days).forEach((d) => delete d.progress?.[id]);
  saveData();
}

// Yalnızca hedef değerini günceller (ad ve birim değişmez).
function updateGoalTarget(goalId, rawValue) {
  const value = parseFloat(rawValue);
  if (Number.isNaN(value) || value <= 0) return false;
  const goal = findGoal(goalId);
  if (!goal) return false;
  goal.target = value;
  saveData();
  return true;
}

function updateGoalProgress(goalId, rawValue) {
  const value = rawValue === '' ? 0 : parseFloat(rawValue);
  if (Number.isNaN(value) || value < 0) return false;
  const goal = findGoal(goalId);
  if (!goal) return false;
  const prev = getActual(selectedDate, goalId);
  const prevPts = calcPoints(prev, goal.target).total;
  const day = getDay(selectedDate);
  if (value === 0) delete day.progress[goalId];
  else day.progress[goalId] = value;
  saveData();
  const newPts = calcPoints(value, goal.target).total;
  if (newPts > prevPts) {
    const diff = Math.round((newPts - prevPts) * 10) / 10;
    const exceeded = getProgress(value, goal.target).exceeded && !getProgress(prev, goal.target).exceeded;
    showToast(exceeded ? `Hedef aşıldı! +${diff} puan ⭐` : `+${diff} puan!`);
  }
  return true;
}

// Kayıt sonrası ilgili kartta görsel onay (yeşil ✓ + kısa animasyon) gösterir.
function showSavedIndicator(goalId) {
  const card = document.getElementById(`goal-card-${goalId}`);
  if (card) {
    card.classList.remove('just-saved');
    void card.offsetWidth; // animasyonu yeniden tetiklemek için reflow
    card.classList.add('just-saved');
    clearTimeout(card._savedTimer);
    card._savedTimer = setTimeout(() => card.classList.remove('just-saved'), 700);
  }
  const el = document.getElementById(`saved-${goalId}`);
  if (!el) return;
  el.classList.add('show');
  clearTimeout(el._savedTimer);
  el._savedTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

function showGuide(goalId) {
  const g = findGoal(goalId);
  if (!g) return;
  const guide = g.guide || {};
  document.getElementById('guide-title').textContent = `${g.name} — Nasıl yapılır?`;
  document.getElementById('guide-desc').textContent = guide.description || '';
  document.getElementById('guide-desc').classList.toggle('hidden', !guide.description);
  const wrap = document.getElementById('guide-video-wrap');
  const link = document.getElementById('guide-video-link');
  if (guide.videoUrl) {
    wrap.classList.remove('hidden');
    link.href = guide.videoUrl;
    document.getElementById('guide-empty').classList.add('hidden');
  } else {
    wrap.classList.add('hidden');
    document.getElementById('guide-empty').classList.toggle('hidden', !!guide.description);
  }
  document.getElementById('guide-modal').classList.remove('hidden');
}

/* ---------------- Onboarding sihirbazı (3 adım) ---------------- */

const WIZARD_META = [
  { title: 'Gelişim alanını seç', desc: 'Hangi alanlarda ilerlemek istiyorsun? En az bir kategori seç.' },
  { title: 'Hedeflerini seç', desc: 'Bu alanlarda takip etmek istediğin hedefleri seç veya kendin ekle.' },
  { title: 'Hedef değerlerini belirle', desc: 'Her hedef için günlük ulaşmak istediğin değeri gir.' },
];

function presetUid(key) { return `preset:${key}`; }

function wizardStepValid(step) {
  if (step === 0) return wizardSelectedCategories.length > 0;
  if (step === 1) return wizardSelectedGoals.length > 0;
  if (step === 2) return wizardSelectedGoals.length > 0 && wizardSelectedGoals.every((g) => Number(g.target) > 0);
  return false;
}

function renderWizardCategories() {
  const grid = document.getElementById('category-selection-grid');
  grid.innerHTML = CATEGORY_ORDER.map((id) => {
    const c = CATEGORIES[id];
    const sel = wizardSelectedCategories.includes(id);
    return `<button type="button" class="category-card ${sel ? 'selected' : ''}" data-cat="${id}">
      <span class="category-card-icon">${c.icon}</span>
      <span class="category-card-label">${c.label}</span>
    </button>`;
  }).join('');
  document.getElementById('wizard-empty-categories').classList.toggle('hidden', wizardStepValid(0));
}

function renderWizardGoals() {
  const list = document.getElementById('goal-selection-list');
  list.innerHTML = wizardSelectedCategories.map((catId) => {
    const c = CATEGORIES[catId];
    const presets = Object.entries(DEFAULT_GOALS).filter(([, d]) => d.category === catId);
    const items = presets.map(([key, d]) => {
      const uid = presetUid(key);
      const alreadyActive = data.goals.some((g) => g.defaultKey === key);
      const checked = alreadyActive || wizardSelectedGoals.some((g) => g.uid === uid);
      const note = alreadyActive
        ? '<span class="goal-item-suggest goal-item-added">✓ panoda</span>'
        : `<span class="goal-item-suggest">~${formatNumber(d.suggest)} ${escapeHtml(d.unit)}</span>`;
      return `<div class="goal-item">
        <input type="checkbox" id="wg-${key}" data-action="toggle-goal" data-key="${key}" ${checked ? 'checked' : ''} ${alreadyActive ? 'disabled' : ''}>
        <label for="wg-${key}">${d.icon} ${d.name} ${note}</label>
      </div>`;
    }).join('');
    return `<div class="category-block">
      <div class="category-block-header"><span class="category-card-icon">${c.icon}</span><h3>${c.label}</h3></div>
      ${items || '<p class="empty-text">Bu kategoride hazır hedef yok. Aşağıdan özel hedef ekleyebilirsin.</p>'}
    </div>`;
  }).join('');

  // Özel hedef kategorisi sadece seçilen kategorilerden seçilebilsin.
  const catSel = document.getElementById('wizard-goal-category');
  catSel.innerHTML = wizardSelectedCategories.map((id) => {
    const c = CATEGORIES[id];
    return `<option value="${id}">${c.icon} ${c.label}</option>`;
  }).join('');

  const customs = wizardSelectedGoals.filter((g) => g.custom);
  document.getElementById('wizard-draft-list').innerHTML = customs.map((g) => {
    const cat = CATEGORIES[g.category];
    return `<li class="template-item"><div class="template-item-info">
      <span class="template-item-name">${escapeHtml(g.name)} <span class="tag-cat cat-${g.category}">${cat.label}</span></span>
      <span class="template-item-meta">${escapeHtml(g.unit || '')}</span>
    </div><button type="button" class="btn btn-icon" data-action="rm-custom" data-uid="${g.uid}">✕</button></li>`;
  }).join('');

  document.getElementById('wizard-empty-goals').classList.toggle('hidden', wizardStepValid(1));
}

function renderWizardTargets() {
  const list = document.getElementById('target-input-list');
  list.innerHTML = wizardSelectedGoals.map((g) => {
    const cat = CATEGORIES[g.category];
    const unit = g.unit || cat.label;
    return `<div class="template-item" data-uid="${g.uid}">
      <div class="template-item-info">
        <span class="template-item-name">${g.icon || cat.icon} ${escapeHtml(g.name)}</span>
      </div>
      <span class="template-item-meta">${escapeHtml(unit)}</span>
      <input type="number" data-action="set-target" data-uid="${g.uid}" min="0.01" step="any" value="${g.target || ''}" placeholder="0">
    </div>`;
  }).join('');
  document.getElementById('wizard-empty-targets').classList.toggle('hidden', wizardStepValid(2));
}

function updateWizard() {
  const steps = [
    document.getElementById('wizard-step-categories'),
    document.getElementById('wizard-step-goals'),
    document.getElementById('wizard-step-targets'),
  ];
  steps.forEach((el, i) => el.classList.toggle('hidden', i !== wizardStep));

  document.getElementById('wizard-step-label').textContent = `Adım ${wizardStep + 1} / 3`;
  document.getElementById('wizard-title').textContent = WIZARD_META[wizardStep].title;
  document.getElementById('wizard-desc').textContent = WIZARD_META[wizardStep].desc;

  if (wizardStep === 0) renderWizardCategories();
  else if (wizardStep === 1) renderWizardGoals();
  else renderWizardTargets();

  document.getElementById('wizard-back').disabled = wizardStep === 0;
  const next = document.getElementById('wizard-next');
  next.textContent = wizardStep === 2 ? 'Başla' : 'İleri';
  next.disabled = !wizardStepValid(wizardStep);
}

function showWizard() {
  wizardStep = 0;
  wizardSelectedCategories = [];
  wizardSelectedGoals = [];
  // Pano zaten kuruluysa düzenleme modundayız: kapatma butonu görünür olsun.
  wizardEditMode = hasGoals();
  document.getElementById('wizard-close').classList.toggle('hidden', !wizardEditMode);
  document.getElementById('wizard-overlay').classList.remove('hidden');
  document.body.classList.add('wizard-open');
  updateWizard();
}

function closeWizard() {
  document.getElementById('wizard-overlay').classList.add('hidden');
  document.body.classList.remove('wizard-open');
}

function toggleWizardCategory(catId) {
  const idx = wizardSelectedCategories.indexOf(catId);
  if (idx === -1) {
    wizardSelectedCategories.push(catId);
  } else {
    wizardSelectedCategories.splice(idx, 1);
    // Kategori kaldırılınca o kategorinin seçili hedeflerini de düşür.
    wizardSelectedGoals = wizardSelectedGoals.filter((g) => g.category !== catId);
  }
  updateWizard();
}

function togglePresetGoal(key) {
  const def = DEFAULT_GOALS[key];
  if (!def) return;
  const uid = presetUid(key);
  const idx = wizardSelectedGoals.findIndex((g) => g.uid === uid);
  if (idx === -1) {
    wizardSelectedGoals.push({
      uid,
      defaultKey: key,
      name: def.name,
      unit: def.unit,
      icon: def.icon,
      category: def.category,
      target: def.suggest,
      guide: { ...def.guide },
      custom: false,
    });
  } else {
    wizardSelectedGoals.splice(idx, 1);
  }
  updateWizard();
}

function finishWizard() {
  if (!wizardStepValid(2)) return;
  wizardSelectedGoals.forEach((g) => {
    addGoal({
      name: g.name,
      target: Number(g.target),
      unit: g.unit,
      category: g.category,
      defaultKey: g.defaultKey || undefined,
      icon: g.icon,
      guide: g.guide,
    });
  });
  data.setupComplete = true;
  saveData();
  const wasEdit = wizardEditMode;
  closeWizard();
  render();
  showToast(wasEdit ? 'Yeni hedefler panona eklendi! 🎯' : 'Hayat Panosu hazır! 🔥');
}

/* ---------------- Olaylar ---------------- */

document.getElementById('prev-day').addEventListener('click', () => { selectedDate = shiftDate(selectedDate, -1); render(); });
document.getElementById('next-day').addEventListener('click', () => { selectedDate = shiftDate(selectedDate, 1); render(); });
document.getElementById('today-btn').addEventListener('click', () => { selectedDate = today(); render(); });
const selectedDateInput = document.getElementById('selected-date');
selectedDateInput.addEventListener('change', (e) => { if (e.target.value) { selectedDate = e.target.value; render(); } });
selectedDateInput.addEventListener('click', () => { selectedDateInput.showPicker?.(); });

// Tek tıklamayla temiz ana panoya dönüş: bugüne git, açık modal/formları kapat, en üste kaydır.
function goHome() {
  selectedDate = today();
  document.getElementById('guide-modal').classList.add('hidden');
  document.querySelectorAll('.dashboard details[open]').forEach((d) => d.removeAttribute('open'));
  switchView('dashboard');
}

document.getElementById('home-btn').addEventListener('click', goHome);

// Hedef Kütüphanesi: dashboard <-> kütüphane görünüm geçişi.
document.getElementById('open-library-btn').addEventListener('click', () => switchView('library'));
document.getElementById('back-to-dash-btn').addEventListener('click', () => switchView('dashboard'));
document.getElementById('library-list').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="add-library"]');
  if (btn) addFromLibrary(btn.dataset.key);
});

// Kütüphaneden özel hedef ekleme (havuz dışı, defaultKey'siz).
document.getElementById('lib-custom-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('lib-custom-name').value.trim();
  const category = document.getElementById('lib-custom-category').value;
  const target = parseFloat(document.getElementById('lib-custom-target').value);
  const unit = document.getElementById('lib-custom-unit').value.trim();
  if (!name || Number.isNaN(target) || target <= 0) return;
  addGoal({ name, target, unit, category, guide: { description: '', videoUrl: '' } });
  data.setupComplete = true;
  saveData();
  e.target.reset();
  render();
  showToast(`${name} panona eklendi! 🎯`);
});

// Onboarding sihirbazı kapatma (ilk kurulum dışında).
document.getElementById('wizard-close').addEventListener('click', closeWizard);
document.getElementById('wizard-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'wizard-overlay' && wizardEditMode) closeWizard();
});

const goalsContainer = document.getElementById('goals-by-category');

function saveGoalFromInput(goalId) {
  const input = document.getElementById(`actual-${goalId}`);
  if (!input) return;
  if (updateGoalProgress(goalId, input.value)) {
    render();
    showSavedIndicator(goalId);
  } else {
    render();
  }
}

// "Kaydet" butonuna basıldığında input blur olup erken render tetiklemesin.
goalsContainer.addEventListener('mousedown', (e) => {
  if (e.target.dataset.action === 'save-goal') e.preventDefault();
});

// Değer onaylandığında (blur / Enter) otomatik kaydet.
goalsContainer.addEventListener('change', (e) => {
  if (e.target.dataset.action !== 'update-goal') return;
  saveGoalFromInput(e.target.id.replace('actual-', ''));
});

goalsContainer.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  if (action === 'show-guide') { showGuide(id); return; }
  if (action === 'save-goal') { saveGoalFromInput(id); return; }
  if (action === 'edit-target') {
    const row = document.getElementById(`edit-${id}`);
    if (!row) return;
    row.classList.remove('hidden');
    const input = document.getElementById(`edit-input-${id}`);
    if (input) { input.focus(); input.select(); }
    return;
  }
  if (action === 'cancel-target') {
    document.getElementById(`edit-${id}`)?.classList.add('hidden');
    return;
  }
  if (action === 'save-target') {
    const input = document.getElementById(`edit-input-${id}`);
    if (input && updateGoalTarget(id, input.value)) {
      render();
      showSavedIndicator(id);
      showToast('Hedef değeri güncellendi');
    } else {
      showToast('Geçerli bir hedef değeri gir.');
    }
  }
});

document.getElementById('guide-close').addEventListener('click', () => document.getElementById('guide-modal').classList.add('hidden'));
document.getElementById('guide-modal').addEventListener('click', (e) => {
  if (e.target.id === 'guide-modal') document.getElementById('guide-modal').classList.add('hidden');
});

document.getElementById('goal-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('goal-name').value.trim();
  const category = document.getElementById('goal-category').value;
  const target = parseFloat(document.getElementById('goal-target').value);
  const unit = document.getElementById('goal-unit').value.trim();
  const description = document.getElementById('goal-guide-desc').value.trim();
  const videoUrl = document.getElementById('goal-guide-video').value.trim();
  if (!name || Number.isNaN(target) || target <= 0) return;
  addGoal({ name, target, unit, category, guide: { description, videoUrl } });
  data.setupComplete = true;
  saveData();
  e.target.reset();
  render();
  showToast('Hedef eklendi!');
});

document.getElementById('goals-manage-list').addEventListener('click', (e) => {
  const id = e.target.closest('.template-item')?.dataset.id;
  if (!id) return;
  const g = findGoal(id);
  if (!g) return;
  if (e.target.dataset.action === 'delete-goal') {
    if (confirm(`"${g.name}" silinsin mi?`)) { deleteGoal(id); render(); }
  }
  if (e.target.dataset.action === 'edit-goal') {
    const name = prompt('Hedef adı:', g.name);
    if (name === null) return;
    const target = parseFloat(prompt('Hedef değer:', g.target));
    if (Number.isNaN(target) || target <= 0) return;
    const unit = prompt('Birim:', g.unit) ?? '';
    const desc = prompt('Rehber açıklaması:', g.guide?.description || '') ?? '';
    const video = prompt('Video linki:', g.guide?.videoUrl || '') ?? '';
    g.name = name.trim(); g.target = target; g.unit = unit.trim();
    g.guide = { description: desc.trim(), videoUrl: video.trim() };
    saveData(); render();
  }
});

// Wizard: kategori seçimi
document.getElementById('category-selection-grid').addEventListener('click', (e) => {
  const card = e.target.closest('.category-card');
  if (card) toggleWizardCategory(card.dataset.cat);
});

// Wizard: hazır hedef seçimi
document.getElementById('goal-selection-list').addEventListener('change', (e) => {
  if (e.target.dataset.action === 'toggle-goal') togglePresetGoal(e.target.dataset.key);
});

// Wizard: özel hedef ekleme
document.getElementById('wizard-goal-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('wizard-goal-name').value.trim();
  const category = document.getElementById('wizard-goal-category').value;
  const unit = document.getElementById('wizard-goal-unit').value.trim();
  if (!name || !category) return;
  wizardSelectedGoals.push({
    uid: generateId(),
    defaultKey: null,
    name,
    unit,
    icon: '',
    category,
    target: 0,
    guide: { description: '', videoUrl: '' },
    custom: true,
  });
  e.target.reset();
  updateWizard();
});

document.getElementById('wizard-draft-list').addEventListener('click', (e) => {
  if (e.target.dataset.action === 'rm-custom') {
    wizardSelectedGoals = wizardSelectedGoals.filter((g) => g.uid !== e.target.dataset.uid);
    updateWizard();
  }
});

// Wizard: hedef değeri girişi
document.getElementById('target-input-list').addEventListener('input', (e) => {
  if (e.target.dataset.action !== 'set-target') return;
  const g = wizardSelectedGoals.find((x) => x.uid === e.target.dataset.uid);
  if (!g) return;
  const val = parseFloat(e.target.value);
  g.target = Number.isNaN(val) ? 0 : val;
  document.getElementById('wizard-empty-targets').classList.toggle('hidden', wizardStepValid(2));
  document.getElementById('wizard-next').disabled = !wizardStepValid(2);
});

document.getElementById('wizard-back').addEventListener('click', () => {
  if (wizardStep > 0) { wizardStep--; updateWizard(); }
});

document.getElementById('wizard-next').addEventListener('click', () => {
  if (!wizardStepValid(wizardStep)) return;
  if (wizardStep < 2) { wizardStep++; updateWizard(); }
  else finishWizard();
});

/* ---------------- Başlat ---------------- */

populateCategorySelects();
loadData();
render();
if (!data.setupComplete && !hasGoals()) showWizard();
