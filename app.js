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
  dil: { name: 'Dil', unit: 'dakika', icon: '🌍', suggest: 15, category: 'gelisim', guide: { description: 'Yabancı dil pratiği yap: kelime, dinleme veya konuşma.', videoUrl: '' } },
  ders: { name: 'Ders', unit: 'dakika', icon: '📚', suggest: 30, category: 'gelisim', guide: { description: 'Odaklanmış ders veya çalışma süresi ayır.', videoUrl: '' } },
  // Yaşam / Hedefler
  para: { name: 'Para Biriktirme', unit: '₺', icon: '💰', suggest: 50, category: 'yasam', guide: { description: 'Her gün küçük bir miktar biriktirerek hedefe yaklaş.', videoUrl: '' } },
  gorevler: { name: 'Görevler', unit: 'görev', icon: '✅', suggest: 3, category: 'yasam', guide: { description: 'Günün önemli görevlerini tamamla.', videoUrl: '' } },
  duzen: { name: 'Düzen', unit: 'dakika', icon: '🧹', suggest: 15, category: 'yasam', guide: { description: 'Yaşam alanını düzenlemeye her gün biraz zaman ayır.', videoUrl: '' } },
};

// Neden alanı placeholder önerileri (yalnızca ipucu; kaydedilmez).
const WHY_PLACEHOLDERS = {
  adim: 'Daha fit ve hareketli olmak istiyorum',
  mekik: 'Karın kaslarımı güçlendirmek istiyorum',
  kosu: 'Dayanıklılığımı artırmak istiyorum',
  su: 'Daha enerjik hissetmek istiyorum',
  uyku: 'Gün boyunca daha dinç kalmak istiyorum',
  vitamin: 'Sağlığımı desteklemek istiyorum',
  nefes: 'Stresimi azaltmak istiyorum',
  meditasyon: 'Zihnimi daha sakin tutmak istiyorum',
  sukur: 'Hayata daha olumlu bakmak istiyorum',
  kitap: 'Daha bilgili olmak istiyorum',
  dil: 'Yurt dışına çıkabilmek istiyorum',
  ders: 'Kariyerimde ilerlemek istiyorum',
  para: "2027'de ev peşinatı oluşturmak istiyorum",
  gorevler: 'İşleri zamanında bitirmek istiyorum',
  duzen: 'Daha sakin bir yaşam alanı istiyorum',
};

const CATEGORY_WHY_PLACEHOLDERS = {
  spor: 'Daha fit ve hareketli olmak istiyorum',
  saglik: 'Daha enerjik hissetmek istiyorum',
  zihin: 'Zihnimi daha sakin tutmak istiyorum',
  gelisim: 'Daha bilgili olmak istiyorum',
  yasam: 'Hayatımda bir hedefe ulaşmak istiyorum',
};

function getWhyPlaceholder({ defaultKey, category } = {}) {
  if (defaultKey && WHY_PLACEHOLDERS[defaultKey]) return WHY_PLACEHOLDERS[defaultKey];
  if (category && CATEGORY_WHY_PLACEHOLDERS[category]) return CATEGORY_WHY_PLACEHOLDERS[category];
  return 'Bu hedef senin için neden önemli?';
}

function setWhyPlaceholder(inputEl, ctx) {
  if (inputEl) inputEl.placeholder = getWhyPlaceholder(ctx);
}

const WHY_PREVIEW_MAX = 45;

