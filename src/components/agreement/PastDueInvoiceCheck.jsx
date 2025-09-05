import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { checkPastDue } from '@/api/functions/checkPastDue'; // This function will need to be created

export default function PastDueInvoiceCheck({ participantSsn, participantDob, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [pastDueAmount, setPastDueAmount] = useState(null);

    const handleCheck = async () => {
        if (!participantSsn || !participantDob) {
            toast.warning("Participant SSN and Date of Birth must be entered first.");
            return;
        }
        setIsLoading(true);
        try {
            // TODO: Replace with actual function call when 'checkPastDue' is implemented
            // const { data: result } = await checkPastDue({ ssn: participantSsn, dob: participantDob });
            // For now, simulate a result
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = { has_past_due: Math.random() > 0.5, amount: Math.floor(Math.random() * 200) + 50 };

            if (result.has_past_due) {
                setPastDueAmount(result.amount);
                onUpdate({ past_due_amount_found: result.amount });
                toast.error(`Past due balance found: $${result.amount.toFixed(2)}`);
            } else {
                setPastDueAmount(0);
                onUpdate({ past_due_amount_found: 0, past_due_payment_method: 'not_applicable' });
                toast.success("No past due balance found for this participant.");
            }
        } catch (error) {
            toast.error("Failed to check for past due invoices.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-orange-100">
            <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertCircle className="w-5 h-5" />
                    Past Due Balance Check
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-end gap-4">
                    <p className="text-sm text-gray-700 flex-1">
                        Use the participant's SSN and DOB (from Section 2) to check for any outstanding balances from previous agreements.
                    </p>
                    <Button onClick={handleCheck} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                        Check for Past Due Invoices
                    </Button>
                </div>
                {pastDueAmount !== null && (
                    <div className="p-4 rounded-lg border bg-white">
                        {pastDueAmount > 0 ? (
                            <div className="space-y-3">
                                <p className="font-bold text-red-600">
                                    Outstanding Balance Found: ${pastDueAmount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-800">
                                    This balance must be paid in full before the new ankle monitor can be installed and activated. Please confirm how the payment was settled.
                                </p>
                                <div>
                                    <Label className="font-medium">Payment Method for Past Due Balance:</Label>
                                    <RadioGroup onValueChange={(value) => onUpdate({ past_due_payment_method: value })} className="mt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cash" id="cash" />
                                            <Label htmlFor="cash">Paid in Cash</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="stripe" id="stripe" />
                                            <Label htmlFor="stripe">Paid via Stripe</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="other" id="other" />
                                            <Label htmlFor="other">Other Arrangements Made</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        ) : (
                             <p className="font-medium text-green-600">No outstanding balance was found.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}