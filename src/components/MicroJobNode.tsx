import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MicroJobNodeData } from '../types';

const MicroJobNode: React.FC<NodeProps> = ({ data }) => {
  const { microJob, jobPerformers, isHighlighted, isTeamHighlighted } = data as MicroJobNodeData;

  return (
    <div className={`
      relative bg-white border-2 rounded-xl shadow-lg p-4 min-w-[280px] max-w-[320px]
      transition-all duration-300 ease-in-out
      ${isHighlighted 
        ? 'border-blue-500 bg-blue-50 shadow-xl scale-105' 
        : isTeamHighlighted
        ? 'border-green-500 bg-green-50 shadow-lg'
        : 'border-gray-300 hover:border-gray-400 hover:shadow-xl'
      }
    `}>
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        id="left"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        id="top"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        id="bottom"
      />

      {/* Stage Badge */}
      <div className="absolute -top-3 -left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
        {microJob.jobDomainStage}
      </div>

      {/* Main Job */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 text-sm leading-tight">
          {microJob.mainJob}
        </h3>
      </div>

      {/* Micro Job */}
      <div className="mb-4">
        <h4 className="font-semibold text-blue-700 text-sm">
          {microJob.microJob}
        </h4>
      </div>

      {/* High Level Description */}
      <div className="mb-4">
        <p className="text-gray-600 text-xs leading-relaxed">
          {microJob.highLevelDescription}
        </p>
      </div>

      {/* Job Performers */}
      {jobPerformers.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {jobPerformers.map((performer: any) => (
              <div
                key={performer.id}
                className="flex items-center space-x-1"
                title={`${performer.name} (${performer.group})`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: performer.color }}
                >
                  {performer.name.charAt(0)}
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {performer.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Team */}
      <div className="mb-2">
        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
          {microJob.productTeam}
        </span>
      </div>

      {/* Notes (if any) */}
      {microJob.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-gray-500 text-xs italic">
            💡 {microJob.notes}
          </p>
        </div>
      )}

      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        id="right"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        id="top-out"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        id="bottom-out"
      />
    </div>
  );
};

export default MicroJobNode;