function truncateWhy(text, max = WHY_PREVIEW_MAX) {
  const t = (text || '').trim();
  if (!t) return '';
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}...`;
}

let data = { version: 8, goals: [], days: {}, setupComplete: false };
let selectedDate = today();
let currentView = 'dashboard'; // 'dashboard' | 'library' | 'stats'
let deleteGoalId = null;
let editGoalId = null;

// Onboarding state: 0 = kategori, 1 = hedef, 2 = değer
let wizardStep = 0;
let wizardSelectedCategories = [];
let wizardSelectedGoals = [];
let wizardEditMode = false; // pano kuruluyken (ilk açılış) false, sonradan ekleme yapılırken true

const PERIODS = {
  daily: { label: 'Günlük', badge: '📅 Günlük' },
  weekly: { label: 'Haftalık', badge: '📅 Haftalık' },
  monthly: { label: 'Aylık', badge: '📅 Aylık' },
};
const VALID_PERIODS = ['daily', 'weekly', 'monthly'];

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function normalizePeriod(period) {
  return VALID_PERIODS.includes(period) ? period : 'daily';
}

function parseDateStr(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateFromDate(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// Pazartesi–Pazar haftası (seçili günü içeren).
function getWeekDates(dateStr) {
  const dt = parseDateStr(dateStr);
  const dow = dt.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(dt);
  monday.setDate(dt.getDate() + diffToMon);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDateFromDate(d));
  }
  return dates;
}

function getMonthDates(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  const last = new Date(y, m, 0).getDate();
  const dates = [];
  for (let d = 1; d <= last; d++) {
    dates.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return dates;
}

function getPeriodActual(goalId, dateStr, period) {
  const p = normalizePeriod(period);
  if (p === 'daily') return getActual(dateStr, goalId);
  const dates = p === 'weekly' ? getWeekDates(dateStr) : getMonthDates(dateStr);
  return dates.reduce((sum, d) => sum + (Number(getActual(d, goalId)) || 0), 0);
}

function periodFieldHtml(name, selected = 'daily') {
  const sel = normalizePeriod(selected);
  return `<fieldset class="period-fieldset">
    <legend class="period-legend">Periyot</legend>
    <div class="period-radios">
      ${VALID_PERIODS.map((p) => `
        <label class="period-radio">
          <input type="radio" name="${escapeHtml(name)}" value="${p}"${p === sel ? ' checked' : ''}>
          <span>${PERIODS[p].label}</span>
        </label>`).join('')}
    </div>
  </fieldset>`;
}

function readPeriodRadio(name) {
  return normalizePeriod(document.querySelector(`input[name="${name}"]:checked`)?.value);
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

const PRESET_NAME_TO_KEY = Object.fromEntries(
  Object.entries(DEFAULT_GOALS).map(([key, def]) => [def.name.toLocaleLowerCase('tr-TR'), key])
);

// Özel hedef adları için akıllı ikon eşleşmesi (uzun/özel ifadeler önce).
const GOAL_NAME_ICON_RULES = [
  { keywords: ['yüz yogası', 'yuz yogasi', 'face yoga'], icon: '🙂' },
  { keywords: ['ip atlama', 'zıplama', 'zip atlama', 'ziplama'], icon: '🤸' },
  { keywords: ['yüz', 'yuz'], icon: '🙂' },
  { keywords: ['yoga'], icon: '🧘' },
  { keywords: ['yürüyüş', 'yuruyus', 'yürü', 'yuru'], icon: '🚶' },
  { keywords: ['adım', 'adim'], icon: '🚶' },
  { keywords: ['koşu', 'kosu', 'koşmak', 'kosmak'], icon: '🏃' },
  { keywords: ['meditasyon'], icon: '🧘' },
  { keywords: ['nefes'], icon: '🌬️' },
  { keywords: ['birikim', 'kumbara'], icon: '💰' },
  { keywords: ['para'], icon: '💰' },
  { keywords: ['su'], icon: '💧' },
  { keywords: ['kitap', 'okuma'], icon: '📖' },
  { keywords: ['uyku'], icon: '😴' },
  { keywords: ['vitamin', 'ilaç', 'ilac'], icon: '💊' },
  { keywords: ['temizlik'], icon: '🧹' },
  { keywords: ['düzen', 'duzen'], icon: '🧹' },
  { keywords: ['yapılacak', 'yapilacak'], icon: '✅' },
  { keywords: ['görev', 'gorev'], icon: '✅' },
  { keywords: ['ingilizce', 'almanca', 'fransızca', 'fransizca', 'ispanyolca'], icon: '🌍' },
  { keywords: ['dil'], icon: '🌍' },
  { keywords: ['dans'], icon: '💃' },
  { keywords: ['koleksiyon'], icon: '🪨' },
  { keywords: ['taş', 'tas'], icon: '🪨' },
  { keywords: ['beslenme'], icon: '🥗' },
  { keywords: ['yemek'], icon: '🥗' },
  { keywords: ['tartı', 'tarti'], icon: '⚖️' },
  { keywords: ['kilo'], icon: '⚖️' },
  { keywords: ['cilt'], icon: '✨' },
  { keywords: ['bakım', 'bakim'], icon: '✨' },
  { keywords: ['mekik'], icon: '💪' },
  { keywords: ['şükür', 'sukur'], icon: '🙏' },
];

function matchGoalNameIcon(name) {
  const n = (name || '').trim().toLocaleLowerCase('tr-TR');
  if (!n) return null;
  for (const rule of GOAL_NAME_ICON_RULES) {
    if (rule.keywords.some((kw) => n.includes(kw.toLocaleLowerCase('tr-TR')))) {
      return rule.icon;
    }
  }
  return null;
}

function goalDisplayIcon(goal) {
  if (goal.defaultKey && DEFAULT_GOALS[goal.defaultKey]?.icon) {
    return DEFAULT_GOALS[goal.defaultKey].icon;
  }
  const nameKey = (goal.name || '').trim().toLocaleLowerCase('tr-TR');
  const presetKey = PRESET_NAME_TO_KEY[nameKey];
  if (presetKey && DEFAULT_GOALS[presetKey]?.icon) {
    return DEFAULT_GOALS[presetKey].icon;
  }
  const matched = matchGoalNameIcon(goal.name);
  if (matched) return matched;
  const cat = goal.category || inferCategory(goal);
  return CATEGORIES[cat]?.icon || '🎯';
}

function getDailyGoals(date) {
  return data.goals.map((g) => {
    const period = normalizePeriod(g.period);
    const dailyActual = getActual(date, g.id);
    return {
      id: g.id,
      name: g.name,
      category: g.category,
      target: g.target,
      unit: g.unit || '',
      icon: goalDisplayIcon(g),
      actual: dailyActual,
      periodActual: getPeriodActual(g.id, date, period),
      period,
      defaultKey: g.defaultKey || null,
      guide: g.guide || { description: '', videoUrl: '' },
      why: (g.why || '').trim(),
    };
  });
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
      const name = (parsed.userName || '').trim();
      if (name) data.userName = name;
      if (parsed.lastOpenDate) data.lastOpenDate = parsed.lastOpenDate;
      if (parsed.lastReportShownDate) data.lastReportShownDate = parsed.lastReportShownDate;
      dedupeGoalsOnLoad();
      return;
    }
    migrateToV8(parsed || {});
    dedupeGoalsOnLoad();
  } catch {
    data = { version: 8, goals: [], days: {}, setupComplete: false };
  }
}

// Aynı defaultKey ile yanlışlıkla iki kayıt oluşmuşsa birleştir (ilerleme kaybı olmasın).
function dedupeGoalsOnLoad() {
  const canonicalByKey = new Map();
  const toRemove = [];

  data.goals.forEach((g) => {
    if (!g.defaultKey) return;
    const canonicalId = defaultGoalId(g.defaultKey);
    const keeper = canonicalByKey.get(g.defaultKey);
    if (!keeper) {
      canonicalByKey.set(g.defaultKey, g);
      return;
    }
    const keep = keeper.id === canonicalId ? keeper : (g.id === canonicalId ? g : keeper);
    const drop = keep === keeper ? g : keeper;
    canonicalByKey.set(g.defaultKey, keep);
    if (drop.id !== keep.id) toRemove.push({ from: drop.id, to: keep.id });
  });

  if (!toRemove.length) return;

  toRemove.forEach(({ from, to }) => {
    Object.values(data.days).forEach((day) => {
      const progress = day.progress;
      if (!progress || progress[from] === undefined) return;
      progress[to] = (Number(progress[to]) || 0) + (Number(progress[from]) || 0);
      delete progress[from];
    });
  });

  const keeperIds = new Set([...canonicalByKey.values()].map((g) => g.id));
  data.goals = data.goals.filter((g) => !g.defaultKey || keeperIds.has(g.id));
  saveData();
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
      ...(g.why?.trim() ? { why: g.why.trim() } : {}),
      ...(normalizePeriod(g.period) !== 'daily' ? { period: normalizePeriod(g.period) } : {}),
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
  const name = (parsed.userName || '').trim();
  if (name) data.userName = name;
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
  const payload = { ...data };
  if (!payload.userName) delete payload.userName;
  payload.goals = payload.goals.map((g) => {
    const goal = { ...g };
    const period = normalizePeriod(goal.period);
    if (period === 'daily') delete goal.period;
    else goal.period = period;
    if (!goal.why?.trim()) delete goal.why;
    return goal;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function daysBetween(fromStr, toStr) {
  const from = parseDateStr(fromStr);
  const to = parseDateStr(toStr);
  const utcFrom = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const utcTo = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((utcTo - utcFrom) / 86400000);
}

function markAppOpened(todayStr) {
  data.lastOpenDate = todayStr;
  saveData();
}

function markDailyReportShown(todayStr) {
  data.lastReportShownDate = todayStr;
  data.lastOpenDate = todayStr;
  saveData();
}

/* ---------------- Günlük giriş raporu ---------------- */

function reportProgressRatio(g, actual) {
  const unit = (g.unit || '').trim().toLocaleLowerCase('tr-TR');
  const a = formatNumber(actual);
  const t = formatNumber(g.target);
  if (unit === 'litre') return `${a} / ${t} litre su`;
  if (unit === 'adım' || unit === 'adim') return `${a} / ${t} adım`;
  if (unit === 'sayfa') return `${a} / ${t} sayfa`;
  if (unit === 'dakika') return `${a} / ${t} dakika`;
  if (unit === 'saat') return `${a} / ${t} saat`;
  if (unit === '₺' || unit === 'tl') return `${a} / ${t} TL`;
  if (unit === 'tekrar') return `${a} / ${t} mekik`;
  if (unit === 'görev' || unit === 'gorev') return `${a} / ${t} görev`;
  if (g.unit) return `${a} / ${t} ${g.unit}`;
  return `${a} / ${t}`;
}

function yesterdayProgressLine(g) {
  if (!(g.actual > 0)) return null;
  const period = normalizePeriod(g.period);
  const progressActual = g.periodActual ?? g.actual;
  const ratio = reportProgressRatio(g, progressActual);

  if (period === 'weekly') {
    return `${g.name}: Bu hafta ${ratio}`;
  }
  if (period === 'monthly') {
    return `${g.name}: Bu ay ${ratio}`;
  }
  return `Dün ${g.name} hedefinde ${reportProgressRatio(g, g.actual)}`;
}

function buildYesterdayReportHtml(yesterday) {
  const goals = getDailyGoals(yesterday)
    .filter((g) => g.actual > 0)
    .sort((a, b) => goalPeriodProgress(b).percent - goalPeriodProgress(a).percent);

  const lines = goals.map(yesterdayProgressLine).filter(Boolean).slice(0, 5);
  const list = lines.map((line) =>
    `<li class="daily-report-item"><span class="daily-report-check">✓</span><span>${escapeHtml(line)}</span></li>`
  ).join('');

  return buildYesterdayReportShell(list);
}

function buildYesterdayReportShell(listHtml) {
  return `
    <div class="daily-report-header">
      <p class="daily-report-lead">🌟 Dün Boş Geçmedi</p>
    </div>
    <ul class="daily-report-list">${listHtml}</ul>
    <p class="daily-report-footer">Bugün devam etmeye ne dersin?<br>Küçük bir adım bile yeter.</p>`;
}

function buildDailyReportContent() {
  const todayStr = today();
  const yesterday = shiftDate(todayStr, -1);
  const daysAway = data.lastOpenDate ? daysBetween(data.lastOpenDate, todayStr) : 1;

  if (dayHasActivity(yesterday)) {
    return { type: 'yesterday', html: buildYesterdayReportHtml(yesterday) };
  }
  if (daysAway >= 3) {
    return {
      type: 'absent',
      html: `
        <div class="daily-report-header daily-report-header-absent">
          <p class="daily-report-lead">👋 Seni bir süredir görmüyorduk.</p>
        </div>
        <p class="daily-report-body">Hayat bazen yoğunlaşır.<br>Hedeflerin burada seni bekliyor.</p>`,
    };
  }
  if (daysAway >= 1) {
    return {
      type: 'fresh',
      html: `
        <div class="daily-report-header daily-report-header-fresh">
          <p class="daily-report-lead">🌱 Yeni bir gün başladı.</p>
        </div>
        <p class="daily-report-body">Dün burada değildin ama sorun değil.<br>Bugün yeniden başlayabilirsin.</p>`,
    };
  }
  return null;
}

function openDailyReportModal(html) {
  document.getElementById('daily-report-content').innerHTML = html;
  document.getElementById('daily-report-overlay').classList.remove('hidden');
  document.body.classList.add('wizard-open');
}

function showDailyReport() {
  const content = buildDailyReportContent();
  if (!content) return false;
  openDailyReportModal(content.html);
  return true;
}

function closeDailyReport() {
  document.getElementById('daily-report-overlay').classList.add('hidden');
  document.body.classList.remove('wizard-open');
}

function maybeShowDailyReport() {
  if (!data.setupComplete || !hasGoals()) {
    markAppOpened(today());
    return;
  }

  const todayStr = today();
  if (data.lastReportShownDate === todayStr) {
    markAppOpened(todayStr);
    return;
  }

  const welcomeOpen = !document.getElementById('welcome-overlay').classList.contains('hidden');
  const wizardOpen = !document.getElementById('wizard-overlay').classList.contains('hidden');
  if (welcomeOpen || wizardOpen) {
    markAppOpened(todayStr);
    return;
  }

  if (showDailyReport()) {
    markDailyReportShown(todayStr);
  } else {
    markAppOpened(todayStr);
  }
}

/* ---------------- Kişiselleştirme (userName) ---------------- */

function getUserName() {
  return (data.userName || '').trim();
}

// Türkçe iyelik eki: Tülay → Tülay'ın, Ali → Ali'nin
function possessiveName(name) {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const vowels = 'aeıioöuü';
  let lastVowel = '';
  for (let i = trimmed.length - 1; i >= 0; i--) {
    const c = trimmed[i].toLowerCase();
    if (vowels.includes(c)) { lastVowel = c; break; }
  }
  let suffix = 'ın';
  if (['e', 'i'].includes(lastVowel)) suffix = 'in';
  else if (['o', 'u'].includes(lastVowel)) suffix = 'un';
  else if (['ö', 'ü'].includes(lastVowel)) suffix = 'ün';
  const last = trimmed.slice(-1).toLowerCase();
  const connector = vowels.includes(last) ? 'n' : '';
  return `${trimmed}'${connector}${suffix}`;
}

