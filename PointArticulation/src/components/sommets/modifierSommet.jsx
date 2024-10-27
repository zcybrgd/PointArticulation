import React, { useState } from 'react';

const ModifierSommet = ({ nodes, onModifyNode }) => {
    const [selectedNode, setSelectedNode] = useState('');
    const [newLabel, setNewLabel] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedNode && newLabel) {
            onModifyNode(selectedNode, newLabel); // Call the passed function
            setSelectedNode('');
            setNewLabel('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modifier-sommet-form flex flex-col mt-4 space-y-2 justify-center items-center">
            <label htmlFor="node">Select Node to Modify:</label>
            <select
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value)}
                required
                className="p-2 border rounded w-3/4"
            >
                <option value="">Select Node</option>
                {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {`${node.data.label} (ID: ${node.id})`} {/* Only text here */}
                    </option>
                ))}
            </select>

            <label htmlFor="newLabel">New Label:</label>
            <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="New Label"
                className="p-2 border rounded w-3/4"
                required
            />

            <button type="submit" className="px-4 py-2 bg-blue-500 text-white w-full rounded-none">Modify Node</button>
        </form>
    );
};

export default ModifierSommet;
