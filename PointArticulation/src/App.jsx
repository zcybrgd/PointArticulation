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
import AjouterArete from './components/aretes/AjouterArete';
import SupprimerSommet from './components/sommets/SupprimerSommet';
import SupprimerArete from './components/aretes/SupprimerArete';
import ModifierSommet from './components/sommets/ModifierSommet';
import axios from 'axios';

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

    const [articulationPoints, setArticulationPoints] = useState([]); // State to store articulation points

    const [nextNodeId, setNextNodeId] = useState(1); // Initialize a state for the next node ID

    // Function to add a node
    const ajouterSommet = async (label) => {
        const newNode = {
            id: nextNodeId.toString(), // Use the current value of nextNodeId
            data: {
                label: <span style={{ color: 'black' }}>{label}</span>,
                handles: [],
            },
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            draggable: true,
        };

        // Call backend to add node
        await axios.post('http://localhost:3000/add-node', { node: newNode });

        setNodes((nds) => {
            const updatedNodes = [...nds, newNode];
            console.log('Node added:', newNode); // Log added node
            return updatedNodes;
        });

        setNextNodeId((prevId) => prevId + 1); // Increment the node ID for the next node
        toggleInputs('sommet');
    };


    // Function to add an edge
    const ajouterArete = async (nodeEx1, nodeEx2) => {
        const newEdge = { id: `e${nodeEx1}-${nodeEx2}`, source: nodeEx1, target: nodeEx2 };

        // Call backend to add edge
        await axios.post('http://localhost:3000/add-edge', { edge: newEdge });

        setEdges((eds) => {
            const updatedEdges = [...eds, newEdge];
            console.log('Edge added:', newEdge); // Log added edge
            return updatedEdges;
        });
        updateNodeHandles(nodeEx1, nodeEx2);
        toggleInputs('arete');
    };

    // Function to update handles of nodes
    const updateNodeHandles = (nodeEx1, nodeEx2) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeEx1) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            handles: [
                                ...(node.data.handles || []),
                                { type: 'source', position: 'bottom' },
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
                                { type: 'target', position: 'top' },
                            ],
                        },
                    };
                }
                return node;
            })
        );
    };

    const supprimerSommet = async (nodeId) => {
        try {
            await axios.delete(`http://localhost:3000/remove-node/${nodeId}`);
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
            console.log('Node removed:', nodeId);
            toggleInputs('supprimerSommet');
        } catch (error) {
            console.error('Error removing node:', error);
        }
    };

     // Function to remove an edge
     const supprimerArete = async (edgeId) => {
        try {
            await axios.delete(`http://localhost:3000/remove-edge/${edgeId}`);
            setEdges((eds) => {
                const updatedEdges = eds.filter((edge) => edge.id !== edgeId);
                console.log('Edge removed:', edgeId); // Log removed edge
                return updatedEdges;
            });
            toggleInputs('supprimerArete');
        } catch (error) {
            console.error('Error removing edge:', error);
        }
    };
        // Function to modify a node
        const modifierSommet = async (nodeId, newLabel) => {
            try {
                await axios.post('http://localhost:3000/modify-node', { nodeId, newLabel });
    
                setNodes((nds) =>
                    nds.map((node) =>
                        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
                    )
                );
    
                console.log('Node modified:', nodeId); // Log modified node
                toggleInputs('modifierSommet');
            } catch (error) {
                console.error('Error modifying node:', error);
            }
        };
        const voirPointsArticulation = async () => {
            try {
                const response = await axios.get('http://localhost:3000/articulation-points');
                const points = response.data;
                setArticulationPoints(points); // Store articulation points in state
        
                // Update nodes to reflect articulation points
                setNodes((nds) =>
                    nds.map((node) => {
                        // Check if the node is an articulation point
                        if (points.includes(node.id)) {
                            return {
                                ...node,
                                style: {
                                    backgroundColor: '#addfad',
                                    ...node.style, 
                                },
                            };
                        }
                        return {
                            ...node,
                            
                        }; // Keep existing nodes unchanged
                    })
                );
        
                console.log('Articulation Points:', points);
            } catch (error) {
                console.error('Error fetching articulation points:', error);
            }
        };
        

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
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
            newState[type] = !prev[type];
            return newState;
        });
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
                    {showInput.modifierSommet && (
    <ModifierSommet
        nodes={nodes}
        onModifyNode={modifierSommet} // Ensure this function is passed
    />
)}                </ul>
            </div>

            <div className='flex-grow flex flex-col justify-center pl-10'>
                <h1 className='text-5xl inline text-center font-medium mb-10'>Graph Visualization</h1>
                <div style={{ height: '500px', border: '1px solid black', color: 'black' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onConnect={onConnect}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodesDraggable={true}
                        fitView
                        style={{ background: '#D3D3D3' }}
                    >
                        <Background variant="dots" gap={12} size={1} />
                        <Controls />
                    </ReactFlow>
                </div>
                  <button
                    onClick={voirPointsArticulation} // Call the function when clicked
                    className="mt-4 p-2 bg-blue-500 text-white rounded-none w-1/2 ml-[25%]"
                >
                    Voir les points d'articulation
                </button>
            </div>
        </div>
    );
};

export default App;
