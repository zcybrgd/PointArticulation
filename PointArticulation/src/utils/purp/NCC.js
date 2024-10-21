import { DFS } from "./DFS.js"
// nombre de composantes connexes 
export const Nbr_Composantes_Connexes = (graphe) => {
 let ncc = 0
 graphe.resetVisites()
 graphe.noeuds.forEach(
    (sommet,sommetId) => {
     if(!sommet.visité){
        DFS(graphe,sommetId)
        ncc++
     }
    }
 )
 return ncc
}
