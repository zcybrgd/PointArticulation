export class Sommet {
    constructor(id, label) {
        this.id = id
        this.label = label
        this.visité = false // pour le parcours DFS à chaque fois
        this.discoveryTime = -1; // Le temps de découverte du sommet
        this.low = -1; // Le plus bas point accessible depuis ce sommet

    }
}