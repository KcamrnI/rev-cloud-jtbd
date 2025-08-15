import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MicroJobNodeData } from '../types';

const MicroJobNode: React.FC<NodeProps> = ({ data }) => {
  const { microJob, jobPerformers, isHighlighted, isTeamHighlighted } = data as MicroJobNodeData;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Effect to update the node's z-index in React Flow when expanded
  React.useEffect(() => {
    const nodeData = data as MicroJobNodeData;
    if (nodeData.onExpandChange) {
      nodeData.onExpandChange(isExpanded);
    }
  }, [isExpanded, data]);

  return (
    <div 
      className={`
        bg-white border-2 rounded-lg shadow-md overflow-hidden cursor-pointer
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'min-w-[380px] max-w-[450px] h-[400px] shadow-2xl' : 'min-w-[300px] max-w-[350px] h-[200px]'}
        ${isHighlighted 
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-300' 
          : isTeamHighlighted
          ? 'border-green-500 shadow-lg ring-2 ring-green-300'
          : 'border-gray-300 hover:border-gray-400 hover:shadow-lg'
        }
      `}
      onClick={handleNodeClick}
      style={{
        position: isExpanded ? 'relative' : 'relative',
        zIndex: isExpanded ? 9999 : 'auto',
        transform: isExpanded ? 'translateZ(0)' : 'none',
      }}
    >
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

      {!isExpanded ? (
        /* Simple View */
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className={`${microJob.jobDomainStage === 'Product & Pricing' ? 'bg-yellow-500' : 'bg-blue-600'} text-white p-3 relative`}>
            {/* Product Team Badge */}
            <div className={`absolute top-1 left-1 ${microJob.jobDomainStage === 'Product & Pricing' ? 'bg-yellow-700' : 'bg-blue-800'} text-white text-[10px] px-2 py-0.5 rounded`}>
              {microJob.productTeam}
            </div>
            
            {/* Micro Job Title */}
            <div className="mt-4">
              <h3 className="font-bold text-sm leading-tight">
                {microJob.microJob}
              </h3>
            </div>
          </div>

          {/* White Body Section */}
          <div className="bg-white flex-1 flex flex-col justify-center p-3">
            {/* Job Performers Row */}
            <div className="flex items-start justify-center gap-4 px-3">
              {jobPerformers.map((performer: any) => (
                <div key={performer.id} className="flex flex-col items-center w-[60px]">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: performer.color }}
                    title={`${performer.name} (${performer.group})`}
                  >
                    {performer.name.charAt(0)}
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 text-center leading-tight break-words">
                    {performer.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Detailed View */
        <>
          {/* Header Section - Expanded */}
          <div className={`${microJob.jobDomainStage === 'Product & Pricing' ? 'bg-yellow-500' : 'bg-blue-600'} text-white p-4 relative`}>
            {/* Product Team Badge */}
            <div className={`absolute top-2 left-2 ${microJob.jobDomainStage === 'Product & Pricing' ? 'bg-yellow-700' : 'bg-blue-800'} text-white text-[10px] px-2 py-0.5 rounded`}>
              {microJob.productTeam}
            </div>
            
            {/* Micro Job Title (larger) */}
            <div className="mt-6 mb-3">
              <h3 className="font-bold text-lg leading-tight">
                {microJob.microJob}
              </h3>
            </div>

            {/* Main Job */}
            <div className="mb-2">
              <h4 className="text-blue-100 text-sm font-medium">
                {microJob.mainJob}
              </h4>
            </div>
          </div>

          {/* White Body Section - Expanded */}
          <div className="bg-white p-4">
            {/* Associated Domain */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Domain</label>
              <p className="text-sm text-gray-900 font-medium">{microJob.jobDomainStage}</p>
            </div>

            {/* Job Step Description */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
              <p className="text-sm text-gray-700 leading-relaxed">{microJob.detailDescription}</p>
            </div>

            {/* Job Performers - Detailed */}
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Job Performers</label>
              <div className="space-y-2">
                {jobPerformers.map((performer: any) => (
                  <div key={performer.id} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: performer.color }}
                    >
                      {performer.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({performer.group})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click to collapse hint */}
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-400">Click to collapse</span>
            </div>
          </div>
        </>
      )}

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