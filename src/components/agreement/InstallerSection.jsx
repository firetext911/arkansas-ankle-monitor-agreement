
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Gavel, Phone, Calendar, Clock, DollarSign } from 'lucide-react'; // Added DollarSign
import { format } from 'date-fns';

export default function InstallerSection({ data, onUpdate }) {
  const handleDateChange = (e) => {
    const date = e.target.value;
    // Get current time in HH:mm format for the install_time
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    onUpdate({ install_date: date, install_time: time });
  };
    
  return (
    <div className="space-y-6">
        <Card className="border-blue-100">
            <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <User className="w-5 h-5" />
                    Agent Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="installer_name">Agent Name *</Label>
                        <Input 
                            id="installer_name" 
                            value={data.installer_name || ''} 
                            onChange={(e) => onUpdate({ installer_name: e.target.value })} 
                            required 
                        />
                    </div>
                    <div>
                        <Label htmlFor="installer_phone">Agent Phone</Label>
                        <Input 
                            id="installer_phone" 
                            value={data.installer_phone || ''} 
                            onChange={(e) => onUpdate({ installer_phone: e.target.value })} 
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="border-purple-100">
            <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Settings className="w-5 h-5" />
                    Device Setup
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4"> {/* Adjusted layout start */}
                    <div>
                        <Label htmlFor="device_number">Device Number *</Label>
                        <Input 
                            id="device_number" 
                            value={data.device_number || ''} 
                            onChange={(e) => onUpdate({ device_number: e.target.value.replace(/\D/g, '').slice(0, 8) })} 
                            maxLength={8} 
                            required 
                            className="font-mono text-lg tracking-widest"
                        />
                    </div>

                    <div>
                        <Label htmlFor="install_date">Install Date</Label>
                        <Input 
                            id="install_date"
                            type="date"
                            value={data.install_date || ''}
                            onChange={handleDateChange}
                        />
                        {data.install_date && (
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    {/* Append 'T00:00:00' to ensure date is parsed consistently across time zones */}
                                    <span>{format(new Date(data.install_date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>Time: {data.install_time}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div> {/* Adjusted layout end */}
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-start gap-3">
                        <Checkbox 
                            id="dispatch_confirmed" 
                            checked={data.dispatch_confirmed || false} 
                            onCheckedChange={(checked) => onUpdate({ dispatch_confirmed: checked })} 
                        />
                        <div className="flex-1">
                            <Label htmlFor="dispatch_confirmed" className="font-medium text-amber-800 cursor-pointer">
                                Activation Completed *
                            </Label>
                            <p className="text-xs text-amber-700 mt-1">
                                I confirm I have called dispatch to activate this device and got verification of communication.
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="ml-auto flex-shrink-0"
                        >
                            <a href="tel:8709199738">
                                <Phone className="w-4 h-4 mr-1" />
                                Call 870-919-9738
                            </a>
                        </Button>
                    </div>
                    {data.dispatch_confirmed && (
                        <div>
                            <Label htmlFor="dispatch_representative">Dispatch Representative Name</Label>
                            <Input 
                                id="dispatch_representative" 
                                value={data.dispatch_representative || ''} 
                                onChange={(e) => onUpdate({ dispatch_representative: e.target.value })} 
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card className="border-indigo-100">
            <CardHeader className="bg-indigo-50">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <DollarSign className="w-5 h-5" />
                    Payment Responsibility
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <Label className="text-base font-medium text-gray-800 mb-3 block">Who will be responsible for payments? *</Label>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <input
                                type="radio"
                                id="self_pay"
                                name="payment_type"
                                value="self_pay"
                                checked={data.payment_type === 'self_pay' || !data.payment_type}
                                onChange={(e) => onUpdate({ payment_type: e.target.value, paying_agency_name: '' })}
                                className="w-4 h-4 text-indigo-600"
                            />
                            <Label htmlFor="self_pay" className="cursor-pointer">
                                <span className="font-medium">Self Pay</span> - Participant will pay directly
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <input
                                type="radio"
                                id="agency_pay"
                                name="payment_type"
                                value="agency_pay"
                                checked={data.payment_type === 'agency_pay'}
                                onChange={(e) => onUpdate({ payment_type: e.target.value })}
                                className="w-4 h-4 text-indigo-600"
                            />
                            <Label htmlFor="agency_pay" className="cursor-pointer">
                                <span className="font-medium">Agency Pay</span> - Government agency or organization will pay
                            </Label>
                        </div>
                    </div>
                    
                    {data.payment_type === 'agency_pay' && (
                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <Label htmlFor="paying_agency_name">Paying Agency/Organization Name *</Label>
                            <Input 
                                id="paying_agency_name" 
                                value={data.paying_agency_name || ''} 
                                onChange={(e) => onUpdate({ paying_agency_name: e.target.value })} 
                                required={data.payment_type === 'agency_pay'}
                                placeholder="e.g., Arkansas Department of Community Correction, City of Little Rock"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        
        <Card className="border-orange-100">
            <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Gavel className="w-5 h-5" />
                    Court & Legal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <Label htmlFor="court_name">Court Name *</Label>
                    <Input 
                        id="court_name" 
                        value={data.court_name || ''} 
                        onChange={(e) => onUpdate({ court_name: e.target.value })} 
                        required 
                    />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="probation_officer">Probation Officer</Label>
                        <Input 
                            id="probation_officer" 
                            value={data.probation_officer || ''} 
                            onChange={(e) => onUpdate({ probation_officer: e.target.value })} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="probation_officer_contact">Probation Officer Contact</Label>
                        <Input 
                            id="probation_officer_contact" 
                            value={data.probation_officer_contact || ''} 
                            onChange={(e) => onUpdate({ probation_officer_contact: e.target.value })} 
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <Label htmlFor="bonding_company">Bonding Company (if applicable)</Label>
                            <Input 
                                id="bonding_company" 
                                value={data.bonding_company || ''} 
                                onChange={(e) => onUpdate({ bonding_company: e.target.value })} 
                            />
                        </div>
                        <div className="md:col-span-1">
                            <Label htmlFor="bondsman_name">Bondsman Name</Label>
                            <Input 
                                id="bondsman_name" 
                                value={data.bondsman_name || ''} 
                                onChange={(e) => onUpdate({ bondsman_name: e.target.value })} 
                            />
                        </div>
                        <div className="md:col-span-1">
                            <Label htmlFor="bondsman_contact">Bondsman Contact</Label>
                            <Input 
                                id="bondsman_contact" 
                                value={data.bondsman_contact || ''} 
                                onChange={(e) => onUpdate({ bondsman_contact: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <Checkbox 
                                id="has_cosigner" 
                                checked={data.has_cosigner || false} 
                                onCheckedChange={(checked) => onUpdate({ has_cosigner: checked })} 
                            />
                            <div>
                                <Label htmlFor="has_cosigner" className="font-medium text-blue-800 cursor-pointer">
                                    Someone cosigned the bond
                                </Label>
                                <p className="text-xs text-blue-700 mt-1">
                                    Check this if someone cosigned or guaranteed the bond.
                                </p>
                            </div>
                        </div>
                        {data.has_cosigner && (
                            <div className="grid md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <Label htmlFor="cosigner_name">Cosigner Name *</Label>
                                    <Input 
                                        id="cosigner_name" 
                                        value={data.cosigner_name || ''} 
                                        onChange={(e) => onUpdate({ cosigner_name: e.target.value })} 
                                        required={data.has_cosigner}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cosigner_phone">Cosigner Phone *</Label>
                                    <Input 
                                        id="cosigner_phone" 
                                        value={data.cosigner_phone || ''} 
                                        onChange={(e) => onUpdate({ cosigner_phone: e.target.value })} 
                                        required={data.has_cosigner}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cosigner_relationship">Relationship *</Label>
                                    <Input 
                                        id="cosigner_relationship" 
                                        value={data.cosigner_relationship || ''} 
                                        onChange={(e) => onUpdate({ cosigner_relationship: e.target.value })} 
                                        required={data.has_cosigner}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div>
                    <Label htmlFor="conditions_text">Charges / Court Conditions</Label>
                    <Textarea 
                        id="conditions_text" 
                        value={data.conditions_text || ''} 
                        onChange={(e) => onUpdate({ conditions_text: e.target.value })} 
                        rows={3}
                    />
                </div>
                <div>
                    <Label htmlFor="restrictions">Movement Restrictions (e.g., House Arrest, Curfew)</Label>
                    <Textarea 
                        id="restrictions" 
                        value={data.restrictions || ''} 
                        onChange={(e) => onUpdate({ restrictions: e.target.value })} 
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
