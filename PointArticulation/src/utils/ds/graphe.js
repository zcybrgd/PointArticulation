import { Arete } from "./arete.js"
import { Sommet } from "./sommet.js"
// on a implémnté l'algorithme de tarjan
// le graphe est non orientée
export class Graphe {
    constructor(){
        this.noeuds = new Map()
        this.aretes = new Set() // pour qu'il y est pas une duplication ou quoi que ce soit
        this.time = 0;            // compteur global pour les temps de découverte
    }
    // validé
    ajouterNoeud(id,name){
        if(!this.noeuds.has(id)){
            this.noeuds.set(id, new Sommet(id,name))
        }
    }
    
    supprimerNoeud(id){
        this.noeuds.delete(id)
        this.aretes.forEach(e => {
            if(e.nodeEx1 == id || e.nodeEx2 == id){
                this.aretes.supprimerArete(e)
            }
        })
    }
    // validé
    ajouterArete(id,nodeEx1id,nodeEx2id){
        if(this.noeuds.has(nodeEx1id) && this.noeuds.has(nodeEx2id)){
            const nouvelleArete = new Arete(id, nodeEx1id, nodeEx2id)
            this.aretes.add(nouvelleArete)
        }
    }

    supprimerArete(id){
        this.aretes.forEach(e => {
            if(e.id==id){
                this.aretes.delete(e)
            }
        });
    }
    
    // validé
    trouverVoisins(noeudId) {
        const voisins = [];
        this.aretes.forEach((e) => {
            if (e.nodeEx1 == noeudId) {
                voisins.push(e.nodeEx2);
            } else if (e.nodeEx2 == noeudId) {
                voisins.push(e.nodeEx1);
            }
        });
        return voisins; 
    }
    
    
    // on va ensuite l'utiliser pendant la suppression d'un sommer
    copier(){
      const copieGraphe = new Graphe()
      this.noeuds.forEach((id,n) => {
          copieGraphe.ajouterNoeud(id, new Sommet(id,n.label))
      } )
      this.aretes.forEach((e) => {
        copieGraphe.ajouterArete(new Arete(e.id,e.nodeEx1,e.nodeEx2))
      })
      return copieGraphe
    }

    retirerSommet(idNoeud){
        const grapheTemp = this.copier()
        grapheTemp.supprimerNoeud(idNoeud)
        return grapheTemp
    }
    // validé
    // remarquer les noeuds comme non visité pour des prochains parcours indépendants
    resetVisites() {
        this.noeuds.forEach(noeud => {
            noeud.visité = false;
            noeud.discoveryTime = -1;
            noeud.low = -1;
        });
    }

    // trouver les points d'articulation du graphe
    trouverPointsArticulation() {
        const articulationPoints = new Set();
        this.resetVisites();
        let parent = new Map();  // Garde la trace des parents des sommets dans DFS

        // DFS sur chaque sommet non visité
        this.noeuds.forEach((sommet, sommetId) => {
            if (!sommet.visité) {
                this.DFS(sommetId, parent, articulationPoints);
            }
        });
        return articulationPoints;
    }
    // parcours DFS du graphe
    DFS(sommetId, parent, articulationPoints) {
        const sommet = this.noeuds.get(sommetId);
        sommet.visité = true;

        // Initialiser le temps de découverte et le low-link value
        sommet.discoveryTime = sommet.low = this.time++;
        let children = 0;  // Compte le nombre d'enfants dans l'arbre DFS

        const voisins = this.trouverVoisins(sommetId);
        voisins.forEach((vId) => {
            const voisin = this.noeuds.get(vId);

            // Si le voisin n'a pas encore été visité, explorer en DFS
            if (!voisin.visité) {
                children++;
                parent.set(vId, sommetId);  // Marquer l'arbre DFS
                this.DFS(vId, parent, articulationPoints);

                // Vérifier si le sous-arbre via v a un lien vers un ancêtre de sommet
                sommet.low = Math.min(sommet.low, voisin.low);

                // (1) Si le sommet est racine de DFS et a deux enfants ou plus
                if (!parent.has(sommetId) && children > 1) {
                    articulationPoints.add(sommetId);
                }

                // (2) Si sommet n'est pas la racine et le low-link de v >= discoveryTime de sommet
                if (parent.has(sommetId) && voisin.low >= sommet.discoveryTime) {
                    articulationPoints.add(sommetId);
                }

            } else if (voisin.id !== parent.get(sommetId)) {
                // Mettre à jour low-link value de sommet pour les arêtes de retour
                sommet.low = Math.min(sommet.low, voisin.discoveryTime);
            }
        });
    }
}