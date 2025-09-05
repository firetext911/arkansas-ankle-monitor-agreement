
import React, { useState, useEffect } from 'react';

const DAILY_RATE = 10;
const WEEKLY_RATE = 80;
const PROCESSING_FEE = 10;

// Date helpers
const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
const fmtDateISO = (d) => d.toISOString().slice(0, 10);

const getNextSaturday = (from) => {
    const d = new Date(from);
    const daysUntilSaturday = (6 - d.getDay() + 7) % 7;
    if (daysUntilSaturday === 0) {
        // If today is Saturday, get next Saturday
        d.setDate(d.getDate() + 7);
    } else {
        d.setDate(d.getDate() + daysUntilSaturday);
    }
    return d;
};

const getFridayOfWeek = (from) => {
    const d = new Date(from);
    const dayOfWeek = d.getDay();
    const daysUntilFriday = dayOfWeek === 6 ? 6 : (5 - dayOfWeek + 7) % 7;
    d.setDate(d.getDate() + daysUntilFriday);
    return d;
};

const getMondayOfWeek = (from) => {
    const d = new Date(from);
    const dayOfWeek = d.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (1 - dayOfWeek + 7) % 7;
    d.setDate(d.getDate() + daysUntilMonday);
    return d;
};

const getFridayOfSameWeek = (monday) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 4); // Monday + 4 days = Friday
    return d;
};

