import React, { useState } from 'react';

const SupprimerSommet = ({ nodes, supprimerSommet }) => {
    const [selectedNode, setSelectedNode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedNode) {
            supprimerSommet(selectedNode);
            setSelectedNode('');  // Clear the selected node after deletion
        }
    };

    return (
        <form onSubmit={handleSubmit} className="supprimer-sommet-form flex flex-col mt-4 space-y-2 justify-center items-center">
            <label htmlFor="node">Select Node to Remove</label>
            <select
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value)}
                required
                className="p-2 border w-3/4 rounded"
            >
                <option value="">Select Node</option>
                {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {`${node.data.label} (ID: ${node.id})`}
                    </option>
                ))}
            </select>

            <button type="submit" className="p-2 bg-red-800 text-white w-full rounded-none">Remove Node</button>
        </form>
    );
};

export default SupprimerSommet;