function boardTitle() {
  const name = getUserName();
  return name ? `${possessiveName(name)} Hayat Panosu` : 'Hayat Panosu';
}

function saveUserName(name) {
  const trimmed = (name || '').trim();
  if (trimmed) data.userName = trimmed;
  else delete data.userName;
  saveData();
  updateBrandTitle();
}

function updateBrandTitle() {
  const title = boardTitle();
  document.getElementById('brand-title').textContent = title;
  document.title = title;
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

// Haftalık/aylık hedef tamamlandığında veya aşıldığında kart mesajı (günlük hedeflerde boş).
function periodSuccessMessage(period, progressActual, target) {
  const p = getProgress(progressActual, target);
  if (period === 'weekly') {
    if (p.exceeded) return '🔥 Haftalık hedefi aştın!';
    if (p.percent >= 100) return '🎉 Bu haftalık hedef tamamlandı!';
  }
  if (period === 'monthly') {
    if (p.exceeded) return '🚀 Aylık hedefi aştın!';
    if (p.percent >= 100) return '🏆 Bu aylık hedef tamamlandı!';
  }
  return '';
}

function calcPoints(actual, target) {
  const { exceeded } = getProgress(actual, target);
  if (!target || target <= 0) return { bonus: 0, total: 0 };
  const base = Math.min((actual || 0) / target, 1) * POINTS.max;
  const bonus = exceeded ? POINTS.exceedBonus : 0;
  return { bonus, total: Math.round((base + bonus) * 10) / 10 };
}

function goalPeriodProgress(g) {
  const actual = g.periodActual ?? g.actual;
  return getProgress(actual, g.target);
}

function dailyProgressPercent(date) {
  const goals = getDailyGoals(date);
  if (!goals.length) return { percent: 0, count: 0 };
  const sum = goals.reduce((s, g) => s + goalPeriodProgress(g).percent, 0);
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

function syncGoalFormWhyPlaceholder() {
  setWhyPlaceholder(document.getElementById('goal-why'), {
    category: document.getElementById('goal-category')?.value,
  });
}

function syncLibCustomWhyPlaceholder() {
  setWhyPlaceholder(document.getElementById('lib-custom-why'), {
    category: document.getElementById('lib-custom-category')?.value,
  });
}

function syncWizardWhyPlaceholder() {
  setWhyPlaceholder(document.getElementById('wizard-goal-why'), {
    category: document.getElementById('wizard-goal-category')?.value,
  });
}

function initWhyPlaceholders() {
  syncGoalFormWhyPlaceholder();
  syncLibCustomWhyPlaceholder();
  document.getElementById('goal-category')?.addEventListener('change', syncGoalFormWhyPlaceholder);
  document.getElementById('lib-custom-category')?.addEventListener('change', syncLibCustomWhyPlaceholder);
  document.getElementById('wizard-goal-category')?.addEventListener('change', syncWizardWhyPlaceholder);
}

/* ---------------- Dashboard render ---------------- */

function renderGoalCard(g) {
  const progressActual = g.periodActual ?? g.actual;
  const p = getProgress(progressActual, g.target);
  const pts = calcPoints(progressActual, g.target);
  const periodBadge = PERIODS[g.period]?.badge || PERIODS.daily.badge;
  const cat = CATEGORIES[g.category] || CATEGORIES.gelisim;
  const catStreak = getCategoryStreak(g.category);
  const unit = g.unit ? ` ${escapeHtml(g.unit)}` : '';
  const hasGuide = g.guide?.description || g.guide?.videoUrl;
  const whyPreview = truncateWhy(g.why);
  const whyLine = whyPreview
    ? `<span class="goal-card-why-preview" data-action="show-why" data-id="${g.id}" title="${escapeHtml(g.why)}">💭 ${escapeHtml(whyPreview)}</span>`
    : '';
  const whyMotivation = g.why?.trim() ? whyMotivationMessage(g.why) : '';
  const whyMotivationLine = whyMotivation
    ? `<span class="goal-card-why-motivation">${escapeHtml(whyMotivation)}</span>`
    : '';
  const periodSuccess = periodSuccessMessage(g.period, progressActual, g.target);
  const motivationLine = periodSuccess
    ? `<span class="goal-card-period-success">${escapeHtml(periodSuccess)}</span>`
    : `<span class="goal-card-motivation">${goalMotivationMessage(g, p.percent, selectedDate)}</span>`;

  return `
    <article class="goal-card cat-${g.category}" id="goal-card-${g.id}" style="--cat-from:${cat.from};--cat-to:${cat.to}">
      <div class="goal-card-top">
        <div class="goal-card-head">
          <span class="goal-card-name">${g.icon ? g.icon + ' ' : ''}${escapeHtml(g.name)}</span>
          <span class="goal-period-badge">${periodBadge}</span>
          ${whyLine}
        </div>
        <span class="goal-card-top-right">
          <button type="button" class="btn-why" data-action="show-why" data-id="${g.id}" title="Hedefin arkasındaki neden" aria-label="Hedefin arkasındaki neden">💭 Neden?</button>
          ${hasGuide ? `<button type="button" class="btn-guide" data-action="show-guide" data-id="${g.id}" title="Nasıl yapılır?" aria-label="Nasıl yapılır?">?</button>` : ''}
          <span class="goal-card-points${p.exceeded ? ' exceeded' : ''}">+${pts.total}${p.exceeded ? ' ⭐' : ''}</span>
          <div class="goal-card-menu-wrap">
            <button type="button" class="btn-goal-menu" data-action="toggle-goal-menu" data-id="${g.id}" aria-label="Hedef seçenekleri" aria-haspopup="true" aria-expanded="false">⋯</button>
            <div class="goal-card-menu hidden" id="goal-menu-${g.id}" role="menu">
              <button type="button" class="goal-card-menu-item" data-action="edit-goal-card" data-id="${g.id}" role="menuitem">✏️ Hedefi Düzenle</button>
              <button type="button" class="goal-card-menu-item goal-card-menu-delete" data-action="delete-goal-card" data-id="${g.id}" role="menuitem">🗑️ Hedefi Sil</button>
            </div>
          </div>
        </span>
      </div>
      <div class="goal-card-bar">
        <div class="goal-card-bar-fill" style="width:${p.barWidth}%"></div>
      </div>
      <div class="goal-card-meta">
        <span class="goal-card-target">
          <strong>${formatNumber(progressActual || 0)}</strong> / ${formatNumber(g.target)}${unit}
        </span>
        <span class="goal-card-meta-right">
          <span class="goal-streak-mini">🔥 ${catStreak}</span>
          <span class="goal-card-progress-col">
            <span class="goal-card-percent">%${p.percent}</span>
            ${motivationLine}
            ${whyMotivationLine}
          </span>
        </span>
      </div>
      <div class="goal-card-input">
        <div class="actual-input-wrap">
          <input type="number" id="actual-${g.id}" class="actual-input" data-action="update-goal"
            value="" min="0" step="any" placeholder="0" aria-label="Gerçekleşen ${escapeHtml(g.name)}">
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
          <span class="category-streak" title="Kaç gündür aralıksız ilerleme kaydettiğin">🔥 ${streak} Gün Üst Üste</span>
        </header>
        <div class="category-goals">${grouped[catId].map(renderGoalCard).join('')}</div>
      </section>`;
  }).join('');
}

function renderStreaks() {
  const general = getGeneralStreak();
  document.getElementById('general-streak-text').textContent = `${general} Gün Üst Üste`;

  const el = document.getElementById('category-streaks');
  const cats = getActiveCategories();
  el.innerHTML = cats.map((id) => {
    const c = CATEGORIES[id];
    const s = getCategoryStreak(id);
    return `<div class="cat-streak-chip cat-${id}" style="--cat-from:${c.from};--cat-to:${c.to}" title="Kaç gündür aralıksız ilerleme kaydettiğin">
      ${c.icon} ${c.label.split(' / ')[0]}: <strong>${s}</strong> gün üst üste
    </div>`;
  }).join('');
}

