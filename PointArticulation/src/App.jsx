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
import SupprimerArete from './components/aretes/SupprimerArete';
import ModifierSommet from './components/sommets/modifierSommet';
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

    const [articulationPoints, setArticulationPoints] = useState([]); 

    const [nextNodeId, setNextNodeId] = useState(1); 

    const ajouterSommet = async (label) => {
        const newNode = {
            id: nextNodeId.toString(),
            data: {
                label: <span style={{ color: 'black' }}>{label}</span>,
                handles: [],
            },
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            draggable: true,
        };


        await axios.post('http://localhost:3000/add-node', { node: newNode });

        setNodes((nds) => {
            const updatedNodes = [...nds, newNode];
            console.log('Node added:', newNode); 
            return updatedNodes;
        });

        setNextNodeId((prevId) => prevId + 1);
        toggleInputs('sommet');
    };

    const ajouterArete = async (nodeEx1, nodeEx2) => {
        const newEdge = { id: `e${nodeEx1}-${nodeEx2}`, source: nodeEx1, target: nodeEx2 };

        await axios.post('http://localhost:3000/add-edge', { edge: newEdge });

        setEdges((eds) => {
            const updatedEdges = [...eds, newEdge];
            console.log('Edge added:', newEdge); 
            return updatedEdges;
        });
        updateNodeHandles(nodeEx1, nodeEx2);
        toggleInputs('arete');
    };

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

     const supprimerArete = async (edgeId) => {
        try {
            await axios.delete(`http://localhost:3000/remove-edge/${edgeId}`);
            setEdges((eds) => {
                const updatedEdges = eds.filter((edge) => edge.id !== edgeId);
                console.log('Edge removed:', edgeId);
                return updatedEdges;
            });
            toggleInputs('supprimerArete');
        } catch (error) {
            console.error('Error removing edge:', error);
        }
    };
        const modifierSommet = async (nodeId, newLabel) => {
            try {
                await axios.post('http://localhost:3000/modify-node', { nodeId, newLabel });
    
                setNodes((nds) =>
                    nds.map((node) =>
                        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
                    )
                );
    
                console.log('Node modified:', nodeId);
                toggleInputs('modifierSommet');
            } catch (error) {
                console.error('Error modifying node:', error);
            }
        };
        const voirPointsArticulation = async () => {
            try {
                
                const currentArticulationPoints = [...articulationPoints];
                const response = await axios.get('http://localhost:3000/articulation-points');
                const newPoints = response.data;
        
                setArticulationPoints(newPoints);
                setNodes((nds) =>
                    nds.map((node) => {
                      
                        const wasArticulationPoint = currentArticulationPoints.includes(node.id);
                        const isArticulationPoint = newPoints.includes(node.id);
                        let backgroundColor;
                        if (isArticulationPoint) {
                            backgroundColor = '#addfad'; 
                        } else if (wasArticulationPoint) {
                            backgroundColor = 'white'; 
                        } else {
                            backgroundColor = node.style?.backgroundColor || 'white'; 
                        }
        
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                backgroundColor, 
                            },
                        };
                    })
                );
        
                console.log('Previous Articulation Points:', currentArticulationPoints);
                console.log('New Articulation Points:', newPoints);
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
        <div className="app bg-gray-200 flex flex-row h-screen w-screen pr-10">
            <div className='flex flex-col w-1/6 bg-slate-800 justify-start place-items-center'>
                <ul className='space-y-4 text-center w-full mt-[40%]'>
                    <li onClick={() => toggleInputs('sommet')} className='hover:bg-teal-600 hover:text-white p-2 cursor-pointer'>Ajouter Noeud</li>
                    <li onClick={() => toggleInputs('arete')} className='hover:bg-teal-600 hover:text-white p-2 cursor-pointer'>Ajouter Arete</li>
                    <li onClick={() => toggleInputs('supprimerSommet')} className='hover:bg-teal-600 hover:text-white p-2 cursor-pointer'>Supprimer Noeud</li>
                    <li onClick={() => toggleInputs('supprimerArete')} className='hover:bg-teal-600 hover:text-white p-2 cursor-pointer'>Supprimer Arete</li>
                    <li onClick={() => toggleInputs('modifierSommet')} className='hover:bg-teal-600 hover:text-white p-2 cursor-pointer mb-12'>Modifier Noeud</li>

                    {showInput.sommet && <AjouterSommet ajouterSommet={ajouterSommet} />}
                    {showInput.arete && <AjouterArete ajouterArete={ajouterArete} nodes={nodes} />}
                    {showInput.supprimerSommet && <SupprimerSommet supprimerSommet={supprimerSommet} nodes={nodes} />}
                    {showInput.supprimerArete && <SupprimerArete supprimerArete={supprimerArete} edges={edges} />}
                    {showInput.modifierSommet && (
    <ModifierSommet
        nodes={nodes}
        onModifyNode={modifierSommet} 
    />
)}                </ul>
            </div>

            <div className='flex-grow flex flex-col justify-center pl-10'>
                <h1 className='text-5xl inline text-center font-medium mb-10 text-slate-700'>Graph Visualization : Lab1 TPRO</h1>
                <div style={{ height: '500px', border: '1px solid #4A5568', color: 'black' }}>
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
                    onClick={voirPointsArticulation} 
                    className="mt-4 p-2 bg-slate-800 text-white rounded-none w-1/2 ml-[25%]"
                >
                    Voir les points d'articulation
                </button>
            </div>
        </div>
    );
};

export default App;