export default function BillingPreview({ installDate, onUpdate }) {
    const [display, setDisplay] = useState({
        firstAmount: '$—',
        coverage: 'Paid thru —',
        nextInvoiceText: '—',
        nextThreeWeeks: []
    });

    useEffect(() => {
        if (!installDate) {
            setDisplay({ 
                firstAmount: '$—', 
                coverage: 'Paid thru —', 
                nextInvoiceText: '—',
                nextThreeWeeks: []
            });
            return;
        }

        const install = new Date(installDate + "T12:00:00");
        const dayOfWeek = install.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        
        let firstInvoiceAmount = 0;
        let coverageEndDate = null;
        
        if (dayOfWeek === 6) {
            // Saturday installation - charge for Saturday through Friday (7 days) + processing
            firstInvoiceAmount = 70 + PROCESSING_FEE; // $70 for 7 days + $10 processing = $80
            const fridayOfSameWeek = getFridayOfWeek(install);
            coverageEndDate = fridayOfSameWeek;
        } else {
            // Sunday through Friday installation
            const fridayOfInstallWeek = getFridayOfWeek(install);
            const daysInCurrentWeek = Math.floor((fridayOfInstallWeek - install) / (1000 * 60 * 60 * 24)) + 1;
            
            // Calculate: current week days + prepayment for next week + processing
            const dailyCharges = daysInCurrentWeek * DAILY_RATE;
            const prepaymentForNextWeek = 70; // Based on your examples, this seems to be $70, not $80
            firstInvoiceAmount = dailyCharges + prepaymentForNextWeek + PROCESSING_FEE;
            
            // Coverage goes through Friday of next week
            const nextSaturday = getNextSaturday(install);
            coverageEndDate = getFridayOfWeek(nextSaturday);
        }
        
        // Next invoice details - issued on Monday BEFORE the coverage week, due Friday
        const firstRecurringCoverageSaturday = new Date(coverageEndDate);
        firstRecurringCoverageSaturday.setDate(firstRecurringCoverageSaturday.getDate() + 1);
        
        const mondayBeforeCoverage = getMondayOfWeek(firstRecurringCoverageSaturday);
        mondayBeforeCoverage.setDate(mondayBeforeCoverage.getDate() - 7);
        
        const fridayDue = getFridayOfSameWeek(mondayBeforeCoverage);
        
        // Calculate next three weeks, starting from the first recurring invoice
        const nextThreeWeeks = [];
        for (let i = 1; i < 4; i++) {
            const coverageWeekStart = new Date(firstRecurringCoverageSaturday);
            coverageWeekStart.setDate(coverageWeekStart.getDate() + (i * 7));
            const coverageWeekEnd = new Date(coverageWeekStart);
            coverageWeekEnd.setDate(coverageWeekEnd.getDate() + 6);
            
            const invoiceMonday = new Date(coverageWeekStart);
            invoiceMonday.setDate(invoiceMonday.getDate() - 7);
            invoiceMonday.setDate(invoiceMonday.getDate() - (invoiceMonday.getDay() - 1));
            
            const invoiceFriday = new Date(invoiceMonday);
            invoiceFriday.setDate(invoiceFriday.getDate() + 4);
            
            nextThreeWeeks.push({
                invoiceDate: fmtDate(invoiceMonday),
                covers: `${fmtDate(coverageWeekStart)} - ${fmtDate(coverageWeekEnd)}`,
                dueDate: fmtDate(invoiceFriday),
                amount: '$80'
            });
        }
        
        const coverageText = `Paid thru ${fmtDate(coverageEndDate)}`;
        const nextInvoiceText = dayOfWeek === 6 ? 
            `$80 invoice on ${fmtDate(mondayBeforeCoverage)}, due ${fmtDate(fridayDue)}, covers ${fmtDate(firstRecurringCoverageSaturday)} - ${fmtDate(new Date(firstRecurringCoverageSaturday.getTime() + 6 * 24 * 60 * 60 * 1000))}` :
            `$80 invoice on ${fmtDate(mondayBeforeCoverage)}, due ${fmtDate(fridayDue)}, covers ${fmtDate(firstRecurringCoverageSaturday)} - ${fmtDate(new Date(firstRecurringCoverageSaturday.getTime() + 6 * 24 * 60 * 60 * 1000))}`;
        
        setDisplay({
            firstAmount: `$${firstInvoiceAmount}`,
            coverage: coverageText,
            nextInvoiceText: nextInvoiceText,
            nextThreeWeeks: nextThreeWeeks
        });

        onUpdate({
            first_invoice_amount: firstInvoiceAmount,
            coverage_through_date: fmtDateISO(coverageEndDate),
            next_invoice_amount: WEEKLY_RATE,
            next_invoice_date: fmtDateISO(mondayBeforeCoverage),
            next_invoice_due_date: fmtDateISO(fridayDue),
        });

    }, [installDate, onUpdate]);

    return (
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mt-6 text-sm">
            <h4 className="font-semibold text-blue-800 mb-3">Automated Billing Calculation</h4>
            <div className="space-y-2">
                <div>
                    <strong className="text-gray-700">First invoice (due within 24 hours):</strong>
                    <span className="font-medium ml-2 text-gray-900">{display.firstAmount}</span>
                </div>
                <div className="text-xs text-gray-600">
                    Calculate as: $10/day from install date → Friday + $10 processing fee + $70 prepayment for following Saturday–Friday cycle
                </div>
                <div className="text-xs text-gray-600">{display.coverage}</div>
                <div className="mt-2">
                    <strong className="text-gray-700">Next weekly invoice:</strong>
                    <span className="ml-2 text-gray-800">{display.nextInvoiceText}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                    <strong>Invoicing Schedule:</strong> Invoices issued Monday, due Friday (5 business days to pay), covers following Saturday-Friday
                </div>
                <div className="text-xs text-gray-600">
                    Late fee: $50 after Friday at 11:59 PM (may vary by jurisdiction, state, or residence)
                </div>
                
                {display.nextThreeWeeks.length > 0 && (
                    <div className="mt-4 p-3 bg-white rounded border">
                        <h5 className="font-medium text-gray-800 mb-2">Next Three Weekly Invoices:</h5>
                        <div className="space-y-1 text-xs">
                            {display.nextThreeWeeks.map((week, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>Invoice {week.invoiceDate}: {week.amount}</span>
                                    <span className="text-gray-600">due {week.dueDate}, covers {week.covers}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
