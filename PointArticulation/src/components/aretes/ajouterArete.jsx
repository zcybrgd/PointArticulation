import React, { useState } from 'react';
import axios from 'axios';

const AjouterArete = ({ nodes, ajouterArete }) => {
    const [nodeEx1, setNodeEx1] = useState('');
    const [nodeEx2, setNodeEx2] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nodeEx1 && nodeEx2 && nodeEx1 !== nodeEx2) {
            try {
                await ajouterArete(nodeEx1, nodeEx2);  // Call the ajouterArete function
                setNodeEx1('');
                setNodeEx2('');
            } catch (error) {
                console.error('Error adding edge:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ajouter-arete-form flex flex-col space-y-2 justify-center items-center">
            <h2 className="text-lg">Ajouter Arete</h2>
            <select className="p-2 border rounded w-3/4" value={nodeEx1} onChange={(e) => setNodeEx1(e.target.value)} required>
                <option value="">Select Node 1</option>
                {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {node.data.label} {/* Display the node's label instead of ID */}
                    </option>
                ))}
            </select>

            <select className="p-2 border rounded w-3/4" value={nodeEx2} onChange={(e) => setNodeEx2(e.target.value)} required>
                <option value="">Select Node 2</option>
                {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {node.data.label} {/* Display the node's label instead of ID */}
                    </option>
                ))}
            </select>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white w-full rounded-none">Ajouter Arete</button>
        </form>
    );
};

export default AjouterArete;
