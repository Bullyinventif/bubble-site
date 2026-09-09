/**
 * BUBBLE SITE - Gestion du mode maintenance
 * Ce script permet d'activer/désactiver le mode maintenance
 * UNIQUEMENT sur bubble-site.fr (pas sur les liens GitHub)
 */

// ===================================================================
// CONFIGURATION
// ===================================================================

const MAINTENANCE_CONFIG = {
  // Active ou désactive le mode maintenance
  enabled: true,
  
  // Message personnalisé (optionnel)
  message: "Nous effectuons actuellement des mises à jour pour améliorer votre expérience. Le site sera de retour très bientôt !",
  
  // Temps estimé (optionnel)
  eta: "Temps estimé : ~5 minutes",
  
  // Liste des domaines autorisés à afficher la maintenance
  // Si l'utilisateur vient de ces domaines, il voit la page maintenance
  maintenanceDomains: [
    'bubble-site.fr',
    'www.bubble-site.fr'
  ],
  
  // Liste des domaines autorisés à voir le site normal
  // (pour toi, afin de tester même en mode maintenance)
  adminDomains: [
    'github.io'
  ]
};

// ===================================================================
// FONCTIONS PRINCIPALES
// ===================================================================

/**
 * Vérifie si on est sur un domaine qui doit afficher la maintenance
 */
function shouldShowMaintenance() {
  const hostname = window.location.hostname;
  
  // Si on est sur un domaine admin, on n'affiche PAS la maintenance
  for (const domain of MAINTENANCE_CONFIG.adminDomains) {
    if (hostname.includes(domain)) {
      return false;
    }
  }
  
  // Si on est sur un domaine de maintenance, on AFFICHE la maintenance
  for (const domain of MAINTENANCE_CONFIG.maintenanceDomains) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return MAINTENANCE_CONFIG.enabled;
    }
  }
  
  // Par défaut, on n'affiche pas la maintenance (pour les tests locaux, etc.)
  return false;
}

/**
 * Redirige vers la page de maintenance
 */
function redirectToMaintenance() {
  // Sauvegarder le message et l'ETA dans localStorage pour la page maintenance
  if (MAINTENANCE_CONFIG.message) {
    localStorage.setItem('maintenanceMessage', MAINTENANCE_CONFIG.message);
  }
  if (MAINTENANCE_CONFIG.eta) {
    localStorage.setItem('maintenanceEta', MAINTENANCE_CONFIG.eta);
  }
  
  // Rediriger
  window.location.href = 'maintenance.html';
}

/**
 * Vérifie et applique le mode maintenance
 */
function checkMaintenanceMode() {
  if (shouldShowMaintenance()) {
    redirectToMaintenance();
  }
}

// ===================================================================
// FONCTIONS ADMIN (pour activer/désactiver depuis la console)
// ===================================================================

/**
 * Active le mode maintenance
 */
function enableMaintenance(message, eta) {
  MAINTENANCE_CONFIG.enabled = true;
  if (message) MAINTENANCE_CONFIG.message = message;
  if (eta) MAINTENANCE_CONFIG.eta = eta;
  
  // Sauvegarder dans localStorage pour persistance
  localStorage.setItem('maintenanceEnabled', 'true');
  localStorage.setItem('maintenanceMessage', message || MAINTENANCE_CONFIG.message);
  localStorage.setItem('maintenanceEta', eta || MAINTENANCE_CONFIG.eta);
  
  // Rediriger si nécessaire
  if (shouldShowMaintenance()) {
    redirectToMaintenance();
  }
  
  return "✅ Mode maintenance ACTIVÉ";
}

/**
 * Désactive le mode maintenance
 */
function disableMaintenance() {
  MAINTENANCE_CONFIG.enabled = false;
  
  // Supprimer de localStorage
  localStorage.removeItem('maintenanceEnabled');
  localStorage.removeItem('maintenanceMessage');
  localStorage.removeItem('maintenanceEta');
  
  return "✅ Mode maintenance DÉSACTIVÉ";
}

/**
 * Charge la configuration depuis localStorage
 */
function loadConfigFromStorage() {
  const enabled = localStorage.getItem('maintenanceEnabled');
  if (enabled === 'true') {
    MAINTENANCE_CONFIG.enabled = true;
  }
  
  const message = localStorage.getItem('maintenanceMessage');
  if (message) {
    MAINTENANCE_CONFIG.message = message;
  }
  
  const eta = localStorage.getItem('maintenanceEta');
  if (eta) {
    MAINTENANCE_CONFIG.eta = eta;
  }
}

// ===================================================================
// INITIALISATION
// ===================================================================

// Charger la config depuis localStorage
loadConfigFromStorage();

// Vérifier le mode maintenance au chargement
document.addEventListener('DOMContentLoaded', checkMaintenanceMode);

// Exposer les fonctions pour la console (pour toi)
window.enableMaintenance = enableMaintenance;
window.disableMaintenance = disableMaintenance;
window.shouldShowMaintenance = shouldShowMaintenance;

// ===================================================================
// COMMANDES CONSOLE POUR ADMIN
// ===================================================================
// 
// Pour ACTIVER la maintenance (depuis la console du site) :
//   enableMaintenance("Message personnalisé", "Temps estimé : X minutes")
//
// Pour DÉSACTIVER la maintenance (depuis la console du site) :
//   disableMaintenance()
//
// Pour vérifier l'état :
//   shouldShowMaintenance()
//
// Exemple complet :
//   enableMaintenance("Site en maintenance pour mise à jour majeure", "Retour dans 30 minutes")
//
// ===================================================================
