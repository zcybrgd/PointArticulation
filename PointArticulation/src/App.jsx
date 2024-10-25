import React, { useState } from 'react';
import ReactFlow, { addEdge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import AjouterSommet from './components/sommets/AjouterSommet';
import AjouterArete from './components/aretes/ajouterArete';
import SupprimerSommet from './components/sommets/supprimerSommet';
import SupprimerArete from './components/aretes/supprimerArete';
import ModifierSommet from './components/sommets/modifierSommet';

const App = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [showInput, setShowInput] = useState({ sommet: false, arete: false, supprimerSommet: false, supprimerArete: false, modifierSommet: false });
    
    // Add a new node
    const ajouterSommet = (label) => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            data: { label },
            position: { x: Math.random() * 500, y: Math.random() * 500 }
        };
        setNodes((nds) => [...nds, newNode]);
        toggleInputs('sommet');
    };

    // Add a new edge
    const ajouterArete = (nodeEx1, nodeEx2) => {
        const newEdge = { id: `e${nodeEx1}-${nodeEx2}`, source: nodeEx1, target: nodeEx2 };
        setEdges((eds) => [...eds, newEdge]);
        toggleInputs('arete');
    };

    // Remove a node
    const supprimerSommet = (nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        toggleInputs('supprimerSommet');
    };

    // Remove an edge
    const supprimerArete = (edgeId) => {
        setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
        toggleInputs('supprimerArete');
    };

    // Modify a node label
    const modifierSommet = (nodeId, newLabel) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node))
        );
        toggleInputs('modifierSommet');
    };

    const onConnect = (params) => {
        setEdges((eds) => addEdge(params, eds));
    };

    // Toggle input display based on the clicked option
    const toggleInputs = (type) => {
        setShowInput((prev) => {
            const newState = { sommet: false, arete: false, supprimerSommet: false, supprimerArete: false, modifierSommet: false };
            newState[type] = !prev[type]; // Toggle the selected type
            return newState;
        });
    };

    // Handler for "Voir les points d'articulation"
    const handleArticulationPointsClick = () => {
        // Logic to display articulation points
        alert("Displaying articulation points...");
    };

    return (
        <div className="app bg-cyan-900 flex flex-row h-screen w-screen pr-10">
            <div className='flex flex-col w-1/6 bg-cyan-950 justify-start place-items-center'>
                <ul className='space-y-4 text-center w-full mt-[40%]'>
                    <li onClick={() => toggleInputs('sommet')} className='hover:bg-cyan-900 hover:text-white p-2 cursor-pointer'>Ajouter Noeud</li>
                    <li onClick={() => toggleInputs('arete')} className='hover:bg-cyan-900 hover:text-white p-2 cursor-pointer'>Ajouter Arete</li>
                    <li onClick={() => toggleInputs('supprimerSommet')} className='hover:bg-cyan-900 hover:text-white p-2 cursor-pointer'>Supprimer Noeud</li>
                    <li onClick={() => toggleInputs('supprimerArete')} className='hover:bg-cyan-900 hover:text-white p-2 cursor-pointer'>Supprimer Arete</li>
                    <li onClick={() => toggleInputs('modifierSommet')} className='hover:bg-cyan-900 hover:text-white p-2 cursor-pointer mb-12'>Modifier Noeud</li>
                    
                    {showInput.sommet && <AjouterSommet ajouterSommet={ajouterSommet} />}
                    {showInput.arete && <AjouterArete ajouterArete={ajouterArete} nodes={nodes} />}
                    {showInput.supprimerSommet && <SupprimerSommet supprimerSommet={supprimerSommet} nodes={nodes} />}
                    {showInput.supprimerArete && <SupprimerArete supprimerArete={supprimerArete} edges={edges} />}
                    {showInput.modifierSommet && <ModifierSommet modifierSommet={modifierSommet} nodes={nodes} />}
                </ul>
            </div>

            <div className='flex-grow flex flex-col justify-center pl-10'>
                <h1 className='text-5xl inline text-center font-medium mb-10'>Graph Visualization</h1>
                <div style={{ height: '500px', border: '1px solid black' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onConnect={onConnect}
                        nodesDraggable={true} 
                        fitView
                        style={{ background: '#D3D3D3' }}
                    >
                        <Background variant="dots" gap={12} size={1} />
                        <Controls />
                    </ReactFlow>
                </div>
                <button
                    onClick={handleArticulationPointsClick}
                    className="mt-4 p-2 bg-blue-500 text-white rounded-none w-1/2 ml-[25%]"
                >
                    Voir les points d'articulation
                </button>
            </div>
        </div>
    );
};

export default App;
