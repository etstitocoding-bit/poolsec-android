# PoolSec Kibombo — Android

Projet Android Studio qui enveloppe l'application Web hébergée `https://poolseckibombo.site.je/`.

## Compatibilité
- minSdk 21 (Android 5.0+)
- targetSdk 36 (Android 16), conforme aux exigences Google Play en vigueur en août 2026.
- Jetpack WebKit 1.14.0 pour améliorer la compatibilité WebView.

## Fonctionnement
- En ligne : charge le site hébergé.
- Sans réseau : ouvre la page offline embarquée dans l'APK.
- Quand le réseau revient : recharge le site hébergé afin de permettre la synchronisation.

## Générer l'APK
1. Installer Android Studio.
2. Ouvrir ce dossier comme projet.
3. Laisser Gradle télécharger les dépendances.
4. Build > Generate App Bundles or APKs > Generate APKs.

### Important
L'emballage WebView ne transforme pas automatiquement PHP/MySQL en application hors ligne. Le site doit continuer à contenir la logique offline-first/IndexedDB/API de synchronisation. La page offline fournie ici est embarquée dans l'APK pour permettre le démarrage sans réseau.
