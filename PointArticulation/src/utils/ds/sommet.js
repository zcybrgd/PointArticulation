export class Sommet {
    constructor(id, label) {
        this.id = id
        this.label = label
        this.visité = false // pour le parcours DFS à chaque fois
        this.discoveryTime = -1; //  l'ordre dans lequel le noeud a été visité pour la première fois par la DFS
        this.low = -1; // Le temps de découverte de plus bas point accessible depuis ce sommet
    }
}