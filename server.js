// ============================================================
//  MinimalBlog v2 — Serveur Express + SQLite
//  Démarrage : node server.js   →   http://localhost:3000
// ============================================================

const express = require('express');
const session = require('express-session');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const PORT = 3000;

// ---- BASE DE DONNÉES ----
const db = new DatabaseSync(path.join(__dirname, 'blog.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nom  TEXT NOT NULL,
    icon TEXT DEFAULT '📌'
  );

  CREATE TABLE IF NOT EXISTS articles (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie_id      INTEGER,
    titre             TEXT NOT NULL,
    contenu           TEXT NOT NULL,
    auteur            TEXT NOT NULL,
    image_principale  TEXT DEFAULT '',
    statut            TEXT DEFAULT 'brouillon',
    featured          INTEGER DEFAULT 0,
    date_publication  TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%S','now')),
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS commentaires (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id       INTEGER NOT NULL,
    pseudo           TEXT NOT NULL,
    email            TEXT DEFAULT '',
    contenu          TEXT NOT NULL,
    date_commentaire TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%S','now')),
    approuve         INTEGER DEFAULT 1,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin (
    id          INTEGER PRIMARY KEY,
    login       TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL
  );
`);

// ---- DONNÉES INITIALES ----
if (!db.prepare('SELECT COUNT(*) as c FROM categories').get().c) {
  // Catégories
  const insCat = db.prepare('INSERT INTO categories (nom,icon) VALUES (?,?)');
  insCat.run('Technologie','⚡');
  insCat.run('Voyage','✈️');
  insCat.run('Cuisine','🍜');
  insCat.run('Science','🔭');
  insCat.run('Culture','🎭');

  const cats = {};
  db.prepare('SELECT id,nom FROM categories').all().forEach(c => { cats[c.nom] = c.id; });

  const insArt = db.prepare(`
    INSERT INTO articles (categorie_id,titre,contenu,auteur,image_principale,statut,featured,date_publication)
    VALUES (?,?,?,?,?,?,?,?)
  `);

  const a1 = insArt.run(
    cats['Technologie'],
    "L'Intelligence Artificielle en 2025 : État des lieux",
    `L'intelligence artificielle a connu une évolution spectaculaire ces dernières années. Des modèles de langage aux systèmes de vision par ordinateur, les avancées sont impressionnantes et transforment chaque secteur de notre société.\n\nLes grands modèles de langage (LLM) sont désormais capables de raisonnement complexe, de génération de code et même de résolution de problèmes mathématiques avancés. Cette révolution technologique impacte tous les secteurs : médecine, éducation, industrie créative...\n\nCependant, des questions éthiques importantes se posent : biais algorithmiques, impact sur l'emploi, vie privée des utilisateurs. La régulation de l'IA devient un enjeu majeur pour les gouvernements du monde entier, avec l'AI Act européen comme premier cadre légal ambitieux.\n\nLes chercheurs s'accordent à dire que nous sommes encore au début de cette révolution. Les prochaines années verront l'émergence de systèmes encore plus puissants, capables de raisonnement causal et d'apprentissage continu.`,
    'Marie Laurent','https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80&fit=crop',
    'publie',1,'2025-04-15T10:00:00'
  );
  const a2 = insArt.run(
    cats['Voyage'],
    "Voyage au Japon : Guide complet pour les débutants",
    `Le Japon est une destination fascinante qui mêle tradition millénaire et modernité ultra-développée. De Tokyo à Kyoto, chaque ville offre une expérience unique et absolument inoubliable.\n\nCommencez votre voyage à Tokyo, la capitale dynamique aux multiples visages. Shibuya, Akihabara, Asakusa — chaque quartier a sa personnalité propre. Le mont Fuji est incontournable pour les amateurs de randonnée et de photographie.\n\nKyoto, l'ancienne capitale impériale, regorge de temples bouddhistes et de jardins zen soigneusement entretenus. Arashiyama et son célèbre bambouseraie, Fushimi Inari et ses milliers de torii vermillon... La magie est omniprésente.\n\nCôté gastronomie, le Japon est un paradis. Des ramen aux sushis, des okonomiyaki aux wagashi, chaque repas est une découverte. Évitez les restaurants touristiques et privilégiez les izakaya de quartier pour une expérience authentique.`,
    'Thomas Dubois','https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80&fit=crop',
    'publie',0,'2025-03-20T14:30:00'
  );
  const a3 = insArt.run(
    cats['Cuisine'],
    "La Cuisine Marocaine : Secrets et Recettes Traditionnelles",
    `La cuisine marocaine est l'une des plus riches et des plus variées au monde. Mélange d'influences berbères, arabes, méditerranéennes et andalouses, elle offre une palette de saveurs extraordinaire qui enchante les palais du monde entier.\n\nLe tajine est sans doute le plat le plus emblématique. Cuit lentement dans un plat en terre cuite, il peut être préparé avec du poulet, de l'agneau ou des légumes, toujours agrémenté d'épices soigneusement dosées comme le cumin, le gingembre, le safran et la cannelle.\n\nLa harira, soupe nourrissante à base de tomates, lentilles et pois chiches, est incontournable pendant le Ramadan. Et n'oublions pas la pastilla, ce feuilleté sucré-salé à la volaille, véritable chef-d'œuvre de la gastronomie marocaine.\n\nLe couscous du vendredi reste la tradition familiale par excellence. Préparé avec amour pendant des heures, il symbolise le partage et la convivialité qui sont au cœur de la culture marocaine.`,
    'Fatima Amrani','https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=900&q=80&fit=crop',
    'publie',0,'2025-02-10T09:00:00'
  );
  const a4 = insArt.run(
    cats['Science'],
    "Exploration de Mars : Les Dernières Découvertes de 2025",
    `Les missions martiennes récentes ont révélé des données fascinantes sur la planète rouge. Les rovers Perseverance et Curiosity continuent d'explorer la surface avec des résultats scientifiques remarquables qui redéfinissent notre compréhension de l'histoire de Mars.\n\nDes traces d'eau ancienne ont été découvertes dans plusieurs régions, notamment dans le cratère Jezero où Perseverance a collecté des échantillons de roches sédimentaires exceptionnels. Des minéraux organiques complexes ont également été détectés, alimentant les spéculations sur une possible vie microbienne primitive.\n\nLes projets d'exploration humaine de Mars avancent rapidement. SpaceX, NASA et d'autres agences spatiales travaillent activement à des missions habitées prévues pour les années 2030. L'architecture des bases martiennes, la production d'oxygène in-situ et les systèmes de protection contre les radiations sont les défis techniques prioritaires.\n\nL'hélicoptère Ingenuity a effectué plus de 70 vols sur Mars, démontrant la faisabilité de l'exploration aérienne sur des planètes à atmosphère raréfiée.`,
    'Jean-Pierre Moreau','https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&q=80&fit=crop',
    'publie',0,'2025-04-05T16:00:00'
  );
  const a5 = insArt.run(
    cats['Culture'],
    "Le Jazz : Une Histoire d'Innovation et de Liberté",
    `Né à la Nouvelle-Orléans au début du XXe siècle, le jazz est bien plus qu'un genre musical — c'est une philosophie de la liberté d'expression, de l'improvisation et du dialogue entre musiciens.\n\nDes pionniers comme Louis Armstrong et Duke Ellington ont défini les bases de ce langage musical unique. Miles Davis a révolutionné le genre à plusieurs reprises : du bebop au cool jazz, puis au jazz fusion avec son album révolutionnaire "Bitches Brew". John Coltrane a repoussé les limites harmoniques avec ses explorations modales sur "A Love Supreme".\n\nLe jazz a toujours été un miroir de son époque, reflétant les tensions sociales, les aspirations à la liberté et les métissages culturels. Le Harlem Renaissance des années 20, la contestation des années 60, jusqu'au jazz contemporain qui absorbe le hip-hop et l'électronique.\n\nAujourd'hui, des artistes comme Kamasi Washington, Esperanza Spalding ou Nubya Garcia prouvent que le jazz est bien vivant, plus ouvert et plus créatif que jamais.`,
    'Sophie Renard','https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=900&q=80&fit=crop',
    'publie',0,'2025-03-28T11:00:00'
  );
  insArt.run(
    cats['Technologie'],
    "Python vs JavaScript : Quel langage choisir en 2025 ?",
    `Python et JavaScript sont deux des langages de programmation les plus populaires du moment. Chacun a ses forces et ses domaines de prédilection, et le choix entre eux dépend largement de ce que vous souhaitez accomplir.\n\nPython excelle dans la data science, le machine learning et l'automatisation. Sa syntaxe claire et lisible, proche du pseudo-code, le rend accessible aux débutants. Ses bibliothèques riches comme NumPy, Pandas, TensorFlow et PyTorch en font le choix de référence pour les data scientists et chercheurs en IA.\n\nJavaScript, quant à lui, domine le développement web front-end et est désormais omniprésent côté serveur avec Node.js. Son écosystème React/Vue/Angular est incontournable pour les développeurs web. TypeScript, son superset typé, gagne en popularité dans les grandes équipes.\n\nMa recommandation : si vous débutez en programmation, commencez par Python pour sa clarté. Si vous visez le développement web, JavaScript s'impose. Et surtout, ne vous limitez pas — les meilleurs développeurs maîtrisent les deux !`,
    'Alex Chen','https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&fit=crop',
    'brouillon',0,'2025-04-18T10:00:00'
  );

  // Commentaires
  const insCom = db.prepare(`
    INSERT INTO commentaires (article_id,pseudo,email,contenu,date_commentaire,approuve)
    VALUES (?,?,?,?,?,?)
  `);
  const r1=a1.lastInsertRowid, r2=a2.lastInsertRowid, r3=a3.lastInsertRowid, r4=a4.lastInsertRowid;
  insCom.run(r1,'Alice Martin','alice@email.com',"Article très intéressant ! L'IA évolue vraiment à une vitesse impressionnante. Merci pour ce résumé complet.",'2025-04-16T08:00:00',1);
  insCom.run(r1,'Bob Dev','bob@email.com',"Je pense que les risques éthiques sont sous-estimés. L'AI Act européen est un bon début mais il faudra aller plus loin.",'2025-04-17T14:00:00',1);
  insCom.run(r2,'Yuki Tanaka','yuki@email.com',"J'ai visité le Japon l'été dernier, et je confirme : c'est une expérience magique et transformatrice !",'2025-03-21T09:00:00',1);
  insCom.run(r2,'Marco Rossi','marco@email.com',"Super guide complet ! Je prépare mon voyage pour cet automne.",'2025-03-22T16:00:00',0);
  insCom.run(r3,'Amina Benali','amina@email.com',"La recette de la harira de ma grand-mère est encore meilleure, mais cet article donne vraiment envie de cuisiner marocain !",'2025-02-11T10:00:00',1);
  insCom.run(r4,'Chris Space','chris@email.com',"Les découvertes sur l'eau martienne sont fascinantes. Si des traces de vie sont confirmées, ce sera la plus grande découverte de l'histoire !",'2025-04-06T12:00:00',0);

  // Admin
  db.prepare('INSERT INTO admin (login,mot_de_passe) VALUES (?,?)').run('admin','admin123');

  console.log('✅ Base de données initialisée avec les données de démo.');
}

// ---- MIDDLEWARE ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'minimalblog-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Middleware auth admin
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.status(401).json({ error: 'Non autorisé — veuillez vous connecter.' });
}

