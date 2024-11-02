import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Graphe } from './src/utils/ds/graphe.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// initialiser le graphe
let graph = new Graphe(); 

// ajouter un noeud
app.post('/add-node', (req, res) => {
    const node = req.body.node;
    graph.ajouterNoeud(node.id, node.data.label); 
    res.sendStatus(200);
});


// ajouter arete
app.post('/add-edge', (req, res) => {
    const { source, target } = req.body.edge; // les 2 extrémités de l'arete
    try {
        if (!graph.noeuds.has(source) || !graph.noeuds.has(target)) {
            return res.status(400).send('One or both nodes do not exist.');
        }
        const edgeId = `e${source}-${target}`;
        graph.ajouterArete(edgeId, source, target);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// supprimer noeud
app.delete('/remove-node/:id', (req, res) => {
    const nodeId = req.params.id;
    console.log(`Received request to delete node with ID: ${nodeId}`);

    try {
        graph.supprimerNoeud(nodeId);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// supprimer arete
app.delete('/remove-edge/:id', (req, res) => {
    const edgeId = req.params.id;
    console.log(`Received request to delete edge with ID: ${edgeId}`);

    try {
        graph.supprimerArete(edgeId); 
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// modifier sommet
app.post('/modify-node', (req, res) => {
    const { nodeId, newLabel } = req.body;
    try {
        graph.modifierNoeud(nodeId, newLabel);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// récuperer les points d'articulation
app.get('/articulation-points', (req, res) => {
    const articulationPoints = graph.trouverPointsArticulation();
    console.log('Articulation Points:', articulationPoints); 
    res.json(Array.from(articulationPoints)); 
});

// start the express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});