import { Nbr_Composantes_Connexes } from "./NCC.js"
export const PointArticulation = (graphe) => {
 const nbr_cc = Nbr_Composantes_Connexes(graphe)
 let points_articulations = [] // array ou on va stocker les points d'articulation trouvé dans le graphe

 graphe.noeuds.forEach((_, nodeId)=> {
     const grapheSansU = graphe.retirerSommet(nodeId)
     const nbr_cc_su = Nbr_Composantes_Connexes(grapheSansU)
     if(nbr_cc_su>nbr_cc){
        points_articulations.push(nodeId)
     }
 }
 )

 return points_articulations
}


