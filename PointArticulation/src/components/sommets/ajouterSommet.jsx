// AjouterSommet.jsx
import React, { useState } from 'react';

const AjouterSommet = ({ ajouterSommet }) => {
    const [label, setLabel] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (label) {
            ajouterSommet(label); 
            setLabel(''); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ajouter-sommet-form  flex flex-col mt-4 space-y-2 justify-center items-center">
            <label htmlFor="label ">Node Label:</label>
            <input
            className='p-2 border w-3/4 rounded'
                type="text"
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter node label"
                required
            />
            <button type="submit"className="px-4 py-2 bg-blue-500 text-white w-full rounded-none"> Add Node</button>
        </form>
    );
};

export default AjouterSommet;
