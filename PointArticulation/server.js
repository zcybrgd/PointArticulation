import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Graphe } from "./src/utils/ds/graphe";

const app = express();
const port = 3000; // backend port

app.use(cors());
app.use(bodyParser.json());

const graph = new Graphe(); //  a new graph instance

app.post("/add-node", (req, res) => {
    const { node } = req.body;
    graph.ajouterNoeud(node.id, node.data.label);
    res.status(200).send({ message: "Node added successfully" });
});

app.post("/add-edge", (req, res) => {
    const { edge } = req.body;
    graph.ajouterArete(edge.id, edge.source, edge.target);
    res.status(200).send({ message: "Edge added successfully" });
});

app.delete("/remove-node/:id", (req, res) => {
    const nodeId = req.params.id;
    graph.supprimerNoeud(nodeId);
    res.status(200).send({ message: "Node removed successfully" });
});

app.delete("/remove-edge/:id", (req, res) => {
    const edgeId = req.params.id;
    graph.supprimerArete(edgeId);
    res.status(200).send({ message: "Edge removed successfully" });
});

app.post("/modify-node", (req, res) => {
    const { nodeId, newLabel } = req.body;
    const node = graph.noeuds.get(nodeId);
    if (node) {
        node.label = newLabel;
        res.status(200).send({ message: "Node modified successfully" });
    } else {
        res.status(404).send({ message: "Node not found" });
    }
});

app.post("/articulation-points", (req, res) => {
    const { nodes, edges } = req.body;
    graph.noeuds.clear();
    graph.aretes.clear();

    nodes.forEach(node => graph.ajouterNoeud(node.id, node.data.label));
    edges.forEach(edge => graph.ajouterArete(edge.id, edge.source, edge.target));

    const articulationPoints = graph.trouverPointsArticulation();
    res.status(200).send({ articulationPoints: Array.from(articulationPoints) });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});