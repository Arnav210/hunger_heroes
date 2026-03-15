---
layout: base
title: Manage Donations
permalink: /donate/manage
search_exclude: true
menu: nav/home.html
---

<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">

    <!-- Back -->
    <a href="{{site.baseurl}}/donate/" class="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-6 transition-colors group">
      <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Donate
    </a>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Manage Donations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Accept, deliver, or cancel donations</p>
      </div>
      <a href="{{site.baseurl}}/donate/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm shadow-medium hover:shadow-large transition-all whitespace-nowrap">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Donation
      </a>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <button class="filter-btn active px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="all" onclick="filterManage('all')">All</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="active" onclick="filterManage('active')">📋 Active</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="accepted" onclick="filterManage('accepted')">🤝 Accepted</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="in-transit" onclick="filterManage('in-transit')">🚚 In Transit</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="delivered" onclick="filterManage('delivered')">📦 Delivered</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="cancelled" onclick="filterManage('cancelled')">❌ Cancelled</button>
    </div>

    <!-- Donations List -->
    <div id="manage-list">
      <div class="text-center py-16 text-slate-400">
        <svg class="w-8 h-8 animate-spin mx-auto mb-3 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Loading donations…
      </div>
    </div>

  </div>
</div>

<!-- Toast -->
<div id="toast" class="fixed bottom-6 right-6 z-50 hidden">
  <div id="toast-inner" class="px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-large flex items-center gap-2"></div>
</div>

