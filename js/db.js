// ============================================================
//  MinimalBlog v2 — Base de données (localStorage)
//  Images : Unsplash (libres de droits)
// ============================================================

const DB = {

  init() {
    if (!localStorage.getItem('mb2_initialized')) {
      this.seedCategories();
      this.seedArticles();
      this.seedCommentaires();
      this.seedAdmin();
      localStorage.setItem('mb2_initialized', 'true');
    }
  },

  reset() {
    ['mb2_initialized','mb2_categories','mb2_articles','mb2_commentaires','mb2_admin']
      .forEach(k => localStorage.removeItem(k));
    this.init();
  },

  // ---- CATEGORIES ----
  seedCategories() {
    localStorage.setItem('mb2_categories', JSON.stringify([
      { id: 1, nom: 'Technologie', icon: '⚡' },
      { id: 2, nom: 'Voyage',      icon: '✈️' },
      { id: 3, nom: 'Cuisine',     icon: '🍜' },
      { id: 4, nom: 'Science',     icon: '🔭' },
      { id: 5, nom: 'Culture',     icon: '🎭' }
    ]));
  },

  getCategories() {
    return JSON.parse(localStorage.getItem('mb2_categories')) || [];
  },

  getCategorieById(id) {
    return this.getCategories().find(c => c.id == id);
  },

  addCategorie(nom) {
    const cats = this.getCategories();
    const id = cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1;
    cats.push({ id, nom, icon: '📌' });
    localStorage.setItem('mb2_categories', JSON.stringify(cats));
    return id;
  },

  // ---- ARTICLES ----
  // Images Unsplash : format direct embed, libres d'utilisation
  seedArticles() {
    const articles = [
      {
        id: 1, categorie_id: 1,
        titre: "L'Intelligence Artificielle en 2025 : État des lieux",
        contenu: `L'intelligence artificielle a connu une évolution spectaculaire ces dernières années. Des modèles de langage aux systèmes de vision par ordinateur, les avancées sont impressionnantes et transforment chaque secteur de notre société.\n\nLes grands modèles de langage (LLM) sont désormais capables de raisonnement complexe, de génération de code et même de résolution de problèmes mathématiques avancés. Cette révolution technologique impacte tous les secteurs : médecine, éducation, industrie créative...\n\nCependant, des questions éthiques importantes se posent : biais algorithmiques, impact sur l'emploi, vie privée des utilisateurs. La régulation de l'IA devient un enjeu majeur pour les gouvernements du monde entier, avec l'AI Act européen comme premier cadre légal ambitieux.\n\nLes chercheurs s'accordent à dire que nous sommes encore au début de cette révolution. Les prochaines années verront l'émergence de systèmes encore plus puissants, capables de raisonnement causal et d'apprentissage continu.`,
        date_publication: '2025-04-15T10:00:00',
        auteur: 'Marie Laurent',
        // Robot / IA
        image_principale: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80&fit=crop',
        statut: 'publie',
        featured: true
      },
      {
        id: 2, categorie_id: 2,
        titre: "Voyage au Japon : Guide complet pour les débutants",
        contenu: `Le Japon est une destination fascinante qui mêle tradition millénaire et modernité ultra-développée. De Tokyo à Kyoto, chaque ville offre une expérience unique et absolument inoubliable.\n\nCommencez votre voyage à Tokyo, la capitale dynamique aux multiples visages. Shibuya, Akihabara, Asakusa — chaque quartier a sa personnalité propre. Le mont Fuji est incontournable pour les amateurs de randonnée et de photographie.\n\nKyoto, l'ancienne capitale impériale, regorge de temples bouddhistes et de jardins zen soigneusement entretenus. Arashiyama et son célèbre bambouseraie, Fushimi Inari et ses milliers de torii vermillon... La magie est omniprésente.\n\nCôté gastronomie, le Japon est un paradis. Des ramen aux sushis, des okonomiyaki aux wagashi, chaque repas est une découverte. Évitez les restaurants touristiques et privilégiez les izakaya de quartier pour une expérience authentique.`,
        date_publication: '2025-03-20T14:30:00',
        auteur: 'Thomas Dubois',
        // Japon - temple torii
        image_principale: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80&fit=crop',
        statut: 'publie',
        featured: false
      },
      {
        id: 3, categorie_id: 3,
        titre: "La Cuisine Marocaine : Secrets et Recettes Traditionnelles",
        contenu: `La cuisine marocaine est l'une des plus riches et des plus variées au monde. Mélange d'influences berbères, arabes, méditerranéennes et andalouses, elle offre une palette de saveurs extraordinaire qui enchante les palais du monde entier.\n\nLe tajine est sans doute le plat le plus emblématique. Cuit lentement dans un plat en terre cuite, il peut être préparé avec du poulet, de l'agneau ou des légumes, toujours agrémenté d'épices soigneusement dosées comme le cumin, le gingembre, le safran et la cannelle.\n\nLa harira, soupe nourrissante à base de tomates, lentilles et pois chiches, est incontournable pendant le Ramadan. Et n'oublions pas la pastilla, ce feuilleté sucré-salé à la volaille, véritable chef-d'œuvre de la gastronomie marocaine.\n\nLe couscous du vendredi reste la tradition familiale par excellence. Préparé avec amour pendant des heures, il symbolise le partage et la convivialité qui sont au cœur de la culture marocaine.`,
        date_publication: '2025-02-10T09:00:00',
        auteur: 'Fatima Amrani',
        // Épices marocaines
        image_principale: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=900&q=80&fit=crop',
        statut: 'publie',
        featured: false
      },
      {
        id: 4, categorie_id: 4,
        titre: "Exploration de Mars : Les Dernières Découvertes de 2025",
        contenu: `Les missions martiennes récentes ont révélé des données fascinantes sur la planète rouge. Les rovers Perseverance et Curiosity continuent d'explorer la surface avec des résultats scientifiques remarquables qui redéfinissent notre compréhension de l'histoire de Mars.\n\nDes traces d'eau ancienne ont été découvertes dans plusieurs régions, notamment dans le cratère Jezero où Perseverance a collecté des échantillons de roches sédimentaires exceptionnels. Des minéraux organiques complexes ont également été détectés, alimentant les spéculations sur une possible vie microbienne primitive.\n\nLes projets d'exploration humaine de Mars avancent rapidement. SpaceX, NASA et d'autres agences spatiales travaillent activement à des missions habitées prévues pour les années 2030. L'architecture des bases martiennes, la production d'oxygène in-situ et les systèmes de protection contre les radiations sont les défis techniques prioritaires.\n\nL'hélicoptère Ingenuity a effectué plus de 70 vols sur Mars, démontrant la faisabilité de l'exploration aérienne sur des planètes à atmosphère raréfiée.`,
        date_publication: '2025-04-05T16:00:00',
        auteur: 'Jean-Pierre Moreau',
        // Mars / espace
        image_principale: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&q=80&fit=crop',
        statut: 'publie',
        featured: false
      },
      {
        id: 5, categorie_id: 5,
        titre: "Le Jazz : Une Histoire d'Innovation et de Liberté",
        contenu: `Né à la Nouvelle-Orléans au début du XXe siècle, le jazz est bien plus qu'un genre musical — c'est une philosophie de la liberté d'expression, de l'improvisation et du dialogue entre musiciens.\n\nDes pionniers comme Louis Armstrong et Duke Ellington ont défini les bases de ce langage musical unique. Miles Davis a révolutionné le genre à plusieurs reprises : du bebop au cool jazz, puis au jazz fusion avec son album révolutionnaire "Bitches Brew". John Coltrane a repoussé les limites harmoniques avec ses explorations modales sur "A Love Supreme".\n\nLe jazz a toujours été un miroir de son époque, reflétant les tensions sociales, les aspirations à la liberté et les métissages culturels. Le Harlem Renaissance des années 20, la contestation des années 60, jusqu'au jazz contemporain qui absorbe le hip-hop et l'électronique.\n\nAujourd'hui, des artistes comme Kamasi Washington, Esperanza Spalding ou Nubya Garcia prouvent que le jazz est bien vivant, plus ouvert et plus créatif que jamais.`,
        date_publication: '2025-03-28T11:00:00',
        auteur: 'Sophie Renard',
        // Jazz musicien
        image_principale: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=900&q=80&fit=crop',
        statut: 'publie',
        featured: false
      },
      {
        id: 6, categorie_id: 1,
        titre: "Python vs JavaScript : Quel langage choisir en 2025 ?",
        contenu: `Python et JavaScript sont deux des langages de programmation les plus populaires du moment. Chacun a ses forces et ses domaines de prédilection, et le choix entre eux dépend largement de ce que vous souhaitez accomplir.\n\nPython excelle dans la data science, le machine learning et l'automatisation. Sa syntaxe claire et lisible, proche du pseudo-code, le rend accessible aux débutants. Ses bibliothèques riches comme NumPy, Pandas, TensorFlow et PyTorch en font le choix de référence pour les data scientists et chercheurs en IA.\n\nJavaScript, quant à lui, domine le développement web front-end et est désormais omniprésent côté serveur avec Node.js. Son écosystème React/Vue/Angular est incontournable pour les développeurs web. TypeScript, son superset typé, gagne en popularité dans les grandes équipes.\n\nMa recommandation : si vous débutez en programmation, commencez par Python pour sa clarté. Si vous visez le développement web, JavaScript s'impose. Et surtout, ne vous limitez pas — les meilleurs développeurs maîtrisent les deux !`,
        date_publication: '2025-04-18T10:00:00',
        auteur: 'Alex Chen',
        // Code sur écran
        image_principale: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&fit=crop',
        statut: 'brouillon',
        featured: false
      }
    ];
    localStorage.setItem('mb2_articles', JSON.stringify(articles));
  },

  getArticles(statut = null, categorie_id = null, search = null) {
    let arts = JSON.parse(localStorage.getItem('mb2_articles')) || [];
    if (statut) arts = arts.filter(a => a.statut === statut);
    if (categorie_id) arts = arts.filter(a => a.categorie_id == categorie_id);
    if (search) {
      const q = search.toLowerCase();
      arts = arts.filter(a => a.titre.toLowerCase().includes(q) || a.contenu.toLowerCase().includes(q));
    }
    return arts.sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication));
  },

  getArticleById(id) {
    return (JSON.parse(localStorage.getItem('mb2_articles')) || []).find(a => a.id == id);
  },

  getFeatured() {
    const arts = this.getArticles('publie');
    return arts.find(a => a.featured) || arts[0];
  },

  addArticle(data) {
    const arts = JSON.parse(localStorage.getItem('mb2_articles')) || [];
    const id = arts.length ? Math.max(...arts.map(a => a.id)) + 1 : 1;
    arts.push({ id, ...data, date_publication: new Date().toISOString(), featured: false });
    localStorage.setItem('mb2_articles', JSON.stringify(arts));
    return id;
  },

  updateArticle(id, data) {
    const arts = JSON.parse(localStorage.getItem('mb2_articles')) || [];
    const idx = arts.findIndex(a => a.id == id);
    if (idx !== -1) { arts[idx] = { ...arts[idx], ...data }; localStorage.setItem('mb2_articles', JSON.stringify(arts)); return true; }
    return false;
  },

  deleteArticle(id) {
    localStorage.setItem('mb2_articles', JSON.stringify((JSON.parse(localStorage.getItem('mb2_articles')) || []).filter(a => a.id != id)));
    localStorage.setItem('mb2_commentaires', JSON.stringify((JSON.parse(localStorage.getItem('mb2_commentaires')) || []).filter(c => c.article_id != id)));
  },

  // ---- COMMENTAIRES ----
  seedCommentaires() {
    localStorage.setItem('mb2_commentaires', JSON.stringify([
      { id: 1, article_id: 1, pseudo: 'Alice Martin', email: 'alice@email.com', contenu: 'Article très intéressant ! L\'IA évolue vraiment à une vitesse impressionnante. Merci pour ce résumé complet.', date_commentaire: '2025-04-16T08:00:00', approuve: true },
      { id: 2, article_id: 1, pseudo: 'Bob Dev', email: 'bob@email.com', contenu: 'Je pense que les risques éthiques sont sous-estimés. L\'AI Act européen est un bon début mais il faudra aller plus loin.', date_commentaire: '2025-04-17T14:00:00', approuve: true },
      { id: 3, article_id: 2, pseudo: 'Yuki Tanaka', email: 'yuki@email.com', contenu: 'J\'ai visité le Japon l\'été dernier, et je confirme : c\'est une expérience magique et transformatrice ! Le Fushimi Inari au lever du soleil est inoubliable.', date_commentaire: '2025-03-21T09:00:00', approuve: true },
      { id: 4, article_id: 2, pseudo: 'Marco Rossi', email: 'marco@email.com', contenu: 'Super guide complet ! Je prépare mon voyage pour cet automne. Une question : quelle période est idéale pour voir les érables rouges ?', date_commentaire: '2025-03-22T16:00:00', approuve: false },
      { id: 5, article_id: 3, pseudo: 'Amina Benali', email: 'amina@email.com', contenu: 'La recette de la harira de ma grand-mère est encore meilleure, mais cet article donne vraiment envie de cuisiner marocain ce soir !', date_commentaire: '2025-02-11T10:00:00', approuve: true },
      { id: 6, article_id: 4, pseudo: 'Chris Space', email: 'chris@email.com', contenu: 'Les découvertes sur l\'eau martienne sont fascinantes. Si des traces de vie sont confirmées, ce sera la plus grande découverte de l\'histoire de l\'humanité.', date_commentaire: '2025-04-06T12:00:00', approuve: false }
    ]));
  },

  getCommentaires(article_id = null, approuve = null) {
    let coms = JSON.parse(localStorage.getItem('mb2_commentaires')) || [];
    if (article_id) coms = coms.filter(c => c.article_id == article_id);
    if (approuve !== null) coms = coms.filter(c => c.approuve === approuve);
    return coms.sort((a, b) => new Date(b.date_commentaire) - new Date(a.date_commentaire));
  },

  addCommentaire(data) {
    const coms = JSON.parse(localStorage.getItem('mb2_commentaires')) || [];
    const id = coms.length ? Math.max(...coms.map(c => c.id)) + 1 : 1;
    coms.push({ id, ...data, date_commentaire: new Date().toISOString(), approuve: false });
    localStorage.setItem('mb2_commentaires', JSON.stringify(coms));
    return id;
  },

  approuverCommentaire(id) {
    const coms = JSON.parse(localStorage.getItem('mb2_commentaires')) || [];
    const idx = coms.findIndex(c => c.id == id);
    if (idx !== -1) { coms[idx].approuve = true; localStorage.setItem('mb2_commentaires', JSON.stringify(coms)); }
  },

  supprimerCommentaire(id) {
    localStorage.setItem('mb2_commentaires', JSON.stringify((JSON.parse(localStorage.getItem('mb2_commentaires')) || []).filter(c => c.id != id)));
  },

  // ---- ADMIN ----
  seedAdmin() {
    localStorage.setItem('mb2_admin', JSON.stringify({ login: 'admin', mot_de_passe: 'admin123' }));
  },
  login(login, password) {
    const a = JSON.parse(localStorage.getItem('mb2_admin'));
    if (a && a.login === login && a.mot_de_passe === password) {
      sessionStorage.setItem('mb2_logged', 'true'); return true;
    }
    return false;
  },
  isLoggedIn() { return sessionStorage.getItem('mb2_logged') === 'true'; },
  logout() { sessionStorage.removeItem('mb2_logged'); }
};

// ---- Utilitaires ----
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
    background:${type==='success'?'var(--teal)':'var(--rouge)'};
    color:${type==='success'?'var(--navy)':'#fff'};
    padding:0.85rem 1.5rem;border-radius:10px;
    font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;
    box-shadow:0 8px 30px rgba(0,0,0,0.4);
    animation:slideUp 0.3s ease;
  `;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3500);
}

// Fallback image placeholder si Unsplash ne charge pas
function imgFallback(el, text) {
  el.style.cssText = 'display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1f2937,#374151);color:#6b7280;font-size:0.9rem;height:100%';
  el.innerHTML = `<span>📷 Image non disponible</span>`;
}
