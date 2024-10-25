import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AjouterSommet from './components/sommets/AjouterSommet';
import AjouterArete from './components/aretes/ajouterArete';
import SupprimerSommet from './components/sommets/supprimerSommet';
import SupprimerArete from './components/aretes/supprimerArete';
import ModifierSommet from './components/sommets/modifierSommet';
import CustomNode from './components/sommets/CustomNode'; // Import the custom node component

const App = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [showInput, setShowInput] = useState({
        sommet: false,
        arete: false,
        supprimerSommet: false,
        supprimerArete: false,
        modifierSommet: false,
    });

    // Add a new node
    const ajouterSommet = (label) => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            data: { 
                label: <span style={{ color: 'black' }}>{label}</span>, 
                handles: [] // Initialize with no handles
            },
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            draggable: true,
        };
        setNodes((nds) => [...nds, newNode]);
        toggleInputs('sommet');
    };
    

    // Add a new edge
    const ajouterArete = (nodeEx1, nodeEx2) => {
        const newEdge = { id: `e${nodeEx1}-${nodeEx2}`, source: nodeEx1, target: nodeEx2 };
        setEdges((eds) => [...eds, newEdge]);
        
        // Update the handles for both connected nodes
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeEx1) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            handles: [
                                ...(node.data.handles || []),
                                { type: 'source', position: 'bottom' }, // Add a new source handle
                            ],
                        },
                    };
                }
                if (node.id === nodeEx2) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            handles: [
                                ...(node.data.handles || []),
                                { type: 'target', position: 'top' }, // Add a new target handle
                            ],
                        },
                    };
                }
                return node;
            })
        );

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
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label: <span style={{ color: 'black' }}>{newLabel}</span> } } : node))
        );
        toggleInputs('modifierSommet');
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
        },
        [setEdges]
    );

    // Toggle input display based on the clicked option
    const toggleInputs = (type) => {
        setShowInput((prev) => {
            const newState = {
                sommet: false,
                arete: false,
                supprimerSommet: false,
                supprimerArete: false,
                modifierSommet: false,
            };
            newState[type] = !prev[type]; // Toggle the selected type
            return newState;
        });
    };

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
                <div style={{ height: '500px', border: '1px solid black', color:'black' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onConnect={onConnect}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodesDraggable={true} // Ensure nodes are draggable
                        fitView
                        nodeTypes={{ custom: CustomNode }} // Register the custom node type
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
``
