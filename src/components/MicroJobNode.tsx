import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MicroJobNodeData } from '../types';

const MicroJobNode: React.FC<NodeProps> = ({ data }) => {
  const { microJob, jobPerformers, isHighlighted, isTeamHighlighted } = data as MicroJobNodeData;

  return (
    <div className={`
      relative bg-white border-2 rounded-lg shadow-md overflow-hidden
      min-w-[240px] max-w-[280px]
      transition-all duration-200 ease-in-out
      ${isHighlighted 
        ? 'border-blue-500 shadow-lg ring-2 ring-blue-300' 
        : isTeamHighlighted
        ? 'border-green-500 shadow-lg ring-2 ring-green-300'
        : 'border-gray-300 hover:border-gray-400 hover:shadow-lg'
      }
    `}>
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        id="left"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        id="top"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        id="bottom"
      />

      {/* Blue Header Section */}
      <div className="bg-blue-600 text-white p-3 relative">
        {/* Domain Badge */}
        <div className="absolute top-1 left-1 bg-blue-800 text-white text-[10px] px-2 py-0.5 rounded">
          {microJob.jobDomainStage}
        </div>
        
        {/* Micro Job Title */}
        <div className="mt-4">
          <h3 className="font-bold text-sm leading-tight">
            {microJob.microJob}
          </h3>
        </div>
      </div>

      {/* White Body Section */}
      <div className="bg-white p-3">
        {/* Job Performers Row */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {jobPerformers.map((performer: any) => (
            <div key={performer.id} className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: performer.color }}
                title={`${performer.name} (${performer.group})`}
              >
                {performer.name.charAt(0)}
              </div>
              <span className="text-[10px] text-gray-600 mt-1 text-center max-w-[60px] leading-tight">
                {performer.name}
              </span>
            </div>
          ))}
        </div>

        {/* Product Team */}
        <div className="text-center">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded font-medium">
            {microJob.productTeam}
          </span>
        </div>
      </div>

      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        id="right"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        id="top-out"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
        id="bottom-out"
      />
    </div>
  );
};

export default MicroJobNode;