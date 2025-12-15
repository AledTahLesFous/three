#!/bin/bash
# Script pour installer et lancer les tests

echo "🚀 Space Shooter 3D - Test Setup"
echo "=================================="
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  npm install
  echo "✅ Dépendances installées"
else
  echo "✅ Dépendances déjà présentes"
fi

echo ""
echo "🧪 Lancement des tests..."
echo ""

npm test
