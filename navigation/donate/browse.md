---
layout: base
title: Browse Donations
permalink: /donate/browse
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
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Browse Donations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Sort and filter all food donations</p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1">
        <label for="sort-select" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sort By</label>
        <select id="sort-select"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm">
          <option value="created">Newest First</option>
          <option value="expiry">Expiring Soonest</option>
          <option value="quantity">Most Quantity</option>
        </select>
      </div>
      <div class="flex-1">
        <label for="status-filter" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Filter by Status</label>
        <select id="status-filter"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm">
          <option value="">All Statuses</option>
          <option value="active">📋 Active</option>
          <option value="accepted">🤝 Accepted</option>
          <option value="in-transit">🚚 In Transit</option>
          <option value="delivered">📦 Delivered</option>
          <option value="cancelled">❌ Cancelled</option>
          <option value="expired">⏰ Expired</option>
        </select>
      </div>
    </div>

    <!-- Results count -->
    <p id="results-count" class="text-sm text-slate-400 mb-4"></p>

    <!-- Donation grid -->
    <div id="browse-list">
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

<script type="module">
  import { javaURI, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  const CATEGORY_EMOJIS = {
    produce: '🥦', dairy: '🧀', meat: '🥩', seafood: '🐟', prepared: '🍱',
    canned: '🥫', 'dry-goods': '🌾', bakery: '🍞', snacks: '🍿',
    beverages: '🥤', frozen: '🧊', 'baby-food': '🍼',
    'fresh-produce': '🥬', 'meat-protein': '🥩', 'prepared-meals': '🍱',
    grains: '🌾', other: '📦',
  };

  async function springFetch(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error('Server took too long to respond.');
      throw err;
    }
  }

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

  function statusBadge(raw) {
    const s = (raw || '').toLowerCase().replace(/ /g, '-');
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

  async function loadDonations() {
    const sortBy = document.getElementById('sort-select').value;
    const status = document.getElementById('status-filter').value;
    const container = document.getElementById('browse-list');
    const countEl = document.getElementById('results-count');

    let items = [];
    let source = '';

    // 1. Try Spring sorted endpoint first (required route)
    try {
      let url = `${javaURI}/api/donations/sorted?sortBy=${sortBy}`;
      if (status) url += `&status=${status}`;
      const data = await springFetch(url);
      items = Array.isArray(data) ? data : [];
      source = 'spring';
    } catch (springErr) {
      console.log('Spring sorted unavailable, trying Flask…', springErr.message);

      // 2. Fall back to Flask donations list
      try {
        const data = await flaskFetch(`${pythonURI}/api/donations`);
        let raw = Array.isArray(data) ? data : (Array.isArray(data?.donations) ? data.donations : []);

        // Client-side status filter for Flask data
        if (status) {
          const statusMap = { active: 'posted', accepted: 'claimed', 'in-transit': 'in_transit' };
          const flaskStatus = statusMap[status] || status;
          raw = raw.filter(d => (d.status || '').toLowerCase() === flaskStatus);
        }

        // Client-side sorting for Flask data
        if (sortBy === 'expiry') raw.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
        else if (sortBy === 'quantity') raw.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
        else raw.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        items = raw;
        source = 'flask';
      } catch (flaskErr) {
        countEl.textContent = '';
        container.innerHTML = `
          <div class="text-center py-16">
            <div class="text-5xl mb-3">⚠️</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Could Not Reach Server</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">Neither Spring nor Flask backend could be reached.</p>
            <button onclick="location.reload()" class="mt-4 px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-colors">Try Again</button>
          </div>`;
        return;
      }
    }

    const sourceBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${source === 'spring' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'}">${source === 'spring' ? '☕ Java Spring' : '🐍 Flask'}</span>`;
    countEl.innerHTML = `${sourceBadge} <span class="ml-2">${items.length} donation${items.length !== 1 ? 's' : ''} found</span>`;

      if (items.length === 0) {
        container.innerHTML = `
          <div class="text-center py-16">
            <div class="text-5xl mb-3">📭</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">No Donations Found</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Try changing the filters.</p>
          </div>`;
        return;
      }

      container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${items.map(d => {
        const dte = d.days_until_expiry ?? null;
        const expiryColor = dte === null ? 'text-slate-500' : dte > 5 ? 'text-green-600 dark:text-green-400' : dte >= 2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
        const catEmoji = CATEGORY_EMOJIS[d.category] || '📦';
        return `
        <div class="donation-card glass rounded-2xl shadow-soft border border-slate-200/50 dark:border-slate-700/50 p-5 hover:shadow-large transition-all">
          <div class="flex items-start justify-between mb-3">
            <h3 class="font-bold text-slate-900 dark:text-white text-base truncate flex-1">${d.food_name || 'Food Donation'}</h3>
            ${statusBadge(d.status)}
          </div>
          <div class="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-2">
              <span>${catEmoji} ${d.category || '—'}</span>
              <span class="text-slate-300 dark:text-slate-600">·</span>
              <span>📦 ${d.quantity || '—'} ${d.unit || ''}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="${expiryColor} font-medium">📅 ${d.expiry_date || d.expiration_date || '—'}${dte !== null ? ` (${dte}d)` : ''}</span>
            </div>
            <div class="flex items-center gap-2">
              <span>👤 ${d.donor_name || 'Anonymous'}</span>
              <span class="text-slate-300 dark:text-slate-600">·</span>
              <span>📍 ${d.donor_zip || d.zip_code || '—'}</span>
            </div>
            ${d.allergens && d.allergens.length ? `<div class="flex flex-wrap gap-1 pt-1">${d.allergens.map(a => `<span class="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs font-medium">${a}</span>`).join('')}</div>` : ''}
            ${d.dietary_tags && d.dietary_tags.length ? `<div class="flex flex-wrap gap-1 pt-1">${d.dietary_tags.map(t => `<span class="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-xs font-medium">${t}</span>`).join('')}</div>` : ''}
          </div>
        </div>`;
      }).join('')}</div>`;
  }

  document.addEventListener('DOMContentLoaded', loadDonations);
  document.getElementById('sort-select').addEventListener('change', loadDonations);
  document.getElementById('status-filter').addEventListener('change', loadDonations);
</script>
