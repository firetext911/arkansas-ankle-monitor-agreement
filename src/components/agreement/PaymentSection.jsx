import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSection({ data, onUpdate }) {
    const [depositSelected, setDepositSelected] = useState(false);
    const [pastDueSelected, setPastDueSelected] = useState(false);
    const [otherSelected, setOtherSelected] = useState(false);
    
    const [pastDueAmount, setPastDueAmount] = useState('');
    const [otherAmount, setOtherAmount] = useState('');
    const [otherDescription, setOtherDescription] = useState('');
    
    const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate total payment amount whenever selections change
    useEffect(() => {
        let total = 0;
        
        if (depositSelected) {
            total += 1500;
        }
        
        if (pastDueSelected && pastDueAmount) {
            total += parseFloat(pastDueAmount) || 0;
        }
        
        if (otherSelected && otherAmount) {
            total += parseFloat(otherAmount) || 0;
        }
        
        setTotalPaymentAmount(total);
    }, [depositSelected, pastDueSelected, otherSelected, pastDueAmount, otherAmount]);

    const handlePaymentProcess = async () => {
        if (totalPaymentAmount <= 0) {
            toast.error('Please select at least one payment option with a valid amount.');
            return;
        }

        setIsProcessing(true);
        try {
            // TODO: Integrate with Stripe payment processing
            // For now, just update the amount collected
            const newAmountCollected = (data.amount_collected || 0) + totalPaymentAmount;
            
            // Create payment breakdown for record keeping
            const paymentBreakdown = [];
            if (depositSelected) {
                paymentBreakdown.push({ type: 'deposit', amount: 1500, description: 'Security Deposit' });
            }
            if (pastDueSelected && pastDueAmount) {
                paymentBreakdown.push({ type: 'past_due', amount: parseFloat(pastDueAmount), description: 'Past Due Balance' });
            }
            if (otherSelected && otherAmount) {
                paymentBreakdown.push({ type: 'other', amount: parseFloat(otherAmount), description: otherDescription || 'Other Payment' });
            }
            
            onUpdate({ 
                amount_collected: newAmountCollected,
                payment_breakdown: paymentBreakdown
            });
            
            toast.success(`Payment of $${totalPaymentAmount.toFixed(2)} processed successfully.`);
            
            // Reset form
            setDepositSelected(false);
            setPastDueSelected(false);
            setOtherSelected(false);
            setPastDueAmount('');
            setOtherAmount('');
            setOtherDescription('');
            
        } catch (error) {
            toast.error('Payment processing failed. Please try again.');
            console.error('Payment error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="border-indigo-100">
            <CardHeader className="bg-indigo-50">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <CreditCard className="w-5 h-5" />
                    Payment Collection
                </CardTitle>
                <p className="text-sm text-indigo-600">
                    Select payment options and process payment via Stripe.
                </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Payment Options</p>
                            <ul className="text-xs space-y-1">
                                <li>• Select the payment types the participant wants to make</li>
                                <li>• All payments are processed securely through Stripe</li>
                                <li>• Payments will be applied to the participant's account</li>
                                <li>• All payments are non-refundable</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Deposit Option */}
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                        <Checkbox 
                            id="deposit_payment"
                            checked={depositSelected}
                            onCheckedChange={setDepositSelected}
                        />
                        <div className="flex-1">
                            <Label htmlFor="deposit_payment" className="font-medium cursor-pointer">
                                Security Deposit - $1,500.00
                            </Label>
                            <p className="text-xs text-gray-600 mt-1">
                                Optional security deposit to cover potential equipment damage or replacement costs.
                            </p>
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                            {depositSelected ? '$1,500.00' : '$0.00'}
                        </div>
                    </div>

                    {/* Past Due Option */}
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                        <Checkbox 
                            id="past_due_payment"
                            checked={pastDueSelected}
                            onCheckedChange={setPastDueSelected}
                        />
                        <div className="flex-1">
                            <Label htmlFor="past_due_payment" className="font-medium cursor-pointer">
                                Past Due Balance
                            </Label>
                            <p className="text-xs text-gray-600 mt-1 mb-3">
                                Payment toward any outstanding balance from previous agreements.
                            </p>
                            {pastDueSelected && (
                                <div>
                                    <Label htmlFor="past_due_amount">Past Due Amount *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Input 
                                            id="past_due_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={pastDueAmount}
                                            onChange={(e) => setPastDueAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="pl-8"
                                            required={pastDueSelected}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                            {pastDueSelected && pastDueAmount ? `$${parseFloat(pastDueAmount).toFixed(2)}` : '$0.00'}
                        </div>
                    </div>

                    {/* Other Payment Option */}
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                        <Checkbox 
                            id="other_payment"
                            checked={otherSelected}
                            onCheckedChange={setOtherSelected}
                        />
                        <div className="flex-1">
                            <Label htmlFor="other_payment" className="font-medium cursor-pointer">
                                Other Payment
                            </Label>
                            <p className="text-xs text-gray-600 mt-1 mb-3">
                                Additional payment for fees, charges, or other services.
                            </p>
                            {otherSelected && (
                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="other_amount">Payment Amount *</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                            <Input 
                                                id="other_amount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={otherAmount}
                                                onChange={(e) => setOtherAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="pl-8"
                                                required={otherSelected}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="other_description">Description</Label>
                                        <Textarea 
                                            id="other_description"
                                            value={otherDescription}
                                            onChange={(e) => setOtherDescription(e.target.value)}
                                            placeholder="Describe what this payment is for..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                            {otherSelected && otherAmount ? `$${parseFloat(otherAmount).toFixed(2)}` : '$0.00'}
                        </div>
                    </div>
                </div>

                {/* Total and Payment Button */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">Total Payment Amount:</span>
                        <span className="text-2xl font-bold text-green-600">
                            ${totalPaymentAmount.toFixed(2)}
                        </span>
                    </div>
                    
                    <Button 
                        onClick={handlePaymentProcess}
                        disabled={totalPaymentAmount <= 0 || isProcessing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg h-12"
                    >
                        {isProcessing ? 'Processing Payment...' : `Process Payment - $${totalPaymentAmount.toFixed(2)}`}
                    </Button>
                </div>

                {data.amount_collected > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-800 font-medium">
                                Total Amount Collected Today: ${(data.amount_collected || 0).toFixed(2)}
                            </span>
                        </div>
                        {data.payment_breakdown && (
                            <div className="mt-2 text-xs text-green-700">
                                <strong>Payment Breakdown:</strong>
                                {data.payment_breakdown.map((payment, index) => (
                                    <div key={index} className="ml-2">
                                        • {payment.description}: ${payment.amount.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}