function motivationMessage(percent) {
  if (percent >= 100) return 'Muhteşem! Bugünün hedeflerini tamamladın 🎉';
  if (percent >= 76) return 'Az kaldı, tamamlayabilirsin 💪';
  if (percent >= 51) return 'Bugün oldukça aktifsin 🔥';
  if (percent >= 26) return 'İyi gidiyorsun 🚀';
  if (percent >= 1) return 'Harika başlangıç ✨';
  return 'Hadi başlayalım 🌱';
}

// Hedef bazlı motivasyon (defaultKey → kademe → alternatifler). Öncelikli havuzlar.
const GOAL_MOTIVATION = {
  adim: {
    zero: ['Ayakkabılar sana bakıyor 👟', 'Koltuk güçlü ama sen daha güçlüsün', 'Bir tur atsan gün değişir'],
    start: ['Bacaklar uyandı 👟', 'Koltukla arana mesafe koydun', 'Hareketin ilk kıvılcımı yandı'],
    low: ['Ritmi bulmaya başladın', 'Bugün bedenin sahaya indi', 'Adımlar sessizce birikiyor'],
    mid: ['Koltuk bugün kaybediyor', 'Yolun yarısı karakter ister', 'Bugün hareket tarafındasın'],
    high: ['Az kaldı, ayaklar işi biliyor', 'Bugün sokaklar seni tanıdı', 'Neredeyse hedefi ezdin'],
    complete: ['Koltuk seni yenemedi 👟', 'Ayakların bugün imza attı', 'Bugün bedenin alkışı hak etti'],
  },
  su: {
    zero: ['İlk bardak seni bekliyor 💧', 'Susuzluk alarmı çalmadan başla', 'Bir yudumla sistem açılır'],
    start: ['Hücrelere ilk selam gitti', 'Bedenin suyla barıştı', 'İlk bardak güzel hamle'],
    low: ['İçeride işler ferahlıyor', 'Bedenin teşekkür etmeye başladı', 'Su hedefi kıpırdanıyor'],
    mid: ['Hücreler toplantıya başladı', 'Cildin içeriden destek alıyor', 'Bedenin ferahlığı sevdi'],
    high: ['Hücreler halaya kalkmak üzere 💧', 'Bugün su tarafı güçlü', 'Biraz daha, ferahlık tamamlanıyor'],
    complete: ['Hücrelerin bayram ediyor 💧', 'Bugün bedenine iyi baktın', 'İçerisi resmen ferahladı'],
  },
  kitap: {
    zero: ['Bir sayfa kapıyı aralar 📖', 'Kitap sessizce seni bekliyor', 'Zihin için küçük bir kıvılcım'],
    start: ['Sayfalar ısınmaya başladı', 'Zihnin ilk lokmasını aldı', 'Bir fikir kapıdan içeri girdi'],
    low: ['Zihin vites yükseltiyor', 'Sayfalar sessizce işliyor', 'Bugün kafana yatırım başladı'],
    mid: ['Hikâye seni içine alıyor', 'Zihin masaya oturdu', 'Okuma ritmi yakalandı'],
    high: ['Az kaldı, sayfalar akıyor', 'Bugün zihnin iyi beslendi', 'Kitapla aranız ciddileşti'],
    complete: ['Zihnin bugün beslendi 📚', 'Bugün kafana iyi baktın', 'Bir hedef, bir fikir daha'],
  },
  para: {
    zero: ['Kumbara sessizce bakıyor', 'Küçük bir miktar yeter', 'Bugün geleceğe göz kırp'],
    start: ['Kumbara ilk sesi duydu', 'Geleceğe küçük bir not düştün', 'Para kenara yol aldı'],
    low: ['Birikim kası çalışıyor', 'Küçük para, büyük niyet', 'Gelecek hesabı açıldı'],
    mid: ['Birikim ciddileşiyor', 'Gelecekteki sen izliyor', 'Kumbara keyiflenmeye başladı'],
    high: ['Az kaldı, hedef kokusu geldi', 'Bugün para kaçamadı', 'Gelecekteki sen gülümsüyor'],
    complete: ['Gelecekteki sen teşekkür ediyor 💰', 'Bugün paran yerini buldu', 'Kumbara bugün alkışladı'],
  },
  meditasyon: {
    zero: ['Zihin biraz sessizlik istiyor 🧘', 'İki dakika bile kapı açar', 'Sessizlik seni bekliyor'],
    start: ['Zihin yavaşça sakinleşiyor', 'İçeride ses biraz kısıldı', 'Kendine küçük bir alan açtın'],
    low: ['Dinginlik kapıdan baktı', 'Zihin nefes almaya başladı', 'İçerisi biraz yumuşadı'],
    mid: ['Sakinlik yerleşmeye başladı', 'Zihin sandalyeye oturdu', 'Günün sesi biraz azaldı'],
    high: ['Az kaldı, zihin hafifliyor', 'Sessizlik iyice yaklaştı', 'İçeride hava değişti'],
    complete: ['Zihnine sessizlik verdin 🧘', 'Bugün içini biraz susturdun', 'Kendine güzel bir mola verdin'],
  },
};

// Kategori yedek havuzu (özel hedef veya havuzu olmayan varsayılanlar için).
const CATEGORY_MOTIVATION = {
  spor: {
    zero: ['Harekete hazır mısın? 🌱', 'Küçük bir adım yeter', 'Bugün başlamak için güzel'],
    start: ['İlk adımı attın ✨', 'Güzel bir başlangıç', 'Devam etmek kolaylaşır'],
    low: ['Tempo yakalıyorsun 🚀', 'Ritim güzel gidiyor', 'İyi bir ivme'],
    mid: ['Enerjin yükseliyor 🔥', 'Yarı yoldasın', 'Güzel gidiyorsun'],
    high: ['Bitişe yaklaştın 💪', 'Son düzlük', 'Az kaldı'],
    complete: ['Bu hedef tamamlandı 🎉', 'Bugünkü adım tamam', 'Harika iş'],
  },
  saglik: {
    zero: ['Kendine iyi bak 🌱', 'Küçük bir adım yeter', 'Bugün başlayabilirsin'],
    start: ['Güzel bir başlangıç ✨', 'İyi bir adım attın', 'Devam güzel'],
    low: ['Düzenin oturuyor 🚀', 'İyi bir ritim', 'Güzel hissettirir'],
    mid: ['Alışkanlık güçleniyor 🔥', 'Yarı yoldasın', 'Güzel ilerliyorsun'],
    high: ['Hedefe yakınsın 💪', 'Son düzlük', 'Az kaldı'],
    complete: ['Bu hedef tamamlandı 🎉', 'Bugünkü adım tamam', 'Harika iş'],
  },
  zihin: {
    zero: ['Kendine bir an ayır 🧘', 'Sakin başlangıç güzel', 'Küçük bir mola'],
    start: ['İlk adımı attın ✨', 'Zihnine iyi geldi', 'Güzel bir başlangıç'],
    low: ['Dinginlik artıyor 🚀', 'İyi bir ritim', 'Devam iyi hissettirir'],
    mid: ['Huzur güçleniyor 🔥', 'Yarı yoldasın', 'Güzel ilerliyorsun'],
    high: ['Hedefe yakınsın 💪', 'Son düzlük', 'Az kaldı'],
    complete: ['Bu hedef tamamlandı 🎉', 'Bugünkü adım tamam', 'Harika iş'],
  },
  gelisim: {
    zero: ['Öğrenmeye hazır mısın? 📚', 'Küçük bir adım yeter', 'Bugün gelişim için güzel'],
    start: ['İlk adımı attın ✨', 'Güzel bir başlangıç', 'Her dakika değerli'],
    low: ['Ritim oturuyor 🚀', 'İyi bir ivme', 'Devam güzel'],
    mid: ['Gelişim hızlanıyor 🔥', 'Yarı yoldasın', 'Güzel ilerliyorsun'],
    high: ['Hedefe yakınsın 💪', 'Son düzlük', 'Az kaldı'],
    complete: ['Bu hedef tamamlandı 🎉', 'Bugünkü adım tamam', 'Harika iş'],
  },
  yasam: {
    zero: ['Küçük bir adım at 💰', 'Bugün başlayabilirsin', 'Her adım değerli'],
    start: ['İlk adımı attın ✨', 'Güzel bir başlangıç', 'Yaklaşıyorsun'],
    low: ['Düzenin oturuyor 🚀', 'İyi bir ritim', 'Devam güzel'],
    mid: ['Hedefine yaklaşıyorsun 🔥', 'Yarı yoldasın', 'Güzel ilerliyorsun'],
    high: ['Hedefe yakınsın 💪', 'Son düzlük', 'Az kaldı'],
    complete: ['Bu hedef tamamlandı 🎉', 'Bugünkü adım tamam', 'Harika iş'],
  },
};

