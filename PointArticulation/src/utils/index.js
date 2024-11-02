// this code is just for testing the functionnalities before intergrating
import { Graphe } from "./ds/graphe.js";


function testArticulationPoints() {
    const graphe = new Graphe();

    graphe.ajouterNoeud(1, "A");
    graphe.ajouterNoeud(2, "B");
    graphe.ajouterNoeud(3, "C");
    graphe.ajouterNoeud(4, "D");
    graphe.ajouterNoeud(5, "E");
    graphe.ajouterNoeud(6, "F");

 
    graphe.ajouterArete(1, 1, 2);  // A-B
    graphe.ajouterArete(2, 1, 3);  // A-C
    graphe.ajouterArete(3, 2, 6);  // B-F
    graphe.ajouterArete(4, 2, 4);  // B-D
    graphe.ajouterArete(5, 3, 4);  // C-D
    graphe.ajouterArete(6, 3, 5);  // C-E
    graphe.ajouterArete(7,4,5);
 
    const articulationPoints = graphe.trouverPointsArticulation();
    console.log("Articulation Points: ", [...articulationPoints].join(", "));
}


testArticulationPoints();