// ============================================================
//  ROUTES API
// ============================================================

// ---- Catégories ----
app.get('/api/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY id').all());
});

app.post('/api/categories', requireAuth, (req, res) => {
  const { nom, icon = '📌' } = req.body;
  if (!nom) return res.status(400).json({ error: 'Le nom est requis.' });
  const r = db.prepare('INSERT INTO categories (nom,icon) VALUES (?,?)').run(nom, icon);
  res.json({ id: r.lastInsertRowid, nom, icon });
});

// ---- Articles ----
app.get('/api/articles', (req, res) => {
  let q = 'SELECT * FROM articles WHERE 1=1';
  const params = [];
  if (req.query.statut)       { q += ' AND statut = ?';           params.push(req.query.statut); }
  if (req.query.categorie_id) { q += ' AND categorie_id = ?';     params.push(req.query.categorie_id); }
  if (req.query.search) {
    q += ' AND (LOWER(titre) LIKE ? OR LOWER(contenu) LIKE ?)';
    const s = `%${req.query.search.toLowerCase()}%`;
    params.push(s, s);
  }
  q += ' ORDER BY date_publication DESC';
  res.json(db.prepare(q).all(...params));
});

app.get('/api/articles/featured', (req, res) => {
  const art =
    db.prepare("SELECT * FROM articles WHERE statut='publie' AND featured=1 ORDER BY date_publication DESC LIMIT 1").get() ||
    db.prepare("SELECT * FROM articles WHERE statut='publie' ORDER BY date_publication DESC LIMIT 1").get();
  if (!art) return res.status(404).json({ error: 'Aucun article publié.' });
  res.json(art);
});

