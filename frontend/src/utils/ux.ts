import { RANDOM_PSEUDO } from "@/constants/ux";
import CryptoJS from "crypto-js";

/**
 *
 * Génère un pseudo aléatoire à partir d'une address ETH
 * Une liste de noms et d'adjectifs est utilisée pour générer le pseudo
 */

export const getRandomPseudo = (address: `0x${string}`) => {
  const { adjectives, nouns } = RANDOM_PSEUDO;

  const hash = CryptoJS.SHA256(address).toString();
  // Convertir le hash en grands entiers pour indexer les listes
  const adjIndex = parseInt(hash.substring(0, 8), 16) % adjectives.length;
  const nounIndex = parseInt(hash.substring(8, 16), 16) % nouns.length;
  const number = parseInt(hash.substring(16, 24), 16) % 100;

  return `${adjectives[adjIndex]}-${nouns[nounIndex]}${number}`;
};
