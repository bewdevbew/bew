# 0- Créer son environnement Hardhat

Initialiser l'environnement Hardhat :
`npx hardhat init`

# 1- Installation des dépendances

```bash
npm install
npx hardhat compile
```

# 2- Tester le contrat

```bash
npx hardhat test
```

# 3- Déployer le contrat

```bash
npx hardhat node # Lancer un noeud local
npx hardhat run scripts/deploy.js --network localhost # Ouvrir un autre terminal
```
