import { Arete } from "./arete.js"
import { Sommet } from "./sommet.js"

// le graphe est non orientée
export class Graphe {
    constructor(){
        this.noeuds = new Map()
        this.aretes = new Set() // pour qu'il y est pas une duplication ou quoi que ce soit
    }

    ajouterNoeud(id,name){
        if(!this.noeuds.has(id)){
            this.noeuds.set(id, new Sommet(id,name))
        }
    }

    supprimerNoeud(id){
        this.noeuds.delete(id)
        this.aretes.forEach(e => {
            if(e.nodeEx1 == id || e.nodeEx2 == id){
                this.aretes.delete(e)
            }
        })
    }

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
    
    // va trouver les noeuds adjacents d'un noeud dans le graphe
    // to be optimized later if icould (i want it to map directly le noeud and not loop over toutes les aretes du graphe)
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

    // remarquer les noeuds comme non visité pour des prochains parcours indépendants
    resetVisites() {
        this.noeuds.forEach(noeud => {
            noeud.visité = false;
        });
    }
}