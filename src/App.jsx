import { useState } from 'react'
import {
  Calculator, TrendingUp, Clock, BarChart3, DollarSign, Percent,
  Calendar, AlertTriangle, Target, ArrowUpRight, Settings,
  Coins, Wallet, PiggyBank, ArrowRight, Info, Zap, Star
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'

// Fonction formatage Ariary
const formatAr = (valeur) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(valeur))
}

// Composant Badge animé
const Badge = ({ children, color = 'purple' }) => (
  <span className={`badge badge-${color}`}>{children}</span>
)

function App() {
  const [capitalEngage, setCapitalEngage] = useState(25000000)
  const [valeurResiduelle, setValeurResiduelle] = useState(5000000)
  const [duree, setDuree] = useState(5)
  const [resultats, setResultats] = useState(['5000000', '6500000', '8000000', '9500000', '11000000'])
  const [showResults, setShowResults] = useState(false)
  const [anneesEstimation, setAnneesEstimation] = useState(5)
  const [tauxCroissance, setTauxCroissance] = useState(8)

  // Gestion durée
  const handleDureeChange = (e) => {
    const newDuree = parseInt(e.target.value) || 1
    setDuree(newDuree)
    setResultats(prev => {
      if (newDuree > prev.length) {
        return [...prev, ...Array(newDuree - prev.length).fill('0')]
      }
      return prev.slice(0, newDuree)
    })
  }

  const handleResultatChange = (index, value) => {
    const newResultats = [...resultats]
    newResultats[index] = value
    setResultats(newResultats)
  }

  const handleAddYear = () => {
    setResultats([...resultats, '0'])
    setDuree(duree + 1)
  }

  const handleRemoveYear = () => {
    if (resultats.length > 1) {
      setResultats(resultats.slice(0, -1))
      setDuree(duree - 1)
    }
  }

  // Calculs
  const handleCalculate = () => {
    setShowResults(true)
  }

  const resultatsNumeriques = resultats.map(r => parseFloat(r) || 0)
  const sommeResultats = resultatsNumeriques.reduce((acc, val) => acc + val, 0)
  const resultatNetMoyen = duree > 0 ? sommeResultats / duree : 0
  const capitalMoyenInvesti = (capitalEngage - valeurResiduelle) / 2
  const tmr = capitalMoyenInvesti !== 0
    ? ((resultatNetMoyen / capitalMoyenInvesti) * 100).toFixed(2)
    : 0

  // Données graphique principal
  const graphData = resultatsNumeriques.map((val, i) => ({
    annee: `Année ${i + 1}`,
    'Résultat net': val,
    'Moyenne': Math.round(resultatNetMoyen)
  }))

  // Données graphique en aires (cumulatif)
  let cumul = 0
  const graphCumul = resultatsNumeriques.map((val, i) => {
    cumul += val
    return {
      annee: `Année ${i + 1}`,
      'Cumul': cumul,
      'Investissement': capitalEngage
    }
  })

  // Estimation
  const anneeActuelle = new Date().getFullYear()
  const tauxDecimal = tauxCroissance / 100
  const estimationData = []
  let dernierResultat = resultatsNumeriques[resultatsNumeriques.length - 1] || 0

  for (let i = 1; i <= anneesEstimation; i++) {
    const estime = Math.round(dernierResultat * Math.pow(1 + tauxDecimal, i))
    estimationData.push({
      annee: `${anneeActuelle + duree + i}`,
      'Estimation basse': Math.round(estime * 0.80),
      'Estimation moyenne': estime,
      'Estimation haute': Math.round(estime * 1.20)
    })
  }

  const totalEstimeMoyen = estimationData.reduce((acc, e) => acc + e['Estimation moyenne'], 0)
  const resultatMoyenEstime = anneesEstimation > 0 ? totalEstimeMoyen / anneesEstimation : 0
  const nouveauTMR = capitalMoyenInvesti !== 0
    ? ((resultatMoyenEstime / capitalMoyenInvesti) * 100).toFixed(2)
    : 0

  const differenceTMR = (parseFloat(nouveauTMR) - parseFloat(tmr)).toFixed(2)
  const tendance = parseFloat(differenceTMR) >= 0 ? 'hausse' : 'baisse'

  // Niveau de rentabilité
  const getRentabiliteNiveau = (taux) => {
    const t = parseFloat(taux)
    if (t >= 50) return { label: 'Excellent', color: '#10b981', icon: Star }
    if (t >= 30) return { label: 'Très bon', color: '#6366f1', icon: TrendingUp }
    if (t >= 15) return { label: 'Bon', color: '#f59e0b', icon: Target }
    if (t >= 5) return { label: 'Moyen', color: '#f97316', icon: Info }
    return { label: 'Faible', color: '#ef4444', icon: AlertTriangle }
  }

  const niveau = getRentabiliteNiveau(tmr)
  const NiveauIcon = niveau.icon

  return (
    <div className="app">
      {/* ========== HEADER ========== */}
      <header className="header">
        <div className="header-top">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">
                <Coins size={24} />
              </div>
              <div>
                <h1>TMR Calculator</h1>
                <span className="logo-subtitle">Taux Moyen de Rentabilité</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="header-badge">
              <Zap size={14} />
              <span>Méthode sans actualisation</span>
            </div>
            <div className="header-badge header-badge-outline">
              <BookOpen size={14} />
              <span>Gestion Prévisionnelle</span>
            </div>
          </div>
        </div>
        <div className="header-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f4ff" />
          </svg>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* ========== FORMULAIRE ========== */}
          <div className="card card-form">
            <div className="card-header-gradient">
              <div className="card-header-left">
                <div className="icon-circle icon-circle-purple">
                  <Wallet size={20} />
                </div>
                <h2>Paramètres de l'investissement</h2>
              </div>
              <Badge color="purple">Étape 1</Badge>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <DollarSign size={14} />
                    Capital engagé (Ar)
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix">Ar</span>
                    <input
                      type="text"
                      value={formatAr(capitalEngage)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s/g, '').replace('Ar', '')
                        setCapitalEngage(parseFloat(val) || 0)
                      }}
                      className="input input-prefixed"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <PiggyBank size={14} />
                    Valeur résiduelle (Ar)
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix">Ar</span>
                    <input
                      type="text"
                      value={formatAr(valeurResiduelle)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s/g, '').replace('Ar', '')
                        setValeurResiduelle(parseFloat(val) || 0)
                      }}
                      className="input input-prefixed"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <Clock size={14} />
                    Durée de vie (années)
                  </label>
                  <div className="input-with-buttons">
                    <button onClick={handleRemoveYear} className="btn-icon" type="button">
                      <span>−</span>
                    </button>
                    <div className="input-wrapper input-center-wrapper">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={duree}
                        onChange={handleDureeChange}
                        className="input input-center"
                      />
                      <span className="input-suffix">ans</span>
                    </div>
                    <button onClick={handleAddYear} className="btn-icon" type="button">
                      <span>+</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="resultats-section">
                <div className="resultats-header">
                  <h3>
                    <BarChart3 size={18} />
                    Résultats nets après impôt par année
                  </h3>
                  <span className="resultats-total">
                    Total : <strong>{formatAr(sommeResultats)} Ar</strong>
                  </span>
                </div>
                <div className="resultats-grid">
                  {resultats.map((val, i) => (
                    <div key={i} className="resultat-card">
                      <span className="resultat-annee">Année {i + 1}</span>
                      <div className="input-wrapper input-sm-wrapper">
                        <span className="input-prefix input-prefix-sm">Ar</span>
                        <input
                          type="text"
                          value={formatAr(parseFloat(val) || 0)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\s/g, '').replace('Ar', '')
                            handleResultatChange(i, raw)
                          }}
                          className="input input-sm input-prefixed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleCalculate} className="btn-calculate">
                <Calculator size={20} />
                <span>Calculer le TMR</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* ========== RÉSULTATS ========== */}
          {showResults && (
            <>
              {/* TMR Principal */}
              <div className="card card-tmr-result">
                <div className="tmr-main">
                  <div className="tmr-left">
                    <div className="tmr-circle">
                      <svg viewBox="0 0 200 200" className="tmr-svg">
                        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="20" />
                        <circle
                          cx="100" cy="100" r="85"
                          fill="none"
                          stroke="white"
                          strokeWidth="20"
                          strokeDasharray={`${Math.min(parseFloat(tmr) * 5.34, 534)} 534`}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                          className="tmr-circle-progress"
                        />
                      </svg>
                      <div className="tmr-circle-content">
                        <span className="tmr-big-value">{tmr}</span>
                        <span className="tmr-percent">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="tmr-right">
                    <div className="tmr-niveau" style={{ color: niveau.color }}>
                      <NiveauIcon size={28} />
                      <span>{niveau.label}</span>
                    </div>
                    <h2>Taux Moyen de Rentabilité</h2>
                    <p className="tmr-description">
                      Le rendement comptable moyen de votre investissement est de <strong>{tmr}%</strong> par an
                      sur le capital moyen immobilisé.
                    </p>
                    <div className="tmr-stats">
                      <div className="tmr-stat">
                        <Wallet size={16} />
                        <div>
                          <span className="tmr-stat-label">Capital moyen investi</span>
                          <span className="tmr-stat-value">{formatAr(capitalMoyenInvesti)} Ar</span>
                        </div>
                      </div>
                      <div className="tmr-stat">
                        <TrendingUp size={16} />
                        <div>
                          <span className="tmr-stat-label">Résultat net moyen</span>
                          <span className="tmr-stat-value">{formatAr(resultatNetMoyen)} Ar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphiques */}
              <div className="graphs-grid">
                {/* Résultats par année */}
                <div className="card">
                  <div className="card-header-gradient-mini">
                    <div className="card-header-left">
                      <div className="icon-circle icon-circle-purple">
                        <BarChart3 size={18} />
                      </div>
                      <h2>Résultats nets par année</h2>
                    </div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient id="colorResultat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                        <XAxis dataKey="annee" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value) => [`${formatAr(value)} Ar`, '']} />
                        <ReferenceLine y={resultatNetMoyen} stroke="#ef4444" strokeDasharray="6 6" />
                        <Area type="monotone" dataKey="Résultat net" stroke="#6366f1" strokeWidth={3} fill="url(#colorResultat)" dot={{ fill: '#6366f1', r: 6 }} activeDot={{ r: 8 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cumul vs Investissement */}
                <div className="card">
                  <div className="card-header-gradient-mini">
                    <div className="card-header-left">
                      <div className="icon-circle icon-circle-green">
                        <TrendingUp size={18} />
                      </div>
                      <h2>Cumul des résultats vs Capital engagé</h2>
                    </div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={graphCumul}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                        <XAxis dataKey="annee" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value) => [`${formatAr(value)} Ar`, '']} />
                        <Legend />
                        <ReferenceLine y={capitalEngage} stroke="#ef4444" strokeDasharray="6 6" label={{ value: 'Capital engagé', fill: '#ef4444', fontSize: 12 }} />
                        <Line type="monotone" dataKey="Cumul" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                        <Line type="monotone" dataKey="Investissement" stroke="#ef4444" strokeWidth={2} strokeDasharray="8 8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ========== ESTIMATION ========== */}
              <div className="card card-estimation">
                <div className="card-header-gradient-mini card-header-gold">
                  <div className="card-header-left">
                    <div className="icon-circle icon-circle-gold">
                      <Target size={18} />
                    </div>
                    <h2>Estimation future</h2>
                  </div>
                  <Badge color="gold">Étape 2</Badge>
                </div>
                <div className="card-body">
                  <div className="estimation-params">
                    <div className="estimation-param-card">
                      <Calendar size={18} />
                      <div className="form-group">
                        <label>Nombre d'années à estimer</label>
                        <select value={anneesEstimation} onChange={(e) => setAnneesEstimation(parseInt(e.target.value))} className="input">
                          <option value={2}>2 ans</option>
                          <option value={3}>3 ans</option>
                          <option value={5}>5 ans</option>
                          <option value={10}>10 ans</option>
                          <option value={15}>15 ans</option>
                          <option value={20}>20 ans</option>
                        </select>
                      </div>
                    </div>
                    <div className="estimation-param-card">
                      <TrendingUp size={18} />
                      <div className="form-group">
                        <label>Taux de croissance annuel estimé</label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={tauxCroissance}
                            onChange={(e) => setTauxCroissance(parseFloat(e.target.value) || 0)}
                            className="input"
                            step="0.5"
                            min="0"
                            max="100"
                          />
                          <span className="input-suffix">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="estimation-result-banner">
                    <div className="estimation-result-item">
                      <span>Nouveau TMR projeté</span>
                      <strong>{nouveauTMR}%</strong>
                    </div>
                    <div className="estimation-divider" />
                    <div className="estimation-result-item">
                      <span>Variation</span>
                      <strong className={tendance === 'hausse' ? 'text-green' : 'text-red'}>
                        {tendance === 'hausse' ? '+' : ''}{differenceTMR}%
                      </strong>
                    </div>
                    <div className="estimation-divider" />
                    <div className="estimation-result-item">
                      <span>Période</span>
                      <strong>{anneeActuelle + duree + 1} – {anneeActuelle + duree + anneesEstimation}</strong>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={estimationData}>
                      <defs>
                        <linearGradient id="colorHaute" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorMoyenne" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                      <XAxis dataKey="annee" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value) => [`${formatAr(value)} Ar`, '']} />
                      <Legend />
                      <Area type="monotone" dataKey="Estimation haute" stroke="#3b82f6" strokeWidth={2} fill="url(#colorHaute)" strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="Estimation moyenne" stroke="#10b981" strokeWidth={3} fill="url(#colorMoyenne)" dot={{ r: 5, fill: '#10b981' }} />
                      <Area type="monotone" dataKey="Estimation basse" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Détail calcul */}
              <div className="card">
                <div className="card-header-gradient-mini">
                  <div className="card-header-left">
                    <div className="icon-circle icon-circle-purple">
                      <Calculator size={18} />
                    </div>
                    <h2>Détail du calcul</h2>
                  </div>
                  <Badge color="purple">Étape 3</Badge>
                </div>
                <div className="card-body">
                  <div className="calcul-steps">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <strong>Capital moyen investi</strong>
                        <p className="step-formula">(Capital engagé − Valeur résiduelle) ÷ 2</p>
                        <div className="step-calculation">
                          <span>({formatAr(capitalEngage)} − {formatAr(valeurResiduelle)}) ÷ 2</span>
                          <ArrowRight size={16} />
                          <strong>{formatAr(capitalMoyenInvesti)} Ar</strong>
                        </div>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <strong>Résultat net moyen après impôt</strong>
                        <p className="step-formula">Somme des résultats ÷ Durée de vie</p>
                        <div className="step-calculation">
                          <span>{formatAr(sommeResultats)} ÷ {duree}</span>
                          <ArrowRight size={16} />
                          <strong>{formatAr(resultatNetMoyen)} Ar</strong>
                        </div>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number step-number-final">3</div>
                      <div className="step-content">
                        <strong>Taux Moyen de Rentabilité</strong>
                        <p className="step-formula">(Résultat net moyen ÷ Capital moyen investi) × 100</p>
                        <div className="step-calculation">
                          <span>({formatAr(resultatNetMoyen)} ÷ {formatAr(capitalMoyenInvesti)}) × 100</span>
                          <ArrowRight size={16} />
                          <strong className="final-result">{tmr}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <Coins size={18} />
            <span>TMR Calculator · Gestion Prévisionnelle</span>
          </div>
          <div className="footer-right">
            <span>Chapitre V : Le Budget des Investissements</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Icône BookOpen (non présente dans lucide-react ? on fait un fallback)
const BookOpen = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

export default App