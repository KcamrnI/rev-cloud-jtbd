import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { CSVMicroJobRow, MicroJob, JobPerformer } from '../types';

interface CSVUploadProps {
  onDataLoaded: (data: { microJobs: MicroJob[], jobPerformers: JobPerformer[] }) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const generatePerformerColor = (index: number): string => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4',
      '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6', '#F59E0B'
    ];
    return colors[index % colors.length];
  };

  const processCSVData = useCallback((csvData: CSVMicroJobRow[]) => {
    // Extract unique job performers
    const performerMap = new Map<string, JobPerformer>();
    let performerIndex = 0;

    csvData.forEach(row => {
      const performers = row.job_performer.split(',').map(p => p.trim());
      const groups = row.job_performer_group.split(',').map(g => g.trim());
      
      performers.forEach((performer, idx) => {
        if (!performerMap.has(performer)) {
          performerMap.set(performer, {
            id: `jp-${performerIndex}`,
            name: performer,
            color: generatePerformerColor(performerIndex),
            group: groups[idx] || groups[0] || 'Default Group',
          });
          performerIndex++;
        }
      });
    });

    const jobPerformers = Array.from(performerMap.values());

    // Process microjobs with auto-positioning
    const microJobs: MicroJob[] = csvData
      .sort((a, b) => a.sequence - b.sequence)
      .map((row, index) => {
        const performers = row.job_performer.split(',').map(p => p.trim());
        const performerIds = performers.map(name => {
          const performer = jobPerformers.find(jp => jp.name === name);
          return performer?.id || '';
        }).filter(id => id);

        // Auto-position nodes in a flow layout
        const x = 100 + (index % 4) * 300; // 4 columns
        const y = 150 + Math.floor(index / 4) * 250; // Rows of 250px spacing

        return {
          id: `job-${index + 1}`,
          jobDomainStage: row.domain,
          mainJob: row.main_job,
          microJob: row.micro_job,
          jobPerformers: performerIds,
          highLevelDescription: row.high_level_description,
          detailDescription: row.detail_description,
          productTeam: row.product_team,
          position: { x, y },
          sequence: row.sequence,
        };
      });

    return { microJobs, jobPerformers };
  }, []);

  const handleFile = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Transform common header variations to match our interface
        const headerMap: { [key: string]: string } = {
          'Sequence': 'sequence',
          'Micro Job': 'micro_job',
          'MicroJob': 'micro_job',
          'Main Job': 'main_job',
          'MainJob': 'main_job',
          'Domain': 'domain',
          'High Level Description': 'high_level_description',
          'High-Level Description': 'high_level_description',
          'Detail Description': 'detail_description',
          'Detailed Description': 'detail_description',
          'Job Performer': 'job_performer',
          'Job Performers': 'job_performer',
          'Job Performer Group': 'job_performer_group',
          'Job Performer Groups': 'job_performer_group',
          'Product Team': 'product_team',
          'ProductTeam': 'product_team',
        };
        return headerMap[header] || header.toLowerCase().replace(/\s+/g, '_');
      },
      transform: (value: string, header: string) => {
        if (header === 'sequence') {
          return parseInt(value) || 0;
        }
        return value;
      },
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            setError(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`);
            setIsLoading(false);
            return;
          }

          const csvData = results.data as CSVMicroJobRow[];
          if (csvData.length === 0) {
            setError('No data found in CSV file');
            setIsLoading(false);
            return;
          }

          // Validate required fields
          const requiredFields = ['sequence', 'micro_job', 'main_job', 'domain'];
          const firstRow = csvData[0];
          const missingFields = requiredFields.filter(field => !(field in firstRow));
          
          if (missingFields.length > 0) {
            setError(`Missing required columns: ${missingFields.join(', ')}`);
            setIsLoading(false);
            return;
          }

          const processedData = processCSVData(csvData);
          onDataLoaded(processedData);
          setIsLoading(false);
        } catch (err) {
          setError(`Error processing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
  }, [processCSVData, onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleFile(file);
      } else {
        setError('Please upload a CSV file');
      }
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onClick={() => document.getElementById('csv-upload')?.click()}
      >
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Processing CSV...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Journey CSV</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Required columns: Sequence, Micro Job, Main Job, Domain
            </p>
          </>
        )}
        
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-white p-2 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <p className="font-semibold mb-1">Expected CSV format:</p>
        <p>Sequence, Micro Job, Main Job, Domain, High Level Description, Detail Description, Job Performer, Job Performer Group, Product Team</p>
      </div>
    </div>
  );
};

export default CSVUpload;