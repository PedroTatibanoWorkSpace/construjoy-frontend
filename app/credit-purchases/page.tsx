import React from 'react';
import CreditPurchaseList from './components/CreditPurchaseList';

export default function CreditPurchasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Compras a Crédito</h1>
      </div>
      <CreditPurchaseList />
    </div>
  );
}