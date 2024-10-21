export const DFS = (graphe, sommetId) => {
 const sommet = graphe.noeuds.get(sommetId)
 if(!sommet) return 
 sommet.visité = true
 const voisins = graphe.trouverVoisins(sommetId)
 voisins.forEach(vId => {
    const voisin = graphe.noeuds.get(vId);
        if (voisin && !voisin.visité) {
            DFS(graphe, vId);  
        }
 })
}