<script type="module">
  import { javaURI, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  let allDonations = [];
  let currentFilter = 'all';
  let dataSource = '';  // track which backend served data

  /* ── Fetch with timeout ── */
  async function springFetch(url, opts = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { ...fetchOptions, ...opts, signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.status === 401 || res.status === 403) {
        throw new Error('AUTH');
      }
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(body || `HTTP ${res.status}`);
      }
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error('Server took too long to respond. Please try again.');
      throw err;
    }
  }

  /* ── Flask fetch fallback ── */
  async function flaskFetch(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /* ── Normalize status (Flask → Spring naming) ── */
  function normalizeStatus(raw) {
    const s = (raw || '').toLowerCase().replace(/ /g, '_');
    const map = { posted: 'active', claimed: 'accepted', in_transit: 'in-transit', confirmed: 'delivered' };
    return map[s] || s;
  }

  /* ── Status badge ── */
  function statusBadge(raw) {
    const s = normalizeStatus(raw);
    const map = {
      active: ['📋 Active', 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'],
      accepted: ['🤝 Accepted', 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'],
      'in-transit': ['🚚 In Transit', 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'],
      delivered: ['📦 Delivered', 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'],
      cancelled: ['❌ Cancelled', 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'],
      expired: ['⏰ Expired', 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'],
    };
    const [label, cls] = map[s] || ['❓ ' + raw, 'bg-gray-100 text-gray-600'];
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${cls}">${label}</span>`;
  }

  /* ── Action buttons per status ── */
  function actionButtons(d) {
    const s = normalizeStatus(d.status);
    const id = d.id;
    const btns = [];
    if (s === 'active') {
      btns.push(`<button data-action="accept" data-id="${id}" class="action-btn px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold transition-colors">🤝 Accept</button>`);
      btns.push(`<button data-action="cancel" data-id="${id}" class="action-btn px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">❌ Cancel</button>`);
    } else if (s === 'accepted' || s === 'in-transit') {
      btns.push(`<button data-action="deliver" data-id="${id}" class="action-btn px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors">📦 Deliver</button>`);
      if (s === 'accepted') {
        btns.push(`<button data-action="cancel" data-id="${id}" class="action-btn px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">❌ Cancel</button>`);
      }
    }
    // Undo button for any non-active status (accepted, delivered, cancelled)
    if (s === 'accepted' || s === 'delivered' || s === 'cancelled') {
      btns.push(`<button data-action="undo" data-id="${id}" class="action-btn px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors">↩️ Undo</button>`);
    }
    return btns.length ? btns.join(' ') : '<span class="text-xs text-slate-400">No actions</span>';
  }

  /* ── Toast ── */
  function showToast(msg, type = 'success') {
    const el = document.getElementById('toast');
    const inner = document.getElementById('toast-inner');
    inner.className = `px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-large flex items-center gap-2 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
    inner.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4000);
  }

  /* ── Render donations ── */
  function render() {
    const container = document.getElementById('manage-list');
    const filtered = currentFilter === 'all'
      ? allDonations
      : allDonations.filter(d => normalizeStatus(d.status) === currentFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16">
          <div class="text-5xl mb-3">📭</div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">No Donations Found</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm">${currentFilter === 'all' ? 'No donations yet.' : 'No donations with this status.'}</p>
        </div>`;
      return;
    }

    const sourceBadge = dataSource
      ? `<div class="mb-4 flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${dataSource === 'spring' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'}">
            ${dataSource === 'spring' ? '☕ Java Spring Backend' : '🐍 Flask Backend'}
          </span>
          <span class="text-xs text-slate-400">${filtered.length} donation${filtered.length !== 1 ? 's' : ''}</span>
        </div>`
      : '';

    container.innerHTML = sourceBadge + `<div class="space-y-4">${filtered.map(d => `
      <div class="donation-card glass rounded-2xl shadow-soft border border-slate-200/50 dark:border-slate-700/50 p-5 hover:shadow-large transition-all" data-donation-id="${d.id}">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-bold text-slate-900 dark:text-white text-lg truncate">${d.food_name || d.foodName || 'Food Donation'}</h3>
              ${statusBadge(d.status)}
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <span>👤 ${d.donor_name || d.donorName || 'Anonymous'}</span>
              <span>📂 ${d.category || '—'}</span>
              <span>📅 Exp: ${d.expiry_date || d.expiration_date || d.expirationDate || '—'}</span>
              <span>📍 ${d.zip_code || d.zipCode || '—'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${actionButtons(d)}
          </div>
        </div>
      </div>
    `).join('')}</div>`;
  }

  /* ── Filter ── */
  window.filterManage = function(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === status);
    });
    render();
  };

  /* ── Delegated action clicks — route to Spring (primary) or Flask (fallback) ── */
  document.getElementById('manage-list').addEventListener('click', async (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    btn.disabled = true;
    const origText = btn.textContent;
    btn.textContent = '…';

    try {
      // Always try Spring first (these routes are required)
      await springFetch(`${javaURI}/api/donations/${id}/${action}`, { method: 'POST' });
      showToast(`Donation ${action}ed successfully! (Spring)`);
      await loadDonations();
    } catch (springErr) {
      // Fall back to Flask status update if available
      const flaskActionMap = { accept: 'claimed', deliver: 'delivered', cancel: 'confirmed' };
      if (flaskActionMap[action] && action !== 'undo') {
        try {
          await flaskFetch(`${pythonURI}/api/donations/${id}`, {
            ...fetchOptions,
            method: 'PUT',
            body: JSON.stringify({ status: flaskActionMap[action] })
          });
          showToast(`Donation ${action}ed via Flask fallback`);
          await loadDonations();
          return;
        } catch (flaskErr) {
          // both failed
        }
      }
      btn.disabled = false;
      btn.textContent = origText;
      showToast(springErr.message === 'AUTH' ? 'Login required for this action' : springErr.message, 'error');
    }
  });

  /* ── Load all donations — try Spring first, fall back to Flask ── */
  async function loadDonations() {
    const container = document.getElementById('manage-list');

    // 1. Try Spring backend first
    try {
      const data = await springFetch(`${javaURI}/api/donations`);
      allDonations = Array.isArray(data) ? data : [];
      dataSource = 'spring';
      render();
      return;
    } catch (springErr) {
      console.log('Spring unavailable, trying Flask fallback…', springErr.message);
    }

    // 2. Fall back to Flask backend
    try {
      const data = await flaskFetch(`${pythonURI}/api/donations`);
      allDonations = Array.isArray(data) ? data : (Array.isArray(data?.donations) ? data.donations : []);
      dataSource = 'flask';
      render();
      return;
    } catch (flaskErr) {
      console.log('Flask also unavailable', flaskErr.message);
    }

    // 3. Both failed — show error
    container.innerHTML = `
      <div class="text-center py-16">
        <div class="text-5xl mb-3">⚠️</div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Could Not Reach Server</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-2">Neither Spring (Java) nor Flask (Python) backend could be reached.</p>
        <p class="text-slate-400 text-xs mb-4">Make sure at least one backend server is running.</p>
        <button onclick="location.reload()" class="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-colors">
          Try Again
        </button>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded', loadDonations);
</script>