// Genel yedek (kategori de bulunamazsa).
const GENERAL_MOTIVATION = {
  zero: ['Hadi başlayalım 🌱', 'Küçük bir adım yeter', 'Bugün güzel bir gün'],
  start: ['İlk adımı attın ✨', 'Güzel bir başlangıç', 'Devam et'],
  low: ['İyi gidiyorsun 🚀', 'Ritim oturuyor', 'Güzel bir ivme'],
  mid: ['Devam et 🔥', 'Yarı yoldasın', 'Güzel ilerliyorsun'],
  high: ['Az kaldı 💪', 'Son düzlük', 'Bitişe yakınsın'],
  complete: ['Bu hedef tamamlandı 🎉', 'Bugünkü adım tamam', 'Harika iş'],
};

function motivationTier(percent) {
  if (percent >= 100) return 'complete';
  if (percent >= 76) return 'high';
  if (percent >= 51) return 'mid';
  if (percent >= 26) return 'low';
  if (percent >= 1) return 'start';
  return 'zero';
}

// Aynı hedef + gün + kademe → her render'da aynı alternatif (rastgele değil).
function stablePick(seed, options) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return options[Math.abs(h) % options.length];
}

// Öncelik: hedef havuzu → kategori yedeği → genel yedek.
function goalMotivationMessage(goal, percent, date) {
  const tier = motivationTier(percent);
  const seed = `${goal.id}|${date}|${tier}`;
  if (goal.defaultKey && GOAL_MOTIVATION[goal.defaultKey]?.[tier]) {
    return stablePick(seed, GOAL_MOTIVATION[goal.defaultKey][tier]);
  }
  const cat = goal.category || 'gelisim';
  if (CATEGORY_MOTIVATION[cat]?.[tier]) {
    return stablePick(seed, CATEGORY_MOTIVATION[cat][tier]);
  }
  return stablePick(seed, GENERAL_MOTIVATION[tier]);
}

// Neden metninden basit şablon motivasyon (AI değil).
const WHY_MOTIVATION_RULES = [
  { test: /ev|peşinat|pesinat|konut/i, msg: 'Ev hedefin bugün biraz daha yaklaştı.' },
  { test: /bilgili|bilgi|kitap|öğren|ogren|okum/i, msg: 'Bilgili olma hedefin için güzel bir adım.' },
  { test: /enerjik|dinç|dinc/i, msg: 'Enerjik hissetme yolunda güzel bir adım.' },
  { test: /fit|hareketli|adım|adim|kondisyon|spor|koşu|kosu|mekik/i, msg: 'Fit ve hareketli olma hedefin için güzel bir adım.' },
  { test: /sakin|huzur|meditasyon|stres|rahat|zihin|nefes/i, msg: 'Zihnini sakin tutma hedefin için güzel bir adım.' },
  { test: /para|biriktir|tasarruf|finans|kumbara/i, msg: 'Biriktirme hedefin bugün biraz daha yaklaştı.' },
  { test: /kariyer|ders|çalış|calis|gelişim|gelisim/i, msg: 'Gelişim hedefin için güzel bir adım.' },
  { test: /sağlık|saglik|uyku|vitamin|su\b/i, msg: 'Sağlıklı yaşam hedefin için güzel bir adım.' },
  { test: /düzen|duzen|organize|temiz/i, msg: 'Düzenli bir yaşam hedefin için güzel bir adım.' },
  { test: /şükür|sukur|minnet|olumlu/i, msg: 'Olumlu bakış hedefin için güzel bir adım.' },
  { test: /dil|yurt\s*dış|yurt\s*dis|ingilizce/i, msg: 'Dil hedefin için güzel bir adım.' },
];

function capitalizeTurkish(text) {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1);
}

function whyMotivationMessage(why) {
  const w = (why || '').trim();
  if (!w) return '';
  const lower = w.toLocaleLowerCase('tr-TR');

  for (const rule of WHY_MOTIVATION_RULES) {
    if (rule.test.test(lower)) return rule.msg;
  }

  const dahaOlmak = lower.match(/daha\s+(.+?)\s+olmak\s+istiyorum/);
  if (dahaOlmak) {
    return `${capitalizeTurkish(dahaOlmak[1].trim())} olma hedefin için güzel bir adım.`;
  }

  const olmak = lower.match(/(.+?)\s+olmak\s+istiyorum/);
  if (olmak) {
    const topic = olmak[1].replace(/^daha\s+/, '').trim();
    if (topic.length > 2 && topic.length < 45) {
      return `${capitalizeTurkish(topic)} olma hedefin için güzel bir adım.`;
    }
  }

  const hedef = lower.match(/(.+?)\s+(oluşturmak|yapmak|başarmak|basarmak|ulaşmak|ulasmak)\s+istiyorum/);
  if (hedef) {
    const topic = hedef[1].trim();
    if (/ev|peşinat|pesinat/.test(topic)) return 'Ev hedefin bugün biraz daha yaklaştı.';
    if (topic.length > 2 && topic.length < 50) {
      return `${capitalizeTurkish(topic)} hedefin bugün biraz daha yaklaştı.`;
    }
  }

  return 'Bu hedef için güzel bir ilerleme kaydettin.';
}

// Bugünün Kazancı — doğal Türkçe ilerleme satırları.
const DEFAULT_KEY_GAINS = {
  adim: (n) => `${formatNumber(n)} adım attın`,
  su: (n) => `${formatNumber(n)} litre su içtin`,
  kitap: (n) => `${formatNumber(n)} sayfa okudun`,
  meditasyon: (n) => `${formatNumber(n)} dakika meditasyon yaptın`,
  para: (n) => `${formatNumber(n)} TL biriktirdin`,
  kosu: (n) => `${formatNumber(n)} dakika koştun`,
  mekik: (n) => `${formatNumber(n)} mekik yaptın`,
  uyku: (n) => `${formatNumber(n)} saat uyudun`,
  vitamin: (n) => `${formatNumber(n)} vitamin aldın`,
  nefes: (n) => `${formatNumber(n)} dakika nefes egzersizi yaptın`,
  sukur: (n) => `${formatNumber(n)} madde şükür yazdın`,
  dil: (n) => `${formatNumber(n)} dakika dil çalıştın`,
  ders: (n) => `${formatNumber(n)} dakika ders çalıştın`,
  gorevler: (n) => `${formatNumber(n)} görev tamamladın`,
  duzen: (n) => `${formatNumber(n)} dakika düzen yaptın`,
};

const UNIT_GAIN_PHRASES = {
  adım: (n) => `${formatNumber(n)} adım attın`,
  adim: (n) => `${formatNumber(n)} adım attın`,
  litre: (n) => `${formatNumber(n)} litre su içtin`,
  sayfa: (n) => `${formatNumber(n)} sayfa okudun`,
  dakika: (n, goal) => {
    const name = (goal.name || '').toLocaleLowerCase('tr-TR');
    if (/meditasyon/.test(name)) return `${formatNumber(n)} dakika meditasyon yaptın`;
    if (/nefes/.test(name)) return `${formatNumber(n)} dakika nefes egzersizi yaptın`;
    if (/dil/.test(name)) return `${formatNumber(n)} dakika dil çalıştın`;
    if (/ders|çalış|calis/.test(name)) return `${formatNumber(n)} dakika ders çalıştın`;
    if (/düzen|duzen/.test(name)) return `${formatNumber(n)} dakika düzen yaptın`;
    if (/koşu|kosu/.test(name)) return `${formatNumber(n)} dakika koştun`;
    return `${formatNumber(n)} dakika yaptın`;
  },
  '₺': (n) => `${formatNumber(n)} TL biriktirdin`,
  tl: (n) => `${formatNumber(n)} TL biriktirdin`,
  adet: (n, goal) => {
    const name = (goal.name || '').toLocaleLowerCase('tr-TR');
    if (/vitamin/.test(name)) return `${formatNumber(n)} vitamin aldın`;
    return `${formatNumber(n)} adet tamamladın`;
  },
  tekrar: (n) => `${formatNumber(n)} mekik yaptın`,
  saat: (n, goal) => {
    const name = (goal.name || '').toLocaleLowerCase('tr-TR');
    if (/uyku/.test(name)) return `${formatNumber(n)} saat uyudun`;
    return `${formatNumber(n)} saat tamamladın`;
  },
  madde: (n) => `${formatNumber(n)} madde şükür yazdın`,
  görev: (n) => `${formatNumber(n)} görev tamamladın`,
  gorev: (n) => `${formatNumber(n)} görev tamamladın`,
  km: (n) => `${formatNumber(n)} km koştun`,
  gram: (n) => `${formatNumber(n)} gram tamamladın`,
  saniye: (n) => `${formatNumber(n)} saniye yaptın`,
  defa: (n) => `${formatNumber(n)} defa yaptın`,
  gün: (n) => `${formatNumber(n)} gün tamamladın`,
  gun: (n) => `${formatNumber(n)} gün tamamladın`,
};

