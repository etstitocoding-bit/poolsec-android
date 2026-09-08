# PoolSec Kibombo — compilation APK en ligne

Ce projet est préparé pour être compilé automatiquement avec GitHub Actions, sans Android Studio installé sur le PC.

## Étapes
1. Créer un compte GitHub.
2. Créer un dépôt public ou privé, par exemple `poolsec-android`.
3. Importer tous les fichiers de ce dossier dans le dépôt.
4. Ouvrir l'onglet **Actions**.
5. Sélectionner **Build PoolSec APK**.
6. Cliquer **Run workflow**.
7. Attendre la fin du build.
8. Ouvrir l'exécution terminée et télécharger l'artefact **PoolSec-Kibombo-debug**.
9. Dans l'artefact, récupérer `app-debug.apk` et l'installer sur le smartphone Android.

Le projet cible Android 5.0+ (API 21) et compile avec API 36.
