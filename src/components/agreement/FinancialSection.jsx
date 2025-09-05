import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import BillingPreview from './BillingPreview';
import PastDueInvoiceCheck from './PastDueInvoiceCheck';

export default function FinancialSection({ data, onUpdate }) {
  return (
      <div className="space-y-6">
        <Card className="border-green-100">
            <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                    <DollarSign className="w-5 h-5" />
                    Financial Terms
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="install_removal_fee">Installation & Removal Fee *</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                                id="install_removal_fee" 
                                type="number"
                                step="0.01"
                                value={data.install_removal_fee ?? 100.00} 
                                onChange={(e) => onUpdate({ install_removal_fee: parseFloat(e.target.value) || 0 })} 
                                required
                                className="pl-8"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <Label htmlFor="amount_collected">Amount Collected Today</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                                id="amount_collected" 
                                type="number"
                                step="0.01"
                                value={data.amount_collected ?? 0.00} 
                                onChange={(e) => onUpdate({ amount_collected: parseFloat(e.target.value) || 0 })} 
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <BillingPreview installDate={data.install_date} onUpdate={onUpdate} />

            </CardContent>
        </Card>

        <PastDueInvoiceCheck participantSsn={data.ssn} participantDob={data.dob} onUpdate={onUpdate} />
      </div>
  );
}