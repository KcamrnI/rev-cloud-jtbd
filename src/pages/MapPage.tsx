import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
} from '@xyflow/react';
import { MicroJob, JourneyConnection, JobPerformer, MicroJobNodeData, FilterState } from '../types';
import MicroJobNode from '../components/MicroJobNode';

// Sample data - this will be replaced with CSV import
const sampleMicroJobs: MicroJob[] = [
  {
    id: '1',
    jobDomainStage: 'Post Sales Contract Management',
    mainJob: 'Manage or Renew Contract Post-Sales',
    microJob: 'Activate & Administer Contract',
    jobPerformers: ['jp1', 'jp2'],
    highLevelDescription: 'Initial contract setup and activation',
    detailDescription: 'Complete setup of contract terms, activation of services, and initial administration tasks',
    productTeam: 'Contract Management',
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    jobDomainStage: 'Post Sales Contract Management',
    mainJob: 'Manage or Renew Contract Post-Sales',
    microJob: 'Understand contract performance & obligations',
    jobPerformers: ['jp1', 'jp3'],
    highLevelDescription: 'Monitor and analyze contract performance',
    detailDescription: 'Review contract metrics, obligations, and performance indicators',
    productTeam: 'Analytics',
    position: { x: 450, y: 100 },
  },
  {
    id: '3',
    jobDomainStage: 'Performance Management',
    mainJob: 'Analyze Sales Bookings',
    microJob: 'Review contracts for revenue recognition',
    jobPerformers: ['jp2', 'jp4'],
    highLevelDescription: 'Ensure proper revenue recognition',
    detailDescription: 'Review contracts to ensure compliance with revenue recognition standards',
    productTeam: 'Finance',
    position: { x: 800, y: 100 },
  },
];

const sampleJobPerformers: JobPerformer[] = [
  { id: 'jp1', name: 'Sales Rep', color: '#3B82F6', group: 'Sales Team' },
  { id: 'jp2', name: 'Contract Manager', color: '#10B981', group: 'Operations' },
  { id: 'jp3', name: 'Account Manager', color: '#F59E0B', group: 'Customer Success' },
  { id: 'jp4', name: 'Finance Analyst', color: '#8B5CF6', group: 'Finance' },
];

const sampleConnections: JourneyConnection[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'normal' },
  { id: 'e2-3', source: '2', target: '3', type: 'normal' },
];

// Define custom node types
const nodeTypes: NodeTypes = {
  microJob: MicroJobNode as any,
};

const MapPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedJobPerformer: null,
    selectedTeam: null,
    selectedStage: null,
  });

  // Convert micro jobs to React Flow nodes
  const initialNodes: Node[] = useMemo(() => 
    sampleMicroJobs.map(microJob => ({
      id: microJob.id,
      type: 'microJob',
      position: microJob.position,
      data: { 
        microJob, 
        jobPerformers: microJob.jobPerformers.map(id => 
          sampleJobPerformers.find(jp => jp.id === id)!
        ),
        isHighlighted: false,
        isTeamHighlighted: false,
      },
    })), []);

  // Convert connections to React Flow edges
  const initialEdges: Edge[] = useMemo(() => 
    sampleConnections.map(connection => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      label: connection.label,
      type: connection.type === 'feedback' ? 'straight' : 'default',
      style: connection.type === 'feedback' ? { stroke: '#ef4444', strokeDasharray: '5,5' } : {},
      animated: connection.type === 'feedback',
    })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes when filters change
  React.useEffect(() => {
    setNodes(nodes => 
      nodes.map(node => {
        const nodeData = node.data as MicroJobNodeData;
        const isJobPerformerHighlighted = filters.selectedJobPerformer ? 
          nodeData.microJob.jobPerformers.includes(filters.selectedJobPerformer) : false;
        const isTeamHighlighted = filters.selectedTeam ? 
          nodeData.microJob.productTeam === filters.selectedTeam : false;
        
        return {
          ...node,
          data: {
            ...nodeData,
            isHighlighted: isJobPerformerHighlighted,
            isTeamHighlighted: isTeamHighlighted,
          }
        };
      })
    );
  }, [filters, setNodes]);

  // Get unique teams for filtering
  const productTeams = useMemo(() => 
    Array.from(new Set(sampleMicroJobs.map(mj => mj.productTeam))), []);

  return (
    <div className="h-screen bg-gray-50">
      {/* Filter Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-6 max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Controls</h3>
        
        {/* Job Performer Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Performer
          </label>
          <select
            value={filters.selectedJobPerformer || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              selectedJobPerformer: e.target.value || null 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Job Performers</option>
            {sampleJobPerformers.map(jp => (
              <option key={jp.id} value={jp.id}>
                {jp.name} ({jp.group})
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Teams
          </label>
          <div className="flex flex-wrap gap-2">
            {productTeams.map(team => (
              <button
                key={team}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  selectedTeam: prev.selectedTeam === team ? null : team 
                }))}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filters.selectedTeam === team
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => setFilters({ selectedJobPerformer: null, selectedTeam: null, selectedStage: null })}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        className="bg-gray-50"
        fitView
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const nodeData = node.data as MicroJobNodeData;
            return nodeData.isHighlighted ? '#3B82F6' : 
                   nodeData.isTeamHighlighted ? '#10B981' : '#6B7280';
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default MapPage;