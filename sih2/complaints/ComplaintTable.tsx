import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import type { Complaint, ComplaintPriority, ComplaintStatus, BureauCell } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { useComplaints } from '../../context/ComplaintContext';
import { AICTE_BUREAUS } from '../../data/initialComplaints';

interface ComplaintTableProps {
  onSelectComplaint: (id: string) => void;
  initialFilterStatus?: ComplaintStatus | 'All' | 'Overdue';
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  onSelectComplaint,
  initialFilterStatus = 'All',
}) => {
  const { complaints, globalSearchQuery, setGlobalSearchQuery } = useComplaints();

  // Filters state
  const [searchTerm, setSearchTerm] = useState(globalSearchQuery || '');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterStatus);
  const [bureauFilter, setBureauFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'submissionDate' | 'priority' | 'id' | 'status'>('submissionDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = new Set(complaints.map((c) => c.institution.state));
    return Array.from(states).sort();
  }, [complaints]);

  // Priority ordering map for sorting
  const priorityWeight: Record<ComplaintPriority, number> = {
    Urgent: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Filtered and sorted complaints
  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        // Search term matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matches =
            c.id.toLowerCase().includes(q) ||
            c.refToken.toLowerCase().includes(q) ||
            c.institution.name.toLowerCase().includes(q) ||
            c.institution.city.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.assignedOfficer.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Status filter
        if (statusFilter === 'Overdue') {
          if (!c.isOverdue || c.status === 'Resolved' || c.status === 'Closed') {
            return false;
          }
        } else if (statusFilter !== 'All' && c.status !== statusFilter) {
          return false;
        }

        // Bureau filter
        if (bureauFilter !== 'All' && c.bureau !== bureauFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'All' && c.priority !== priorityFilter) {
          return false;
        }

        // State filter
        if (stateFilter !== 'All' && c.institution.state !== stateFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'submissionDate') {
          comp = new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        } else if (sortField === 'priority') {
          comp = priorityWeight[a.priority] - priorityWeight[b.priority];
        } else if (sortField === 'id') {
          comp = a.id.localeCompare(b.id);
        } else if (sortField === 'status') {
          comp = a.status.localeCompare(b.status);
        }
        return sortAsc ? comp : -comp;
      });
  }, [complaints, searchTerm, statusFilter, bureauFilter, priorityFilter, stateFilter, sortField, sortAsc]);

  // Paginated records
  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredComplaints.slice(start, start + pageSize);
  }, [filteredComplaints, currentPage, pageSize]);

  const handleSort = (field: 'submissionDate' | 'priority' | 'id' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for new field
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setBureauFilter('All');
    setPriorityFilter('All');
    setStateFilter('All');
    setGlobalSearchQuery('');
    setCurrentPage(1);
  };

  // CSV Export Functionality
  const exportToCSV = () => {
    const headers = [
      'Complaint ID',
      'Ref Token',
      'Institution Name',
      'AICTE PID',
      'State',
      'Category',
      'Bureau / Cell',
      'Assigned Officer',
      'Submission Date',
      'Priority',
      'Status',
      'Days Pending',
      'Overdue Breached',
      'Subject',
    ];

    const rows = filteredComplaints.map((c) => [
      c.id,
      c.refToken,
      `"${c.institution.name.replace(/"/g, '""')}"`,
      c.institution.id,
      c.institution.state,
      `"${c.category.replace(/"/g, '""')}"`,
      `"${c.bureau.replace(/"/g, '""')}"`,
      `"${c.assignedOfficer.replace(/"/g, '""')}"`,
      c.submissionDate,
      c.priority,
      c.status,
      c.daysPending,
      c.isOverdue ? 'YES' : 'NO',
      `"${c.subject.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `AICTE_Complaint360_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, token, college name, city, officer, or keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Action Buttons: Export CSV & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV ({filteredComplaints.length})</span>
            </button>

            <button
              onClick={clearAllFilters}
              title="Clear all active filters"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="Awaiting Information">Awaiting Information</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Overdue">⚠️ Overdue Cases</option>
            </select>
          </div>

          {/* Bureau Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bureau / Cell
            </label>
            <select
              value={bureauFilter}
              onChange={(e) => {
                setBureauFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white truncate"
            >
              <option value="All">All Bureaus & Cells</option>
              {AICTE_BUREAUS.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              State / Region
            </label>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white truncate"
            >
              <option value="All">All States</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Page Size Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rows Per Page
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white"
            >
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={35}>35 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Responsive Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Complaint ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Institution Name & State</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bureau / Cell</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('submissionDate')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Submitted</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="text-sm font-semibold text-slate-800">
                        No matching complaints found
                      </p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your search criteria or reset filters to see all records.
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedComplaints.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Complaint ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      <div>{item.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {item.refToken}
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate" title={item.institution.name}>
                        {item.institution.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{item.institution.city}, {item.institution.state}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 max-w-[200px]">
                      <span className="text-[11px] text-slate-700 block truncate" title={item.category}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {item.subject}
                      </span>
                    </td>

                    {/* Bureau */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {item.bureau}
                      </span>
                    </td>

                    {/* Officer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">
                        {item.assignedOfficer}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.officerDesignation}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge status={item.status} size="sm" />
                        {item.isOverdue && item.status !== 'Resolved' && item.status !== 'Closed' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Overdue ({item.daysPending}d)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Submission Date */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      <div>{item.submissionDate}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.daysPending} days ago
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectComplaint(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg border border-blue-200 hover:border-blue-700 transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing{' '}
            <strong className="text-slate-900">
              {filteredComplaints.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900">
              {Math.min(currentPage * pageSize, filteredComplaints.length)}
            </strong>{' '}
            of <strong className="text-slate-900">{filteredComplaints.length}</strong> complaints
            {complaints.length !== filteredComplaints.length && (
              <span className="text-slate-400 ml-1">
                (filtered from {complaints.length} total)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-medium">
              Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
              <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