app.get('/api/articles/:id', (req, res) => {
  const art = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!art) return res.status(404).json({ error: 'Article introuvable.' });
  res.json(art);
});

app.post('/api/articles', requireAuth, (req, res) => {
  const { titre, contenu, auteur, categorie_id, statut = 'brouillon', image_principale = '', featured = 0 } = req.body;
  if (!titre || !contenu || !auteur)
    return res.status(400).json({ error: 'Titre, contenu et auteur sont obligatoires.' });
  const r = db.prepare(`
    INSERT INTO articles (titre,contenu,auteur,categorie_id,statut,image_principale,featured)
    VALUES (?,?,?,?,?,?,?)
  `).run(titre, contenu, auteur, categorie_id || null, statut, image_principale, featured ? 1 : 0);
  res.json({ id: r.lastInsertRowid });
});

app.put('/api/articles/:id', requireAuth, (req, res) => {
  if (!db.prepare('SELECT id FROM articles WHERE id = ?').get(req.params.id))
    return res.status(404).json({ error: 'Article introuvable.' });
  const { titre, contenu, auteur, categorie_id, statut, image_principale, featured } = req.body;
  db.prepare(`
    UPDATE articles SET titre=?,contenu=?,auteur=?,categorie_id=?,statut=?,image_principale=?,featured=?
    WHERE id=?
  `).run(titre, contenu, auteur, categorie_id || null, statut, image_principale, featured ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/articles/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM commentaires WHERE article_id = ?').run(req.params.id);
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ---- Commentaires (public — par article) ----
app.get('/api/articles/:id/commentaires', (req, res) => {
  let q = 'SELECT * FROM commentaires WHERE article_id = ?';
  const params = [req.params.id];
  if (req.query.approuve !== undefined) {
    q += ' AND approuve = ?';
    params.push(req.query.approuve === 'true' || req.query.approuve === '1' ? 1 : 0);
  }
  q += ' ORDER BY date_commentaire ASC';
  res.json(db.prepare(q).all(...params));
});

app.post('/api/articles/:id/commentaires', (req, res) => {
  const { pseudo, email = '', contenu } = req.body;
  if (!pseudo || !contenu)
    return res.status(400).json({ error: 'Le pseudo et le contenu sont requis.' });
  if (!db.prepare('SELECT id FROM articles WHERE id = ?').get(req.params.id))
    return res.status(404).json({ error: 'Article introuvable.' });
  // approuve = 1 → visible immédiatement
  const r = db.prepare(`
    INSERT INTO commentaires (article_id,pseudo,email,contenu,approuve)
    VALUES (?,?,?,?,1)
  `).run(req.params.id, pseudo.trim(), email.trim(), contenu.trim());
  const com = db.prepare('SELECT * FROM commentaires WHERE id = ?').get(r.lastInsertRowid);
  res.json(com);
});

// ---- Commentaires (admin — tous les articles) ----
app.get('/api/commentaires', requireAuth, (req, res) => {
  let q = 'SELECT * FROM commentaires WHERE 1=1';
  const params = [];
  if (req.query.approuve !== undefined) {
    q += ' AND approuve = ?';
    params.push(req.query.approuve === 'true' || req.query.approuve === '1' ? 1 : 0);
  }
  q += ' ORDER BY date_commentaire DESC';
  res.json(db.prepare(q).all(...params));
});

app.put('/api/commentaires/:id/approuver', requireAuth, (req, res) => {
  db.prepare('UPDATE commentaires SET approuve = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.delete('/api/commentaires/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM commentaires WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ---- Authentification ----
app.post('/api/login', (req, res) => {
  const { login, mot_de_passe } = req.body;
  const admin = db.prepare('SELECT * FROM admin WHERE login = ? AND mot_de_passe = ?').get(login, mot_de_passe);
  if (!admin) return res.status(401).json({ error: 'Identifiants incorrects.' });
  req.session.isAdmin = true;
  res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/auth/check', (req, res) => {
  res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

// ---- Démarrage ----
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   MinimalBlog v2 — Serveur démarré  ✅    ║
║   Ouvrir : http://localhost:${PORT}          ║
║   Admin  : http://localhost:${PORT}/admin/login.html  ║
╚════════════════════════════════════════════╝
  `);
});
