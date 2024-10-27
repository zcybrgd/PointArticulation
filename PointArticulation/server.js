import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Graphe } from './src/utils/ds/graphe.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let graph = new Graphe(); // Initialize the graph here

// Endpoint to add a node
app.post('/add-node', (req, res) => {
    const node = req.body.node;
    graph.ajouterNoeud(node.id, node.data.label); // Add to the graph logic
    res.sendStatus(200);
});


// Endpoint to add an edge
app.post('/add-edge', (req, res) => {
    const { source, target } = req.body.edge; // Destructure source and target
    try {
        // Log to check if nodes exist
        console.log(`Source: ${source}, Target: ${target}`);

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


// Endpoint to remove a node
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

// Endpoint to remove an edge
app.delete('/remove-edge/:id', (req, res) => {
    const edgeId = req.params.id;
    console.log(`Received request to delete edge with ID: ${edgeId}`);

    try {
        graph.supprimerArete(edgeId); // Call the function that removes the edge
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint to modify a node
app.post('/modify-node', (req, res) => {
    const { nodeId, newLabel } = req.body;
    try {
        graph.modifierNoeud(nodeId, newLabel);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// Endpoint to get articulation points
app.get('/articulation-points', (req, res) => {
    const articulationPoints = graph.trouverPointsArticulation();
    console.log('Articulation Points:', articulationPoints); // Log points to the console
    res.json(Array.from(articulationPoints)); // Send points as JSON response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});