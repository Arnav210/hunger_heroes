---
layout: base
title: Food Categories
permalink: /donate/categories
search_exclude: true
menu: nav/home.html
---

<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">

    <!-- Back -->
    <a href="{{site.baseurl}}/donate/" class="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-6 transition-colors group">
      <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Donate
    </a>

    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg mb-4">
        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Food Categories</h1>
      <p class="text-slate-500 dark:text-slate-400 text-lg">Explore the full food category hierarchy</p>
    </div>

    <!-- Find Path -->
    <div class="glass rounded-3xl shadow-large border border-slate-200/50 dark:border-slate-700/50 p-6 sm:p-8 mb-8">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-3">🔍 Trace Category Path</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Type a category name to see its full path from leaf to root.</p>
      <form id="path-form" class="flex flex-col sm:flex-row gap-3 mb-4">
        <input id="path-input" type="text" required placeholder="e.g. dairy"
          class="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        <button type="submit" id="path-btn"
          class="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-medium hover:shadow-large transition-all whitespace-nowrap">
          Trace Path
        </button>
      </form>
      <div id="path-result"></div>
    </div>

    <!-- Category Tree -->
    <div class="glass rounded-3xl shadow-large border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">🌳 Category Tree</h2>
      </div>
      <div id="tree-area" class="p-6">
        <div class="text-center py-8 text-slate-400">
          <svg class="w-7 h-7 animate-spin mx-auto mb-2 text-primary-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          Loading categories…
        </div>
      </div>
    </div>

  </div>
</div>

<script type="module">
  import { javaURI, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  const CATEGORY_EMOJIS = {
    'All Food': '🍽️', 'Perishable': '🧊', 'Shelf-Stable': '🏪', 'Specialty': '✨',
    produce: '🥦', dairy: '🧀', meat: '🥩', seafood: '🐟', prepared: '🍱',
    canned: '🥫', 'dry-goods': '🌾', bakery: '🍞', snacks: '🍿',
    beverages: '🥤', frozen: '🧊', 'baby-food': '🍼',
  };

  async function springFetch(url, opts = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { ...fetchOptions, ...opts, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(body || `HTTP ${res.status}`);
      }
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error('Server took too long to respond.');
      throw err;
    }
  }

  /* ── Recursively render tree using <details> ── */
  function renderTree(node) {
    const emoji = CATEGORY_EMOJIS[node.name] || '📁';
    const children = node.children || [];

    if (children.length === 0) {
      return `<li class="py-1.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm text-slate-700 dark:text-slate-300">${emoji} ${node.name}</li>`;
    }

    return `
      <li>
        <details open class="group">
          <summary class="cursor-pointer py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            ${emoji} ${node.name}
            <span class="text-xs font-normal text-slate-400">(${children.length})</span>
          </summary>
          <ul class="ml-6 border-l-2 border-slate-200 dark:border-slate-700 pl-4 mt-1 space-y-0.5">
            ${children.map(c => renderTree(c)).join('')}
          </ul>
        </details>
      </li>`;
  }

  /* ── Load tree — try Spring first, build fallback from Flask ── */
  document.addEventListener('DOMContentLoaded', async () => {
    const area = document.getElementById('tree-area');
    let tree = null;
    let source = '';

    // 1. Try Spring categories/tree (required route)
    try {
      tree = await springFetch(`${javaURI}/api/donations/categories/tree`);
      source = 'spring';
    } catch (springErr) {
      console.log('Spring categories unavailable, building from Flask…', springErr.message);

      // 2. Fallback: build a category tree from Flask donation data
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${pythonURI}/api/donations`, { ...fetchOptions, signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const donations = Array.isArray(raw) ? raw : (Array.isArray(raw?.donations) ? raw.donations : []);

        // Extract unique categories and build a simple tree
        const categories = {};
        donations.forEach(d => {
          const cat = d.category || 'other';
          if (!categories[cat]) categories[cat] = new Set();
          if (d.food_name) categories[cat].add(d.food_name);
        });

        tree = {
          name: 'All Food',
          children: Object.entries(categories).map(([cat, foods]) => ({
            name: cat,
            children: [...foods].map(f => ({ name: f, children: [] }))
          }))
        };
        source = 'flask';
      } catch (flaskErr) {
        console.log('Flask also unavailable');
      }
    }

    if (!tree || !tree.children) {
      area.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-2">⚠️</div>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Could not load categories from either backend.</p>
          <button onclick="location.reload()" class="mt-3 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-semibold transition-colors">Retry</button>
        </div>`;
      return;
    }

    const sourceBadge = `<div class="mb-4"><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${source === 'spring' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'}">${source === 'spring' ? '☕ Java Spring' : '🐍 Flask'}</span></div>`;
    area.innerHTML = sourceBadge + `<ul class="space-y-1">${renderTree(tree)}</ul>`;
  });

  /* ── Find path ── */
  document.getElementById('path-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cat = document.getElementById('path-input').value.trim();
    if (!cat) return;

    const btn = document.getElementById('path-btn');
    const result = document.getElementById('path-result');
    btn.disabled = true;
    btn.textContent = 'Tracing…';

    try {
      const path = await springFetch(`${javaURI}/api/donations/categories/path?category=${encodeURIComponent(cat)}`);
      const items = Array.isArray(path) ? path : [];
      if (items.length === 0) {
        result.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm">Category not found.</p>';
      } else {
        result.innerHTML = `
          <div class="flex items-center flex-wrap gap-2">
            ${items.map((p, i) => {
              const emoji = CATEGORY_EMOJIS[p] || '📁';
              const isLast = i === items.length - 1;
              return `<span class="px-3 py-1.5 rounded-lg text-sm font-semibold ${isLast ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}">${emoji} ${p}</span>${!isLast ? '<svg class="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' : ''}`;
            }).join('')}
          </div>`;
      }
    } catch (err) {
      result.innerHTML = `<p class="text-red-600 dark:text-red-400 text-sm">Error: ${err.message}</p>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Trace Path';
    }
  });
</script>
