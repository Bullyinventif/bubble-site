/**
 * BUBBLE SITE - Gestion du mode maintenance via Firebase
 * Ce script permet d'activer/désactiver le mode maintenance
 * UNIQUEMENT sur bubble-site.fr (pas sur les liens GitHub)
 * Contrôlé via Firebase Firestore - seul l'admin peut modifier
 */

// ===================================================================
// CONFIGURATION
// ===================================================================

const MAINTENANCE_CONFIG = {
  // Liste des domaines où la maintenance s'affiche
  maintenanceDomains: [
    'bubble-site.fr',
    'www.bubble-site.fr'
  ],
  
  // Liste des domaines autorisés à voir le site normal (même en maintenance)
  adminDomains: [
    'github.io'
  ],
  
  // Chemin du document Firebase qui contrôle la maintenance
  firebasePath: 'siteSettings/maintenance'
};

// ===================================================================
// ÉTAT DE LA MAINTENANCE (chargé depuis Firebase)
// ===================================================================

let maintenanceEnabled = false;
let maintenanceMessage = "Nous effectuons actuellement des mises à jour pour améliorer votre expérience. Le site sera de retour très bientôt !";
let maintenanceEta = "Temps estimé : ~5 minutes";

// ===================================================================
// FONCTIONS FIREBASE
// ===================================================================

/**
 * Charge la configuration de maintenance depuis Firebase
 */
async function loadMaintenanceConfig() {
  try {
    // Attendre que Firebase soit prêt
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
      // Firebase n'est pas encore chargé, on réessaye dans 500ms
      setTimeout(loadMaintenanceConfig, 500);
      return;
    }
    
    const db = firebase.firestore();
    const docRef = db.collection(MAINTENANCE_CONFIG.firebasePath.split('/')[0])
                      .doc(MAINTENANCE_CONFIG.firebasePath.split('/')[1]);
    
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      maintenanceEnabled = data.enabled || false;
      maintenanceMessage = data.message || maintenanceMessage;
      maintenanceEta = data.eta || maintenanceEta;
      
      console.log('[Maintenance] Config chargée depuis Firebase:', {
        enabled: maintenanceEnabled,
        message: maintenanceMessage,
        eta: maintenanceEta
      });
    } else {
      console.log('[Maintenance] Document Firebase introuvable, utilisation des valeurs par défaut');
    }
    
    // Vérifier et appliquer le mode maintenance
    checkMaintenanceMode();
    
  } catch (error) {
    console.error('[Maintenance] Erreur Firebase:', error);
    // En cas d'erreur, on utilise les valeurs par défaut
    checkMaintenanceMode();
  }
}

// ===================================================================
// FONCTIONS PRINCIPALES
// ===================================================================

/**
 * Vérifie si on est sur un domaine qui doit afficher la maintenance
 */
function shouldShowMaintenance() {
  const hostname = window.location.hostname;
  
  // Si on est sur un domaine admin (github.io), on n'affiche PAS la maintenance
  for (const domain of MAINTENANCE_CONFIG.adminDomains) {
    if (hostname.includes(domain)) {
      return false;
    }
  }
  
  // Si on est sur un domaine de maintenance, on vérifie si c'est activé
  for (const domain of MAINTENANCE_CONFIG.maintenanceDomains) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return maintenanceEnabled;
    }
  }
  
  // Par défaut, on n'affiche pas la maintenance
  return false;
}

/**
 * Redirige vers la page de maintenance
 */
function redirectToMaintenance() {
  // Sauvegarder le message et l'ETA dans sessionStorage pour la page maintenance
  sessionStorage.setItem('maintenanceMessage', maintenanceMessage);
  sessionStorage.setItem('maintenanceEta', maintenanceEta);
  
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
// INITIALISATION
// ===================================================================

// Charger la config Firebase au chargement
document.addEventListener('DOMContentLoaded', () => {
  // Charger depuis Firebase
  loadMaintenanceConfig();
  
  // Vérifier régulièrement (au cas où Firebase met du temps à répondre)
  setTimeout(() => {
    if (!maintenanceEnabled && typeof firebase !== 'undefined' && firebase.apps.length) {
      loadMaintenanceConfig();
    }
  }, 2000);
});

// ===================================================================
// UTILITAIRES (pour debug)
// ===================================================================

// Exposer l'état pour vérification (lecture seule)
window.getMaintenanceStatus = function() {
  return {
    enabled: maintenanceEnabled,
    message: maintenanceMessage,
    eta: maintenanceEta,
    shouldShow: shouldShowMaintenance()
  };
};

// ===================================================================
// INSTRUCTIONS POUR L'ADMIN
// ===================================================================
//
// Pour activer/désactiver la maintenance, l'admin doit modifier
// le document Firestore à l'adresse :
//   siteSettings/maintenance
//
// Structure du document :
// {
//   enabled: true/false,      // Active ou désactive la maintenance
//   message: "Message...",     // Message à afficher (optionnel)
//   eta: "Temps estimé..."    // Temps estimé (optionnel)
// }
//
// Exemple via Firebase Console :
// 1. Aller dans Firestore Database
// 2. Créer la collection "siteSettings"
// 3. Créer le document "maintenance"
// 4. Ajouter les champs : enabled (booléen), message (string), eta (string)
//
// Ou via code (dans la console Firebase) :
// firebase.firestore().collection('siteSettings').doc('maintenance').set({
//   enabled: true,
//   message: "Site en maintenance",
//   eta: "Retour dans 30 min"
// });
//
// ===================================================================
