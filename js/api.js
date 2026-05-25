// ============================================================
//  MinimalBlog v2 — Client API
//  Remplace db.js (localStorage) — communique avec le serveur
// ============================================================

const DB = {

  // ---- Utilitaire fetch ----
  async _fetch(url, opts = {}) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok && res.status !== 404) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Erreur ${res.status}`);
    }
    return res;
  },

  // ---- Catégories ----
  async getCategories() {
    const r = await this._fetch('/api/categories');
    return r.json();
  },

  async getCategorieById(id) {
    const cats = await this.getCategories();
    return cats.find(c => c.id == id) || null;
  },

  async addCategorie(nom) {
    const r = await this._fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ nom })
    });
    const d = await r.json();
    return d.id;
  },

  // ---- Articles ----
  async getArticles(statut = null, categorie_id = null, search = null) {
    const p = new URLSearchParams();
    if (statut)       p.set('statut', statut);
    if (categorie_id) p.set('categorie_id', categorie_id);
    if (search)       p.set('search', search);
    const r = await this._fetch(`/api/articles?${p}`);
    return r.json();
  },

  async getArticleById(id) {
    const r = await this._fetch(`/api/articles/${id}`);
    if (r.status === 404) return null;
    return r.json();
  },

  async getFeatured() {
    const r = await this._fetch('/api/articles/featured');
    if (!r.ok) return null;
    return r.json();
  },

  async addArticle(data) {
    const r = await this._fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const d = await r.json();
    return d.id;
  },

  async updateArticle(id, data) {
    const r = await this._fetch(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return r.ok;
  },

  async deleteArticle(id) {
    await this._fetch(`/api/articles/${id}`, { method: 'DELETE' });
  },

  // ---- Commentaires ----
  // article_id fourni → commentaires d'un article (public)
  // article_id null   → tous les commentaires (admin)
  async getCommentaires(article_id = null, approuve = null) {
    const p = new URLSearchParams();
    if (approuve !== null) p.set('approuve', approuve ? 'true' : 'false');
    let url;
    if (article_id) {
      url = `/api/articles/${article_id}/commentaires?${p}`;
    } else {
      url = `/api/commentaires?${p}`;
    }
    const r = await this._fetch(url);
    return r.json();
  },

  async addCommentaire(data) {
    const { article_id, ...rest } = data;
    const r = await this._fetch(`/api/articles/${article_id}/commentaires`, {
      method: 'POST',
      body: JSON.stringify(rest)
    });
    const d = await r.json();
    return d.id;
  },

  async approuverCommentaire(id) {
    await this._fetch(`/api/commentaires/${id}/approuver`, { method: 'PUT' });
  },

  async supprimerCommentaire(id) {
    await this._fetch(`/api/commentaires/${id}`, { method: 'DELETE' });
  },

  // ---- Admin ----
  async login(login, mot_de_passe) {
    try {
      await this._fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ login, mot_de_passe })
      });
      sessionStorage.setItem('mb2_logged', 'true');
      return true;
    } catch {
      return false;
    }
  },

  async logout() {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {});
    sessionStorage.removeItem('mb2_logged');
  },

  isLoggedIn() {
    return sessionStorage.getItem('mb2_logged') === 'true';
  },

  // Vérification côté serveur (pour les pages admin)
  async checkAuth() {
    const r = await fetch('/api/auth/check');
    const d = await r.json();
    return d.isAdmin;
  },

  // No-op : les données sont en base
  init() {}
};

// ---- Utilitaires (identiques à db.js) ----
function formatDate(s) {
  return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateShort(s) { return new Date(s).toLocaleDateString('fr-FR'); }

function escapeHtml(t) {
  if (!t) return '';
  const d = document.createElement('div'); d.textContent = t; return d.innerHTML;
}

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function showNotification(msg, type = 'success') {
  const old = document.querySelector('.notif'); if (old) old.remove();
  const d = document.createElement('div');
  d.className = 'notif';
  d.style.cssText = `
    position:fixed;bottom:2rem;right:2rem;z-index:9999;
    background:${type === 'success' ? 'var(--teal)' : 'var(--rouge)'};
    color:${type === 'success' ? 'var(--navy)' : '#fff'};
    padding:0.85rem 1.5rem;border-radius:10px;
    font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;
    box-shadow:0 8px 30px rgba(0,0,0,0.4);
    animation:slideUp 0.3s ease;
  `;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3500);
}
