import React from 'react';
import ReportList from './components/ReportList';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Relatórios</h1>
      </div>
      <ReportList />
    </div>
  );
}
