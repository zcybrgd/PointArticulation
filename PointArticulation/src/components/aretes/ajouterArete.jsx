// AjouterArete.jsx
import React, { useState } from 'react';

const AjouterArete = ({ ajouterArete, nodes }) => {
    const [nodeEx1, setNodeEx1] = useState('');
    const [nodeEx2, setNodeEx2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nodeEx1 && nodeEx2 && nodeEx1 !== nodeEx2) {
            ajouterArete(nodeEx1, nodeEx2); // Add the edge between nodes
            setNodeEx1('');
            setNodeEx2('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ajouter-arete-form flex flex-col space-y-2 justify-center items-center">
            <label htmlFor="nodeEx1">From Node ID:</label>
            <select value={nodeEx1} onChange={(e) => setNodeEx1(e.target.value)} className='p-2 border w-3/4 rounded' required>
                <option value="">Select Node</option>
                {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {node.data.label} (ID: {node.id})
                    </option>
                ))}
            </select>

            <label htmlFor="nodeEx2">To Node ID:</label>
            <select value={nodeEx2} onChange={(e) => setNodeEx2(e.target.value)} className='p-2 border w-3/4 rounded ' required>
                <option value="">Select Node</option>
                {nodes.map((node) => (
                    <option key={node.id} value={node.id} >
                        {node.data.label} (ID: {node.id})
                    </option>
                ))}
            </select>

            <button type="submit" className="px-4 py-2 bg-blue-500 text-white w-full rounded-none ">Add Edge</button>
        </form>
    );
};

export default AjouterArete;
