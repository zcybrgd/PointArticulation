import React, { useState } from 'react';

const SupprimerArete = ({ edges, supprimerArete }) => {
    const [selectedEdge, setSelectedEdge] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedEdge) {
            // Call the passed supprimerArete function
            supprimerArete(selectedEdge);
            setSelectedEdge(''); // Clear selection after deletion
        }
    };

    return (
        <form onSubmit={handleSubmit} className="supprimer-arete-form flex flex-col mt-4 space-y-2 justify-center items-center">
            <label htmlFor="edge">Select Edge to Remove:</label>
            <select
                value={selectedEdge}
                onChange={(e) => setSelectedEdge(e.target.value)}
                required
                className="p-2 border w-3/4 rounded"
            >
                <option value="">Select Edge</option>
                {edges.map((edge) => (
                    <option key={edge.id} value={edge.id}>
                        {edge.source} → {edge.target} (ID: {edge.id})
                    </option>
                ))}
            </select>

            <button type="submit" className="p-2 bg-red-800 text-white w-full rounded-none">Remove Edge</button>
        </form>
    );
};

export default SupprimerArete;
