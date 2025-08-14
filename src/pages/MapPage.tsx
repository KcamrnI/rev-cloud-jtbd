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
import EdgeEditor from '../components/EdgeEditor';
import CSVUpload from '../components/CSVUpload';

// Sample data - this will be replaced with CSV import
const sampleMicroJobs: MicroJob[] = [
  {
    id: '1',
    jobDomainStage: 'Contract Management',
    mainJob: 'Manage or Renew Contract Post-Sales',
    microJob: 'Activate & Administer Contract',
    jobPerformers: ['jp1', 'jp2'],
    highLevelDescription: 'Initial contract setup and activation',
    detailDescription: 'Complete setup of contract terms, activation of services, and initial administration tasks',
    productTeam: 'NGP',
    position: { x: 100, y: 150 },
  },
  {
    id: '2',
    jobDomainStage: 'Analytics',
    mainJob: 'Manage or Renew Contract Post-Sales',
    microJob: 'Activate & Administer Contract',
    jobPerformers: ['jp1', 'jp2'],
    highLevelDescription: 'Monitor and analyze contract performance',
    detailDescription: 'Review contract metrics, obligations, and performance indicators',
    productTeam: 'NGP',
    position: { x: 400, y: 150 },
  },
  {
    id: '3',
    jobDomainStage: 'Finance',
    mainJob: 'Analyze Sales Bookings',
    microJob: 'Activate & Administer Contract',
    jobPerformers: ['jp3'],
    highLevelDescription: 'Ensure proper revenue recognition',
    detailDescription: 'Review contracts to ensure compliance with revenue recognition standards',
    productTeam: 'Performance Management',
    position: { x: 700, y: 150 },
  },
  {
    id: '4',
    jobDomainStage: 'Legal',
    mainJob: 'Process New Contract',
    microJob: 'Review & Validate Terms',
    jobPerformers: ['jp2', 'jp4'],
    highLevelDescription: 'Review incoming contract terms',
    detailDescription: 'Validate contract terms against company policies and legal requirements',
    productTeam: 'NGP',
    position: { x: 250, y: 350 },
  },
  {
    id: '5',
    jobDomainStage: 'Analytics',
    mainJob: 'Monitor Performance',
    microJob: 'Generate Reports',
    jobPerformers: ['jp4'],
    highLevelDescription: 'Create performance dashboards',
    detailDescription: 'Generate automated reports on contract performance and compliance',
    productTeam: 'Performance Management',
    position: { x: 550, y: 350 },
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
  { id: 'e1-4', source: '1', target: '4', type: 'normal' },
  { id: 'e4-5', source: '4', target: '5', type: 'normal' },
  { id: 'e3-5', source: '3', target: '5', type: 'feedback', label: 'Review Loop' },
];

// Define custom node types
const nodeTypes: NodeTypes = {
  microJob: MicroJobNode as any,
};

const MapPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedJobPerformers: [],
    selectedGroups: [],
    selectedTeams: [],
    selectedDomains: [],
  });

  // Edge editing state
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);

  // Job performer search state
  const [performerSearchTerm, setPerformerSearchTerm] = useState('');

  // CSV data state
  const [csvMicroJobs, setCsvMicroJobs] = useState<MicroJob[]>([]);
  const [csvJobPerformers, setCsvJobPerformers] = useState<JobPerformer[]>([]);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [hasCSVData, setHasCSVData] = useState(false);

  // Use CSV data if available, otherwise use sample data
  const currentMicroJobs = hasCSVData ? csvMicroJobs : sampleMicroJobs;
  const currentJobPerformers = hasCSVData ? csvJobPerformers : sampleJobPerformers;

  // Initialize nodes without callback first
  const initialNodes: Node[] = useMemo(() => 
    currentMicroJobs.map(microJob => ({
      id: microJob.id,
      type: 'microJob',
      position: microJob.position,
      zIndex: 1,
      data: { 
        microJob, 
        jobPerformers: microJob.jobPerformers.map(id => 
          currentJobPerformers.find(jp => jp.id === id)!
        ),
        isHighlighted: false,
        isTeamHighlighted: false,
        isSelected: false,
      } as MicroJobNodeData,
    })), [currentMicroJobs, currentJobPerformers]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  // Update nodes with onExpandChange callback after setNodes is available
  React.useEffect(() => {
    setNodes(nodes => nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onExpandChange: (isExpanded: boolean) => {
          setNodes(currentNodes => currentNodes.map(currentNode => 
            currentNode.id === node.id 
              ? { ...currentNode, zIndex: isExpanded ? 1000 : 1 }
              : currentNode
          ));
        },
      } as MicroJobNodeData,
    })));
  }, [setNodes]);

  // Convert connections to React Flow edges
  const initialEdges: Edge[] = useMemo(() => 
    sampleConnections.map(connection => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      label: connection.label,
      type: connection.type === 'feedback' ? 'straight' : 'smoothstep',
      style: connection.type === 'feedback' ? { stroke: '#ef4444', strokeDasharray: '5,5' } : {},
      animated: connection.type === 'feedback',
    })), []);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
    }, eds)),
    [setEdges]
  );

  // Handle clicking on the canvas pane to collapse expanded nodes
  const onPaneClick = useCallback(() => {
    // Reset any expanded nodes by updating their internal state
    // This will be handled by the nodes themselves via a global state or event
  }, []);

  // Edge click handler for editing
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdgeId(edge.id);
    setEditingEdge(edge);
  }, []);

  // Save edge changes
  const handleEdgeSave = useCallback((updatedEdge: Edge) => {
    setEdges(edges => edges.map(edge => 
      edge.id === updatedEdge.id ? updatedEdge : edge
    ));
    setEditingEdge(null);
    setSelectedEdgeId(null);
  }, [setEdges]);

  // Delete edge
  const handleEdgeDelete = useCallback(() => {
    if (selectedEdgeId) {
      setEdges(edges => edges.filter(edge => edge.id !== selectedEdgeId));
      setEditingEdge(null);
      setSelectedEdgeId(null);
    }
  }, [selectedEdgeId, setEdges]);

  // Cancel edge editing
  const handleEdgeCancel = useCallback(() => {
    setEditingEdge(null);
    setSelectedEdgeId(null);
  }, []);

  // Update nodes when filters change
  React.useEffect(() => {
    setNodes(nodes => 
      nodes.map(node => {
        const nodeData = node.data as MicroJobNodeData;
        const isJobPerformerHighlighted = filters.selectedJobPerformers.length > 0 ? 
          nodeData.microJob.jobPerformers.some(id => filters.selectedJobPerformers.includes(id)) : false;
        const isTeamHighlighted = filters.selectedTeams.length > 0 ? 
          filters.selectedTeams.includes(nodeData.microJob.productTeam) : false;
        const isDomainMatch = filters.selectedDomains.length > 0 ? 
          filters.selectedDomains.includes(nodeData.microJob.jobDomainStage) : true;
        
        return {
          ...node,
          hidden: !isDomainMatch,
          data: {
            ...nodeData,
            isHighlighted: isJobPerformerHighlighted,
            isTeamHighlighted: isTeamHighlighted,
          } as MicroJobNodeData,
        };
      })
    );
  }, [filters, setNodes]);

  // CSV upload handler
  const handleCSVData = useCallback((data: { microJobs: MicroJob[], jobPerformers: JobPerformer[] }) => {
    setCsvMicroJobs(data.microJobs);
    setCsvJobPerformers(data.jobPerformers);
    setHasCSVData(true);
    setShowCSVUpload(false);

    // Auto-generate connections based on sequence
    const connections: JourneyConnection[] = [];
    const sortedJobs = data.microJobs.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    
    for (let i = 0; i < sortedJobs.length - 1; i++) {
      connections.push({
        id: `auto-${i}`,
        source: sortedJobs[i].id,
        target: sortedJobs[i + 1].id,
        type: 'normal',
      });
    }

    // Convert to React Flow edges
    const autoEdges = connections.map(connection => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      type: 'smoothstep',
    }));

    setEdges(autoEdges);
  }, [setEdges]);

  // Get unique teams/domains for filtering
  const productTeams = useMemo(() => 
    Array.from(new Set(currentMicroJobs.map(mj => mj.productTeam))), [currentMicroJobs]);
  const domains = useMemo(() => 
    Array.from(new Set(currentMicroJobs.map(mj => mj.jobDomainStage))), [currentMicroJobs]);
  const jobPerformerGroups = useMemo(() => 
    Array.from(new Set(currentJobPerformers.map(jp => jp.group))), [currentJobPerformers]);

  // Filter job performers based on search term
  const filteredJobPerformers = useMemo(() => 
    currentJobPerformers.filter(jp => 
      jp.name.toLowerCase().includes(performerSearchTerm.toLowerCase())
    ), [performerSearchTerm, currentJobPerformers]);

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* Left Filter Panel */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters & Controls</h3>
          <button
            onClick={() => setShowCSVUpload(!showCSVUpload)}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {hasCSVData ? 'Upload New' : 'Upload CSV'}
          </button>
        </div>

        {/* CSV Upload Modal */}
        {showCSVUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Upload Journey CSV</h2>
                <button
                  onClick={() => setShowCSVUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CSVUpload onDataLoaded={handleCSVData} />
            </div>
          </div>
        )}

        {hasCSVData && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ CSV data loaded: {currentMicroJobs.length} microjobs, {currentJobPerformers.length} performers
            </p>
          </div>
        )}
        
        {/* Job Performer Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Performer
          </label>
          
          {/* Search Input */}
          <div className="mb-2 relative">
            <input
              type="text"
              placeholder="Search job performers..."
              value={performerSearchTerm}
              onChange={(e) => setPerformerSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {performerSearchTerm && (
              <button
                onClick={() => setPerformerSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Live filtered results */}
          {performerSearchTerm && (
            <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto bg-white">
              {filteredJobPerformers.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  No performers found
                </div>
              ) : (
                filteredJobPerformers.map(jp => (
                  <button
                    key={jp.id}
                    onClick={() => {
                      setFilters(prev => ({ 
                        ...prev, 
                        selectedJobPerformers: Array.from(new Set([...prev.selectedJobPerformers, jp.id]))
                      }));
                      setPerformerSearchTerm(''); // Clear search after selection
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 text-sm"
                    disabled={filters.selectedJobPerformers.includes(jp.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: jp.color }}
                      />
                      <span className={`${filters.selectedJobPerformers.includes(jp.id) ? 'text-gray-400' : 'text-gray-900'}`}>
                        {jp.name}
                      </span>
                      <span className="text-xs text-gray-500">({jp.group})</span>
                      {filters.selectedJobPerformers.includes(jp.id) && (
                        <span className="text-xs text-gray-400 ml-auto">Already selected</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.selectedJobPerformers.map(id => {
              const performer = sampleJobPerformers.find(jp => jp.id === id);
              return performer ? (
                <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {performer.name}
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, selectedJobPerformers: prev.selectedJobPerformers.filter(pId => pId !== id) }))}
                    className="flex-shrink-0 ml-1.5 h-3 w-3 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
                  >
                    <span className="sr-only">Remove performer</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>

        {/* Job Performer Group Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Performer Groups
          </label>
          <div className="flex flex-wrap gap-2">
            {jobPerformerGroups.map(group => (
              <button
                key={group}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  selectedGroups: prev.selectedGroups.includes(group) ? prev.selectedGroups.filter(g => g !== group) : [...prev.selectedGroups, group] 
                }))}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filters.selectedGroups.includes(group)
                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Filter Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Teams
          </label>
          <div className="flex flex-wrap gap-2">
            {domains.map(domain => (
              <button
                key={domain}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  selectedDomains: prev.selectedDomains.includes(domain) ? prev.selectedDomains.filter(d => d !== domain) : [...prev.selectedDomains, domain] 
                }))}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filters.selectedDomains.includes(domain)
                    ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Team Filter Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domains
          </label>
          <div className="flex flex-wrap gap-2">
            {productTeams.map(team => (
              <button
                key={team}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  selectedTeams: prev.selectedTeams.includes(team) ? prev.selectedTeams.filter(t => t !== team) : [...prev.selectedTeams, team] 
                }))}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filters.selectedTeams.includes(team)
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
            onClick={() => {
              setFilters({ selectedJobPerformers: [], selectedGroups: [], selectedTeams: [], selectedDomains: [] });
              setPerformerSearchTerm('');
            }}
            className="w-full px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        {/* Right Canvas Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            className="bg-white"
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
          
          {/* Edge Editor */}
          {editingEdge && (
            <EdgeEditor
              edge={editingEdge}
              onSave={handleEdgeSave}
              onCancel={handleEdgeCancel}
              onDelete={handleEdgeDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;