import React, { useState } from 'react';
import { Edge } from '@xyflow/react';

interface EdgeEditorProps {
  edge: Edge;
  onSave: (edge: Edge) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const EdgeEditor: React.FC<EdgeEditorProps> = ({ edge, onSave, onCancel, onDelete }) => {
  const [editedEdge, setEditedEdge] = useState<Edge>({ ...edge });

  const handleSave = () => {
    onSave(editedEdge);
  };

  return (
    <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Connection</h3>
      
      {/* Label Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Label
        </label>
        <input
          type="text"
          value={typeof editedEdge.label === 'string' ? editedEdge.label : ''}
          onChange={(e) => setEditedEdge({ ...editedEdge, label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Optional label for the connection..."
        />
      </div>

      {/* Connection Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Connection Type
        </label>
        <select
          value={editedEdge.type || 'smoothstep'}
          onChange={(e) => setEditedEdge({ 
            ...editedEdge, 
            type: e.target.value,
            style: e.target.value === 'straight' ? { stroke: '#ef4444', strokeDasharray: '5,5' } : {},
            animated: e.target.value === 'straight'
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="smoothstep">Smooth Step (Default)</option>
          <option value="straight">Feedback (Dashed)</option>
          <option value="step">Step</option>
          <option value="default">Curved</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EdgeEditor;