import { Arete } from "./arete.js";
import { Sommet } from "./sommet.js";

export class Graphe {
    constructor() {
        this.noeuds = new Map();
        this.aretes = new Set(); // pour que les aretes ne soient jamais dupliquées
        this.time = 0; // à une relation avec l'implémentation de tarjan
    }

    ajouterNoeud(id, name) {
        if (!this.noeuds.has(id)) {
            this.noeuds.set(id, new Sommet(id, name));
        }
    }

    supprimerNoeud(id) {
        this.noeuds.delete(id);
        this.aretes.forEach(e => {
            if (e.nodeEx1 === id || e.nodeEx2 === id) {
                this.supprimerArete(e.id);
            }
        });
    }

    ajouterArete(id, nodeEx1id, nodeEx2id) {
        if (this.noeuds.has(nodeEx1id) && this.noeuds.has(nodeEx2id)) {
            const nouvelleArete = new Arete(id, nodeEx1id, nodeEx2id);
            this.aretes.add(nouvelleArete);
            return nouvelleArete; 
        }
        throw new Error('One or both nodes do not exist.');
    }

    supprimerArete(id) {
        for (const e of this.aretes) {
            if (e.id === id) {
                this.aretes.delete(e);
                return;
            }
        }
        throw new Error('Edge does not exist.');
    }

    modifierNoeud(id, newLabel) {
        const sommet = this.noeuds.get(id);
        if (sommet) {
            sommet.label = newLabel; 
        } else {
            throw new Error('Node does not exist.');
        }
    }

    trouverVoisins(noeudId) {
        const voisins = [];
        this.aretes.forEach((e) => {
            if (e.nodeEx1 === noeudId) {
                voisins.push(e.nodeEx2);
            } else if (e.nodeEx2 === noeudId) {
                voisins.push(e.nodeEx1);
            }
        });
        return voisins;
    }

    copier() {
        const copieGraphe = new Graphe();
        this.noeuds.forEach((n, id) => {
            copieGraphe.ajouterNoeud(id, n.label);
        });
        this.aretes.forEach((e) => {
            copieGraphe.ajouterArete(e.id, e.nodeEx1, e.nodeEx2);
        });
        return copieGraphe;
    }

    retirerSommet(idNoeud) {
        const grapheTemp = this.copier();
        grapheTemp.supprimerNoeud(idNoeud);
        return grapheTemp;
    }

    resetVisites() {
        this.noeuds.forEach(noeud => {
            noeud.visité = false;
            noeud.discoveryTime = -1;
            noeud.low = -1;
        });
    }

    trouverPointsArticulation() {
        const articulationPoints = new Set();
        this.resetVisites();
        let parent = new Map();

        this.noeuds.forEach((sommet, sommetId) => {
            if (!sommet.visité) {
                this.DFS(sommetId, parent, articulationPoints);
            }
        });
        return articulationPoints;
    }

    DFS(sommetId, parent, articulationPoints) {
        const sommet = this.noeuds.get(sommetId);
        sommet.visité = true;
        sommet.discoveryTime = sommet.low = this.time++;
        let children = 0;
        const voisins = this.trouverVoisins(sommetId);

        voisins.forEach((vId) => {
            const voisin = this.noeuds.get(vId);
            if (!voisin.visité) {
                children++;
                parent.set(vId, sommetId);
                this.DFS(vId, parent, articulationPoints);
                sommet.low = Math.min(sommet.low, voisin.low);
                if (!parent.has(sommetId) && children > 1) {
                    articulationPoints.add(sommetId);
                }
                if (parent.has(sommetId) && voisin.low >= sommet.discoveryTime) {
                    articulationPoints.add(sommetId);
                }
            } else if (voisin.id !== parent.get(sommetId)) {
                sommet.low = Math.min(sommet.low, voisin.discoveryTime);
            }
        });
    }

    // Pour convertir en json for frontend sending and handling
    toJSON() {
        return {
            nodes: Array.from(this.noeuds.values()).map((node) => ({
                id: node.id,
                label: node.label,
            })),
            edges: Array.from(this.aretes).map((edge) => ({
                id: edge.id,
                source: edge.nodeEx1,
                target: edge.nodeEx2,
            })),
        };
    }
}