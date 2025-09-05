
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, FileText, Eye, EyeOff, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const acknowledgments = [
  { key: 'abide_restrictions', title: 'I agree to abide by any restrictions or conditions ordered by the Court.' },
  { key: 'payments_advance', title: 'I agree to make my required payments in advance.', selfPayOnly: true },
  { key: 'charge_maintain', title: 'I agree to charge and maintain the GPS ankle monitor device (1 hour in the morning and 1 hour in the evening) and any time that the GPS ankle monitor device indicates that the battery requires charging.' },
  { key: 'gps_tracking', title: 'I know that my location will be tracked using GPS technology and data will be shared with authorities.' },
  { key: 'no_tamper', title: 'I understand that tampering with the device will result in me being returned to jail and charges could be filed.' },
  { key: 'rules_explained', title: 'I acknowledge that all program rules have been explained to me.' },
  { key: 'equipment_liability', title: 'I accept responsibility for the care of the equipment and agree to the replacement cost if lost or damaged. Monitor replacement: $1,495, Charger replacement: $125, Strap replacement: $250, Inspection fees: $100.' },
  { key: 'weekly_rate_terms', title: 'I understand the $80 weekly rate is paid for the next week in advance, the installation & removal fee is separate, and late fees are based on jurisdiction, state, or residence.', selfPayOnly: true },
  { key: 'revocation_conditions', title: 'I understand that if I tamper with the device or fail to comply, my bond may be revoked immediately.' }
];

const Dropdown = ({ label, placeholder, value, onValueChange, children }) => (
    <div>
        <Label>{label}</Label>
        <Select value={value || ''} onValueChange={onValueChange}>
            <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
            <SelectContent>{children}</SelectContent>
        </Select>
    </div>
);

