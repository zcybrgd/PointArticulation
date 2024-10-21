
import { Graphe } from "./ds/graphe.js";
import { PointArticulation } from "./purp/PA.js";

const graphe = new Graphe();

graphe.ajouterNoeud(1, "A");
graphe.ajouterNoeud(2, "B");
graphe.ajouterNoeud(3, "C");
graphe.ajouterNoeud(4, "D");
graphe.ajouterNoeud(5, "E");
graphe.ajouterNoeud(6, "F");

graphe.ajouterArete(1, 1, 2); 
graphe.ajouterArete(2, 1, 3); 
graphe.ajouterArete(3, 2, 4); 
graphe.ajouterArete(4, 2, 6); 
graphe.ajouterArete(5, 3, 4); 
graphe.ajouterArete(6, 3, 5);

const articulationPoints = PointArticulation(graphe);
console.log("Articulation Points:", articulationPoints);