function todaysGainLine(goal) {
  const n = goal.actual;
  if (goal.defaultKey && DEFAULT_KEY_GAINS[goal.defaultKey]) {
    return DEFAULT_KEY_GAINS[goal.defaultKey](n);
  }
  const unitKey = (goal.unit || '').trim().toLocaleLowerCase('tr-TR');
  if (unitKey && UNIT_GAIN_PHRASES[unitKey]) {
    return UNIT_GAIN_PHRASES[unitKey](n, goal);
  }
  if (unitKey) return `${formatNumber(n)} ${goal.unit} — ${goal.name}`;
  return `${formatNumber(n)} ${goal.name} kaydettin`;
}

function renderTodaysGains() {
  const goals = getDailyGoals(selectedDate).filter((g) => g.actual > 0);
  const list = document.getElementById('todays-gains-list');
  const empty = document.getElementById('todays-gains-empty');
  const prefix = selectedDate === today() ? 'Bugün' : 'Bu gün';

  if (!goals.length) {
    list.innerHTML = '';
    list.classList.add('hidden');
    empty.textContent = `${prefix} henüz bir ilerleme kaydetmedin.`;
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.classList.remove('hidden');
  list.innerHTML = goals.map((g) =>
    `<li class="gains-item">
      <span class="gains-icon" aria-hidden="true">${g.icon}</span>
      <span class="gains-check" aria-hidden="true">✓</span>
      <span>${escapeHtml(todaysGainLine(g))}</span>
    </li>`
  ).join('');
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
  // Yüzdeye göre motivasyon mesajı — her zaman dolu ve görünür.
  document.getElementById('progress-motivation').textContent = motivationMessage(prog.percent);
  renderTodaysGains();
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
  updateBrandTitle();
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
  document.getElementById('stats-view').classList.toggle('hidden', view !== 'stats');
  if (view === 'library') renderLibrary();
  else if (view === 'stats') renderStats();
  else render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- İstatistikler (V1) ---------------- */

const STATS_MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

function statsGroupKey(goal) {
  if (goal.defaultKey) return `dk:${goal.defaultKey}`;
  const nameKey = (goal.name || '').trim().toLocaleLowerCase('tr-TR');
  const presetKey = PRESET_NAME_TO_KEY[nameKey];
  if (presetKey) return `dk:${presetKey}`;
  return `name:${nameKey}`;
}

function buildStatsGoalGroups() {
  const groups = new Map();

  data.goals.forEach((goal) => {
    const key = statsGroupKey(goal);
    let group = groups.get(key);
    if (!group) {
      group = { displayGoal: goal, goalIds: [] };
      groups.set(key, group);
    }
    group.goalIds.push(goal.id);
    if (goal.defaultKey) group.displayGoal = goal;
  });

  return [...groups.values()];
}

function buildStatsRows(weekDates, monthDates) {
  return buildStatsGoalGroups()
    .map((group) => ({
      goal: group.displayGoal,
      week: group.goalIds.reduce((sum, id) => sum + sumGoalProgress(id, weekDates), 0),
      month: group.goalIds.reduce((sum, id) => sum + sumGoalProgress(id, monthDates), 0),
    }))
    .filter((row) => row.week > 0 || row.month > 0)
    .sort((a, b) => Math.max(b.week, b.month) - Math.max(a.week, a.month));
}

function getLast7DaysDates(referenceDate = today()) {
  const dates = [];
  for (let i = 6; i >= 0; i--) dates.push(shiftDate(referenceDate, -i));
  return dates;
}

function sumGoalProgress(goalId, dates) {
  return dates.reduce((sum, d) => sum + (Number(getActual(d, goalId)) || 0), 0);
}

function aggregateGoalTotals(dates) {
  return buildStatsGoalGroups()
    .map((group) => ({
      goal: group.displayGoal,
      total: group.goalIds.reduce((sum, id) => sum + sumGoalProgress(id, dates), 0),
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
}

function formatStatNumber(n) {
  const num = Number(n) || 0;
  if (Number.isInteger(num)) return num.toLocaleString('tr-TR');
  return num.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
}

function statAmountLabel(goal, total) {
  const unit = (goal.unit || '').toLocaleLowerCase('tr-TR');
  const val = formatStatNumber(total);
  if (unit === 'litre') return `${val} litre su`;
  if (unit === 'adım' || unit === 'adim') return `${val} adım`;
  if (unit === 'sayfa') return `${val} sayfa`;
  if (unit === 'dakika') return `${val} dakika`;
  if (unit === 'saat') return `${val} saat`;
  if (unit === '₺' || unit === 'tl') return `${val} TL`;
  if (unit === 'tekrar') return `${val} mekik`;
  if (unit === 'km') return `${val} km`;
  if (unit === 'adet') return `${val} adet`;
  if (unit === 'görev' || unit === 'gorev') return `${val} görev`;
  if (goal.unit) return `${val} ${goal.unit}`;
  return `${val}`;
}

function statCellLabel(goal, total) {
  const n = Number(total) || 0;
  if (n === 0) return { text: '—', empty: true };
  return { text: statAmountLabel(goal, n), empty: false };
}

function renderStatsTableRow(goal, weekTotal, monthTotal) {
  const icon = goalDisplayIcon(goal);
  const week = statCellLabel(goal, weekTotal);
  const month = statCellLabel(goal, monthTotal);
  const weekClass = week.empty ? ' stats-td-empty' : '';
  const monthClass = month.empty ? ' stats-td-empty' : '';
  return `<tr>
    <td class="stats-td-goal" data-label="Hedef">
      <span class="stats-goal-cell">
        <span class="stats-goal-icon" aria-hidden="true">${icon}</span>
        <span class="stats-goal-name">${escapeHtml(goal.name)}</span>
      </span>
    </td>
    <td class="stats-td-num${weekClass}" data-label="Son 7 Gün">${escapeHtml(week.text)}</td>
    <td class="stats-td-num${monthClass}" data-label="Bu Ay">${escapeHtml(month.text)}</td>
  </tr>`;
}

function renderStatsTable(rows) {
  const body = rows.map((r) => renderStatsTableRow(r.goal, r.week, r.month)).join('');
  return `<section class="stats-block stats-table-block">
    <div class="stats-table-wrap">
      <table class="stats-table">
        <thead>
          <tr>
            <th scope="col">Hedef</th>
            <th scope="col">Son 7 Gün</th>
            <th scope="col">Bu Ay</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  </section>`;
}

function weeklyGainLine(goal, total) {
  return todaysGainLine({
    name: goal.name,
    unit: goal.unit,
    defaultKey: goal.defaultKey || null,
    actual: total,
  });
}

function weeklyTopAchievementLine(goal, total) {
  const unitKey = (goal.unit || '').trim().toLocaleLowerCase('tr-TR');
  const isPara = goal.defaultKey === 'para'
    || unitKey === '₺' || unitKey === 'tl'
    || /para|birikim|kumbara/i.test(goal.name || '');
  if (isPara) {
    return `Bu hafta ${formatStatNumber(total)} TL ayırdın.`;
  }
  return `Bu hafta ${weeklyGainLine(goal, total)}.`;
}

function renderWeeklySummarySection(weekDates) {
  const weekData = aggregateGoalTotals(weekDates);

  if (!weekData.length) {
    return `<section class="stats-block stats-weekly-block">
      <h3 class="stats-block-title">🌟 Haftalık Özet</h3>
      <div class="stats-weekly-summary">
        <p class="stats-weekly-empty">Bu hafta henüz yeterli veri oluşmadı.</p>
      </div>
    </section>`;
  }

  const topGoal = weekData[0];
  const topIcon = goalDisplayIcon(topGoal.goal);
  const gainLines = weekData.slice(0, 5).map((item) => {
    const line = weeklyGainLine(item.goal, item.total);
    return `<li class="stats-weekly-gain">
      <span class="stats-weekly-check" aria-hidden="true">✓</span>
      <span>${escapeHtml(line)}</span>
    </li>`;
  }).join('');

  return `<section class="stats-block stats-weekly-block">
    <h3 class="stats-block-title">🌟 Haftalık Özet</h3>
    <div class="stats-weekly-summary">
      <p class="stats-weekly-lead">Bu Hafta Kendin İçin Neler Yaptın?</p>
      <ul class="stats-weekly-gains">${gainLines}</ul>
      <div class="stats-weekly-top">
        <p class="stats-weekly-top-label">Bu hafta en çok ilerlediğin hedef</p>
        <p class="stats-weekly-top-goal">
          <span class="stats-weekly-top-icon" aria-hidden="true">${topIcon}</span>
          <span>${escapeHtml(topGoal.goal.name)}</span>
        </p>
        <p class="stats-weekly-top-fact">${escapeHtml(weeklyTopAchievementLine(topGoal.goal, topGoal.total))}</p>
      </div>
    </div>
  </section>`;
}

function renderTopGoalsSection(items) {
  if (!items.length) {
    return `<section class="stats-block">
      <h3 class="stats-block-title">En Aktif Hedeflerin</h3>
      <p class="stats-empty-section">Henüz yeterli veri oluşmadı.</p>
    </section>`;
  }
  const lines = items.slice(0, 5).map((item, i) => {
    const icon = goalDisplayIcon(item.goal);
    return `<li class="stats-rank-line">
      <span class="stats-medal">${STATS_MEDALS[i] || '•'}</span>
      <span class="stats-rank-icon" aria-hidden="true">${icon}</span>
      <span class="stats-rank-name">${escapeHtml(item.goal.name)}</span>
    </li>`;
  }).join('');
  return `<section class="stats-block">
    <h3 class="stats-block-title">En Aktif Hedeflerin</h3>
    <ul class="stats-rank-list">${lines}</ul>
  </section>`;
}

function renderStats() {
  const container = document.getElementById('stats-content');
  if (!data.goals.length) {
    container.innerHTML = '<p class="stats-empty">Henüz yeterli veri oluşmadı.</p>';
    return;
  }

  const weekDates = getLast7DaysDates();
  const monthDates = getMonthDates(today());
  const rows = buildStatsRows(weekDates, monthDates);
  const weekData = aggregateGoalTotals(weekDates);
  const monthData = aggregateGoalTotals(monthDates);
  const topSource = weekData.length ? weekData : monthData;

  const parts = [renderWeeklySummarySection(weekDates)];
  if (rows.length) parts.push(renderStatsTable(rows));
  parts.push(renderTopGoalsSection(topSource));

  container.innerHTML = parts.join('');
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

function addGoal({ name, target, unit, category, defaultKey, icon, guide, why, period }) {
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
  const whyText = (why || '').trim();
  if (whyText) goal.why = whyText;
  const goalPeriod = normalizePeriod(period);
  if (goalPeriod !== 'daily') goal.period = goalPeriod;
  // Aynı default hedef iki kez eklenmesin.
  if (defaultKey && data.goals.some((g) => g.defaultKey === defaultKey)) return null;
  data.goals.push(goal);
  saveData();
  return goal;
}

function deleteGoal(id) {
  data.goals = data.goals.filter((g) => g.id !== id);
  saveData();
}

function closeAllGoalMenus() {
  document.querySelectorAll('.goal-card-menu').forEach((el) => el.classList.add('hidden'));
  document.querySelectorAll('.btn-goal-menu').forEach((el) => el.setAttribute('aria-expanded', 'false'));
}

function toggleGoalMenu(goalId) {
  const menu = document.getElementById(`goal-menu-${goalId}`);
  const btn = document.querySelector(`.btn-goal-menu[data-id="${goalId}"]`);
  if (!menu) return;
  const wasHidden = menu.classList.contains('hidden');
  closeAllGoalMenus();
  if (wasHidden) {
    menu.classList.remove('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

function openDeleteGoalModal(goalId) {
  const g = findGoal(goalId);
  if (!g) return;
  deleteGoalId = goalId;
  closeAllGoalMenus();
  document.getElementById('delete-goal-name').textContent = g.name;
  document.getElementById('delete-goal-modal').classList.remove('hidden');
}

function closeDeleteGoalModal() {
  deleteGoalId = null;
  document.getElementById('delete-goal-modal').classList.add('hidden');
}

function confirmDeleteGoal() {
  if (!deleteGoalId) return;
  const name = findGoal(deleteGoalId)?.name || 'Hedef';
  const removedId = deleteGoalId;
  deleteGoal(removedId);
  closeDeleteGoalModal();
  if (whyModalGoalId === removedId) closeWhyModal();
  if (editGoalId === removedId) closeEditGoalModal();
  render();
  if (currentView === 'library') renderLibrary();
  if (currentView === 'stats') renderStats();
  showToast(`${name} silindi`);
}

function openEditGoalModal(goalId) {
  const g = findGoal(goalId);
  if (!g) return;
  editGoalId = goalId;
  closeAllGoalMenus();
  document.getElementById('edit-goal-name').value = g.name;
  document.getElementById('edit-goal-target').value = formatNumber(g.target);
  document.getElementById('edit-goal-unit').value = g.unit || '';
  document.getElementById('edit-goal-why').value = (g.why || '').trim();
  const period = normalizePeriod(g.period);
  document.querySelector(`input[name="edit-goal-period"][value="${period}"]`)?.click();
  setWhyPlaceholder(document.getElementById('edit-goal-why'), {
    defaultKey: g.defaultKey,
    category: g.category,
  });
  document.getElementById('edit-goal-modal').classList.remove('hidden');
  document.getElementById('edit-goal-name').focus();
}

function closeEditGoalModal() {
  editGoalId = null;
  document.getElementById('edit-goal-modal').classList.add('hidden');
}

function updateGoalDetails(goalId, { name, target, unit, period, why }) {
  const goal = findGoal(goalId);
  if (!goal) return false;
  const trimmedName = (name || '').trim();
  const targetVal = parseFloat(target);
  if (!trimmedName || Number.isNaN(targetVal) || targetVal <= 0) return false;

  goal.name = trimmedName;
  goal.target = targetVal;
  goal.unit = (unit || '').trim();
  const p = normalizePeriod(period);
  if (p === 'daily') delete goal.period;
  else goal.period = p;

  const whyText = (why || '').trim();
  if (whyText) goal.why = whyText;
  else delete goal.why;

  saveData();
  return true;
}

function saveEditGoalForm() {
  if (!editGoalId) return;
  const ok = updateGoalDetails(editGoalId, {
    name: document.getElementById('edit-goal-name').value,
    target: document.getElementById('edit-goal-target').value,
    unit: document.getElementById('edit-goal-unit').value,
    period: readPeriodRadio('edit-goal-period'),
    why: document.getElementById('edit-goal-why').value,
  });
  if (!ok) {
    showToast('Geçerli bir hedef adı ve değeri gir.');
    return;
  }
  const name = findGoal(editGoalId)?.name || 'Hedef';
  closeEditGoalModal();
  render();
  if (currentView === 'stats') renderStats();
  showToast(`${name} güncellendi`);
}

function updateGoalWhy(goalId, text) {
  const goal = findGoal(goalId);
  if (!goal) return false;
  const trimmed = (text || '').trim();
  if (trimmed) goal.why = trimmed;
  else delete goal.why;
  saveData();
  return true;
}

function updateGoalProgress(goalId, rawValue) {
  const value = rawValue === '' ? 0 : parseFloat(rawValue);
  if (Number.isNaN(value) || value < 0) return false;
  const goal = findGoal(goalId);
  if (!goal) return false;
  const period = normalizePeriod(goal.period);
  const prevPeriodActual = getPeriodActual(goalId, selectedDate, period);
  const prevPts = calcPoints(prevPeriodActual, goal.target).total;
  const day = getDay(selectedDate);
  if (value === 0) delete day.progress[goalId];
  else day.progress[goalId] = value;
  saveData();
  const newPeriodActual = getPeriodActual(goalId, selectedDate, period);
  const newPts = calcPoints(newPeriodActual, goal.target).total;
  if (newPts > prevPts) {
    const diff = Math.round((newPts - prevPts) * 10) / 10;
    const exceeded = getProgress(newPeriodActual, goal.target).exceeded
      && !getProgress(prevPeriodActual, goal.target).exceeded;
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

let whyModalGoalId = null;

function renderWhyReadView(goalId) {
  const g = findGoal(goalId);
  if (!g) return;
  const why = (g.why || '').trim();
  document.getElementById('why-goal-name').textContent = g.name;
  document.getElementById('why-empty-hint').classList.toggle('hidden', !!why);
  const display = document.getElementById('why-text-display');
  display.textContent = why;
  display.classList.toggle('hidden', !why);
}

function showWhyViewMode() {
  document.getElementById('why-read-view').classList.remove('hidden');
  document.getElementById('why-form').classList.add('hidden');
  document.getElementById('why-edit-btn').classList.remove('hidden');
}

function showWhyEditMode() {
  const g = findGoal(whyModalGoalId);
  const input = document.getElementById('why-input');
  input.value = (g?.why || '').trim();
  setWhyPlaceholder(input, { defaultKey: g?.defaultKey, category: g?.category });
  document.getElementById('why-read-view').classList.add('hidden');
  document.getElementById('why-form').classList.remove('hidden');
  document.getElementById('why-edit-btn').classList.add('hidden');
  input.focus();
}

function openWhyModal(goalId) {
  whyModalGoalId = goalId;
  renderWhyReadView(goalId);
  showWhyViewMode();
  document.getElementById('why-modal').classList.remove('hidden');
}

function closeWhyModal() {
  whyModalGoalId = null;
  document.getElementById('why-modal').classList.add('hidden');
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
  syncWizardWhyPlaceholder();

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
    return `<div class="wizard-target-row template-item" data-uid="${g.uid}">
      <div class="wizard-target-main">
        <div class="template-item-info">
          <span class="template-item-name">${g.icon || cat.icon} ${escapeHtml(g.name)}</span>
        </div>
        <span class="template-item-meta">${escapeHtml(unit)}</span>
        <input type="number" data-action="set-target" data-uid="${g.uid}" min="0.01" step="any" value="${g.target || ''}" placeholder="0">
      </div>
      ${periodFieldHtml(`wizard-period-${g.uid}`, g.period || 'daily')}
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

// İlk açılış karşılama ekranı (sadece kurulum tamamlanmadan önce gösterilir).
function showWelcome() {
  document.getElementById('welcome-overlay').classList.remove('hidden');
  document.body.classList.add('wizard-open');
}

function startFromWelcome() {
  const name = document.getElementById('welcome-name-input').value.trim();
  if (name) saveUserName(name);
  document.getElementById('welcome-overlay').classList.add('hidden');
  showWizard();
}

function openNameEditModal() {
  document.getElementById('name-edit-input').value = getUserName();
  document.getElementById('name-edit-modal').classList.remove('hidden');
  document.getElementById('name-edit-input').focus();
}

function closeNameEditModal() {
  document.getElementById('name-edit-modal').classList.add('hidden');
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
      period: 'daily',
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
      why: g.why,
      period: g.period,
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
  closeDailyReport();
  closeWhyModal();
  closeNameEditModal();
  closeEditGoalModal();
  closeDeleteGoalModal();
  document.querySelectorAll('.dashboard details[open]').forEach((d) => d.removeAttribute('open'));
  switchView('dashboard');
}

document.getElementById('home-btn').addEventListener('click', goHome);

// Hedef Kütüphanesi: dashboard <-> kütüphane görünüm geçişi.
document.getElementById('open-library-btn').addEventListener('click', () => switchView('library'));
document.getElementById('open-stats-btn').addEventListener('click', () => switchView('stats'));
document.getElementById('back-to-dash-btn').addEventListener('click', () => switchView('dashboard'));
document.getElementById('back-from-stats-btn').addEventListener('click', () => switchView('dashboard'));
document.getElementById('library-list').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="add-library"]');
  if (btn) addFromLibrary(btn.dataset.key);
});

// Birim "diğer" seçilince serbest metin alanını göster.
const libUnitSelect = document.getElementById('lib-custom-unit');
const libUnitOther = document.getElementById('lib-custom-unit-other');
libUnitSelect.addEventListener('change', () => {
  libUnitOther.classList.toggle('show', libUnitSelect.value === 'diger');
  if (libUnitSelect.value === 'diger') libUnitOther.focus();
});

function getLibCustomUnit() {
  if (libUnitSelect.value === 'diger') return libUnitOther.value.trim();
  return libUnitSelect.value;
}

// Kütüphaneden özel hedef ekleme (havuz dışı, defaultKey'siz).
document.getElementById('lib-custom-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('lib-custom-name').value.trim();
  const category = document.getElementById('lib-custom-category').value;
  const target = parseFloat(document.getElementById('lib-custom-target').value);
  const unit = getLibCustomUnit();
  const why = document.getElementById('lib-custom-why').value.trim();
  if (!name || Number.isNaN(target) || target <= 0) return;
  addGoal({
    name, target, unit, category,
    guide: { description: '', videoUrl: '' },
    why,
    period: readPeriodRadio('lib-custom-period'),
  });
  data.setupComplete = true;
  saveData();
  e.target.reset();
  libUnitOther.classList.remove('show');
  document.querySelector('input[name="lib-custom-period"][value="daily"]')?.click();
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
  const raw = input.value;
  if (updateGoalProgress(goalId, raw)) {
    render();
    showSavedIndicator(goalId);
    const cleared = document.getElementById(`actual-${goalId}`);
    if (cleared) {
      cleared.value = '';
      cleared.blur();
    }
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
  if (action === 'toggle-goal-menu') { toggleGoalMenu(id); return; }
  if (action === 'edit-goal-card') { openEditGoalModal(id); return; }
  if (action === 'delete-goal-card') { openDeleteGoalModal(id); return; }
  if (action === 'show-guide') { showGuide(id); return; }
  if (action === 'show-why') { openWhyModal(id); return; }
  if (action === 'save-goal') { saveGoalFromInput(id); return; }
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
  const why = document.getElementById('goal-why').value.trim();
  const description = document.getElementById('goal-guide-desc').value.trim();
  const videoUrl = document.getElementById('goal-guide-video').value.trim();
  if (!name || Number.isNaN(target) || target <= 0) return;
  addGoal({
    name, target, unit, category,
    guide: { description, videoUrl },
    why,
    period: readPeriodRadio('goal-period'),
  });
  data.setupComplete = true;
  saveData();
  e.target.reset();
  document.querySelector('input[name="goal-period"][value="daily"]')?.click();
  render();
  showToast('Hedef eklendi!');
});

document.getElementById('goals-manage-list').addEventListener('click', (e) => {
  const id = e.target.closest('.template-item')?.dataset.id;
  if (!id) return;
  const g = findGoal(id);
  if (!g) return;
  if (e.target.dataset.action === 'delete-goal') {
    openDeleteGoalModal(id);
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
  const why = document.getElementById('wizard-goal-why').value.trim();
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
    period: readPeriodRadio('wizard-goal-period'),
    ...(why ? { why } : {}),
    custom: true,
  });
  e.target.reset();
  document.querySelector('input[name="wizard-goal-period"][value="daily"]')?.click();
  updateWizard();
});

document.getElementById('wizard-draft-list').addEventListener('click', (e) => {
  if (e.target.dataset.action === 'rm-custom') {
    wizardSelectedGoals = wizardSelectedGoals.filter((g) => g.uid !== e.target.dataset.uid);
    updateWizard();
  }
});

// Wizard: hedef değeri ve periyot girişi
document.getElementById('target-input-list').addEventListener('input', (e) => {
  if (e.target.dataset.action !== 'set-target') return;
  const g = wizardSelectedGoals.find((x) => x.uid === e.target.dataset.uid);
  if (!g) return;
  const val = parseFloat(e.target.value);
  g.target = Number.isNaN(val) ? 0 : val;
  document.getElementById('wizard-empty-targets').classList.toggle('hidden', wizardStepValid(2));
  document.getElementById('wizard-next').disabled = !wizardStepValid(2);
});

document.getElementById('target-input-list').addEventListener('change', (e) => {
  if (e.target.type !== 'radio' || !e.target.name?.startsWith('wizard-period-')) return;
  const uid = e.target.name.replace('wizard-period-', '');
  const g = wizardSelectedGoals.find((x) => x.uid === uid);
  if (g) g.period = normalizePeriod(e.target.value);
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

document.getElementById('welcome-start-btn').addEventListener('click', startFromWelcome);

document.getElementById('edit-name-btn').addEventListener('click', openNameEditModal);
document.getElementById('name-edit-close').addEventListener('click', closeNameEditModal);
document.getElementById('name-edit-modal').addEventListener('click', (e) => {
  if (e.target.id === 'name-edit-modal') closeNameEditModal();
});
document.getElementById('name-edit-form').addEventListener('submit', (e) => {
  e.preventDefault();
  saveUserName(document.getElementById('name-edit-input').value);
  closeNameEditModal();
  showToast(getUserName() ? `Merhaba ${getUserName()}! 👋` : 'Başlık güncellendi');
});

document.getElementById('why-close').addEventListener('click', closeWhyModal);
document.getElementById('why-modal').addEventListener('click', (e) => {
  if (e.target.id === 'why-modal') closeWhyModal();
});
document.getElementById('why-edit-btn').addEventListener('click', showWhyEditMode);
document.getElementById('why-cancel-edit').addEventListener('click', () => {
  if (whyModalGoalId) {
    renderWhyReadView(whyModalGoalId);
    showWhyViewMode();
  }
});
document.getElementById('why-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!whyModalGoalId) return;
  updateGoalWhy(whyModalGoalId, document.getElementById('why-input').value);
  renderWhyReadView(whyModalGoalId);
  showWhyViewMode();
  showToast('Neden kaydedildi 💭');
});

document.getElementById('daily-report-start').addEventListener('click', closeDailyReport);

document.getElementById('edit-goal-close').addEventListener('click', closeEditGoalModal);
document.getElementById('edit-goal-cancel').addEventListener('click', closeEditGoalModal);
document.getElementById('edit-goal-modal').addEventListener('click', (e) => {
  if (e.target.id === 'edit-goal-modal') closeEditGoalModal();
});
document.getElementById('edit-goal-form').addEventListener('submit', (e) => {
  e.preventDefault();
  saveEditGoalForm();
});

document.getElementById('delete-goal-cancel').addEventListener('click', closeDeleteGoalModal);
document.getElementById('delete-goal-confirm').addEventListener('click', confirmDeleteGoal);
document.getElementById('delete-goal-modal').addEventListener('click', (e) => {
  if (e.target.id === 'delete-goal-modal') closeDeleteGoalModal();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.goal-card-menu-wrap')) closeAllGoalMenus();
});

populateCategorySelects();
initWhyPlaceholders();
loadData();
render();
// İlk kullanım: önce karşılama, ardından mevcut onboarding sihirbazı.
if (!data.setupComplete && !hasGoals()) {
  showWelcome();
} else {
  maybeShowDailyReport();
}