export default function OffenderSection({ data, onUpdate }) {
    const [isSsnVisible, setIsSsnVisible] = useState(false);
    const [age, setAge] = useState(null);
    const [isZipLookingUp, setIsZipLookingUp] = useState(false);

    useEffect(() => {
        if (data.dob) {
            const calculatedAge = Math.floor((new Date() - new Date(data.dob).getTime()) / 3.15576e+10);
            setAge(calculatedAge);
        } else {
            setAge(null);
        }
    }, [data.dob]);

    const handleZipCodeChange = async (zipCode) => {
        onUpdate({ zip: zipCode });
        
        if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
            setIsZipLookingUp(true);
            try {
                // Use a free ZIP code API to lookup city, state, county
                const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
                if (response.ok) {
                    const data = await response.json();
                    const place = data.places[0];
                    
                    onUpdate({
                        zip: zipCode,
                        city: place['place name'],
                        state: place['state abbreviation'],
                        county: '' // Clear county field as API doesn't provide county data, must be manually entered
                    });
                } else {
                    // If ZIP not found, just clear the fields but keep the ZIP
                    console.log('ZIP code not found in database');
                    onUpdate({
                        city: '',
                        state: '',
                        county: ''
                    });
                }
            } catch (error) {
                console.error('ZIP lookup failed:', error);
                // Optionally clear fields on network error too
                onUpdate({
                    city: '',
                    state: '',
                    county: ''
                });
            } finally {
                setIsZipLookingUp(false);
            }
        } else if (zipCode.length < 5 || !/^\d*$/.test(zipCode)) {
            // Clear city, state, county if zip is incomplete or invalid format
            onUpdate({
                city: '',
                state: '',
                county: ''
            });
        }
    };

    const handleInitial = (key, value) => {
        onUpdate({ [key]: value.toUpperCase().slice(0, 4) });
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-gray-600" />Participant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="full_name">Full Legal Name *</Label><Input id="full_name" value={data.full_name || ''} onChange={e => onUpdate({ full_name: e.target.value})} required /></div>
                        <div>
                            <Label htmlFor="dob">Date of Birth *</Label>
                            <Input id="dob" type="date" value={data.dob || ''} onChange={e => onUpdate({ dob: e.target.value })} required />
                            {age !== null && (
                                <p className="text-sm text-gray-600 mt-1">Age: {age} years old</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="phone">Phone *</Label><Input id="phone" value={data.phone || ''} onChange={e => onUpdate({ phone: e.target.value })} required /></div>
                        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={data.email || ''} onChange={e => onUpdate({ email: e.target.value })} /></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label htmlFor="additional_phone">Additional Phone</Label><Input id="additional_phone" value={data.additional_phone || ''} onChange={e => onUpdate({ additional_phone: e.target.value })} /></div>
                        <div><Label htmlFor="additional_email">Additional Email</Label><Input id="additional_email" type="email" value={data.additional_email || ''} onChange={e => onUpdate({ additional_email: e.target.value })} /></div>
                    </div>
                    
                    <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input id="address" value={data.address || ''} onChange={e => onUpdate({ address: e.target.value })} required placeholder="123 Main Street" />
                    </div>
                    
                    <div>
                        <Label htmlFor="address_line2">Apartment, Suite, or Unit (Optional)</Label>
                        <Input id="address_line2" value={data.address_line2 || ''} onChange={e => onUpdate({ address_line2: e.target.value })} placeholder="Apt 4B, Suite 200, Unit A, etc." />
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-2">
                            <Label htmlFor="zip">ZIP Code *</Label>
                            <div className="relative">
                                <Input 
                                    id="zip" 
                                    value={data.zip || ''} 
                                    onChange={e => handleZipCodeChange(e.target.value)} 
                                    required 
                                    maxLength={5}
                                    placeholder="72801"
                                />
                                {isZipLookingUp && (
                                    <div className="absolute right-2 top-2">
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-4">
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" value={data.city || ''} onChange={e => onUpdate({ city: e.target.value })} required />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="state">State *</Label>
                            <Input id="state" value={data.state || ''} onChange={e => onUpdate({ state: e.target.value.toUpperCase() })} required maxLength={2} placeholder="AR" />
                        </div>
                        <div className="col-span-4">
                            <Label htmlFor="county">County *</Label>
                            <Input id="county" value={data.county || ''} onChange={e => onUpdate({ county: e.target.value })} required placeholder="Washington County" />
                        </div>
                    </div>
                    
                    {data.zip && data.zip.length === 5 && (
                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            <p>💡 City and state are auto-populated from ZIP code. Please manually enter the county and verify all information is correct.</p>
                        </div>
                    )}
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Checkbox 
                                id="lives_over_50_miles"
                                checked={data.lives_over_50_miles || false}
                                onCheckedChange={(checked) => onUpdate({ lives_over_50_miles: checked })}
                            />
                            <div>
                                <Label htmlFor="lives_over_50_miles" className="font-medium text-amber-800 cursor-pointer">
                                    Participant lives more than 50 miles from installation location
                                </Label>
                                <p className="text-xs text-amber-700 mt-1">
                                    Check this box if the participant's residence is more than 50 miles away from where the device was installed. This may affect service fees and scheduling.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-gray-600" />Participant Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                         <div>
                            <Label htmlFor="ssn">Social Security Number {age === null || age >= 18 ? '*' : ''}</Label>
                            <div className="relative">
                                <Input 
                                    id="ssn" 
                                    type={isSsnVisible ? 'text' : 'password'}
                                    value={data.ssn || ''} 
                                    onChange={e => onUpdate({ ssn: e.target.value })} 
                                    className="pr-10 font-mono"
                                    required={age === null || age >= 18}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute inset-y-0 right-0 h-full px-3"
                                    onClick={() => setIsSsnVisible(!isSsnVisible)}
                                >
                                    {isSsnVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                         </div>
                         <Dropdown label="Race" placeholder="Select Race" value={data.race} onValueChange={v => onUpdate({ race: v })}>
                            <SelectItem value="Caucasian">Caucasian</SelectItem>
                            <SelectItem value="African American">African American</SelectItem>
                            <SelectItem value="Hispanic">Hispanic</SelectItem>
                            <SelectItem value="Asian">Asian</SelectItem>
                            <SelectItem value="Native American">Native American</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </Dropdown>
                         <Dropdown label="Gender" placeholder="Select Gender" value={data.gender} onValueChange={v => onUpdate({ gender: v })}>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </Dropdown>
                    </div>
                     <div className="grid md:grid-cols-4 gap-4">
                        <Dropdown label="Hair Color" placeholder="Select Hair Color" value={data.hair} onValueChange={v => onUpdate({ hair: v })}>
                            <SelectItem value="Black">Black</SelectItem>
                            <SelectItem value="Brown">Brown</SelectItem>
                            <SelectItem value="Blonde">Blonde</SelectItem>
                            <SelectItem value="Red">Red</SelectItem>
                            <SelectItem value="Gray">Gray</SelectItem>
                            <SelectItem value="Bald">Bald</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </Dropdown>
                        <Dropdown label="Eye Color" placeholder="Select Eye Color" value={data.eyes} onValueChange={v => onUpdate({ eyes: v })}>
                            <SelectItem value="Brown">Brown</SelectItem>
                            <SelectItem value="Blue">Blue</SelectItem>
                            <SelectItem value="Green">Green</SelectItem>
                            <SelectItem value="Hazel">Hazel</SelectItem>
                            <SelectItem value="Gray">Gray</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </Dropdown>
                        <div><Label htmlFor="height">Height (e.g., 5'11")</Label><Input id="height" value={data.height || ''} onChange={e => onUpdate({ height: e.target.value })} /></div>
                        <div><Label htmlFor="weight">Weight (lbs)</Label><Input id="weight" value={data.weight || ''} onChange={e => onUpdate({ weight: e.target.value })} /></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-600" />Emergency Contacts & References</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">Please provide three references who can be contacted if needed.</p>
                    
                    <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">Reference #1</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div><Label htmlFor="reference_1_name">Full Name</Label><Input id="reference_1_name" value={data.reference_1_name || ''} onChange={e => onUpdate({ reference_1_name: e.target.value })} /></div>
                                <div><Label htmlFor="reference_1_relation">Relationship</Label><Input id="reference_1_relation" value={data.reference_1_relation || ''} onChange={e => onUpdate({ reference_1_relation: e.target.value })} placeholder="e.g., Mother, Friend, Employer" /></div>
                                <div><Label htmlFor="reference_1_phone">Phone Number</Label><Input id="reference_1_phone" value={data.reference_1_phone || ''} onChange={e => onUpdate({ reference_1_phone: e.target.value })} /></div>
                            </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">Reference #2</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div><Label htmlFor="reference_2_name">Full Name</Label><Input id="reference_2_name" value={data.reference_2_name || ''} onChange={e => onUpdate({ reference_2_name: e.target.value })} /></div>
                                <div><Label htmlFor="reference_2_relation">Relationship</Label><Input id="reference_2_relation" value={data.reference_2_relation || ''} onChange={e => onUpdate({ reference_2_relation: e.target.value })} placeholder="e.g., Father, Sibling, Coworker" /></div>
                                <div><Label htmlFor="reference_2_phone">Phone Number</Label><Input id="reference_2_phone" value={data.reference_2_phone || ''} onChange={e => onUpdate({ reference_2_phone: e.target.value })} /></div>
                            </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">Reference #3</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div><Label htmlFor="reference_3_name">Full Name</Label><Input id="reference_3_name" value={data.reference_3_name || ''} onChange={e => onUpdate({ reference_3_name: e.target.value })} /></div>
                                <div><Label htmlFor="reference_3_relation">Relationship</Label><Input id="reference_3_relation" value={data.reference_3_relation || ''} onChange={e => onUpdate({ reference_3_relation: e.target.value })} placeholder="e.g., Spouse, Neighbor, Pastor" /></div>
                                <div><Label htmlFor="reference_3_phone">Phone Number</Label><Input id="reference_3_phone" value={data.reference_3_phone || ''} onChange={e => onUpdate({ reference_3_phone: e.target.value })} /></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-gray-600" />Employment & Income Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Dropdown label="Payment Type" placeholder="Select Payment Type" value={data.payment_type} onValueChange={v => onUpdate({ payment_type: v })}>
                        <SelectItem value="self_pay">Self Pay</SelectItem>
                        <SelectItem value="agency_pay">Agency Pay</SelectItem>
                    </Dropdown>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Dropdown label="Employment Status" placeholder="Select Status" value={data.employment_status} onValueChange={v => onUpdate({ employment_status: v })}>
                            <SelectItem value="Employed">Employed</SelectItem>
                            <SelectItem value="Unemployed">Unemployed</SelectItem>
                            <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                            <SelectItem value="Retired">Retired</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Disabled">Disabled</SelectItem>
                        </Dropdown>
                        
                        <Dropdown label="Pay Frequency" placeholder="How often are you paid?" value={data.pay_frequency} onValueChange={v => onUpdate({ pay_frequency: v })}>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi_weekly">Bi-Weekly (Every 2 weeks)</SelectItem>
                            <SelectItem value="twice_monthly">Twice Monthly (e.g., 1st & 15th)</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="not_applicable">Not Applicable</SelectItem>
                        </Dropdown>
                    </div>
                    
                    <div>
                        <Label htmlFor="income_source">Primary Income Source</Label>
                        <Input id="income_source" value={data.income_source || ''} onChange={e => onUpdate({ income_source: e.target.value })} placeholder="e.g., Salary, Social Security, Disability" />
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="font-medium mb-2">Acknowledgments & Terms</h3>
                <div className="space-y-4">
                    {acknowledgments
                        .filter(ack => !ack.selfPayOnly || data.payment_type !== 'agency_pay')
                        .map(ack => (
                        <div key={ack.key} className="p-3 border rounded-lg bg-gray-50">
                           <div className="flex items-start gap-3">
                                <Checkbox id={`ack_${ack.key}`} checked={!!data[`ack_${ack.key}`]} onCheckedChange={c => onUpdate({ [`ack_${ack.key}`]: c })} />
                                <Label htmlFor={`ack_${ack.key}`} className="flex-1 text-sm leading-relaxed">{ack.title}</Label>
                           </div>
                           <div className="mt-2 ml-7">
                                <Input
                                    id={`init_${ack.key}`}
                                    placeholder="Initials"
                                    className="w-24 h-8 text-center"
                                    value={data[`init_${ack.key}`] || ''}
                                    onChange={e => handleInitial(`init_${ack.key}`, e.target.value)}
                                    disabled={!data[`ack_${ack.key}`]}
                                />
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
