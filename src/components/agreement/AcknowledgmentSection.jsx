
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollText } from 'lucide-react';

const acknowledgments = [
  {
    key: 'abide_restrictions',
    title: 'Restrictions & Conditions',
    text: 'I agree to abide by any restrictions or conditions ordered by the Court.'
  },
  {
    key: 'payments_advance',
    title: 'Required Payments',  
    text: 'I agree to make my required payments in advance. Non-payment is a violation of bond conditions, and I will be returned to jail. This includes weekly service fees, late fees, equipment fees, damaged equipment fees, installation fees, removal fees, and other misc. fees incurred.'
  },
  {
    key: 'charge_maintain',
    title: 'Charge & Maintain Device',
    text: 'I agree to charge and maintain the GPS ankle monitor device (1 Hour in the morning & 1 Hour in the evening) and any time that the GPS ankle monitor device indicates that the battery requires charging. Failure to properly charge the GPS ankle monitor device is a violation of bond conditions and I will be returned to jail.'
  },
  {
    key: 'gps_tracking',
    title: 'GPS Tracking & Data Sharing',
    text: 'I know that my location will be tracked using GPS technology. To ensure compliance with my bond condition or sentence, I will be monitored by a security/correctional, non-removable GPS ankle bracelet device which I agree to wear 24 hours a day for the entire period set forth by the court. Information collected by GPS technology will be shared with law enforcement authorities, court personnel, and used for training purposes. It may be necessary during the period of my bond condition or sentence for personnel to maintain or inspect the GPS ankle monitor device. On request, I agree to travel to Arkansas Ankle Monitor\'s office, a police department, or a county jail of Arkansas Ankle Monitor\'s choice for inspection, maintenance, or removal of the GPS ankle monitor device.'
  },
  {
    key: 'no_tamper',
    title: 'No Tampering',
    text: 'I understand that tampering with/or removing the GPS ankle monitor device will result in me being returned to jail.'
  },
  {
    key: 'rules_explained',
    title: 'Rules Explained',
    text: 'I acknowledge that all these rules have been explained to me and that non-compliance with any of these restrictions or rules may result in my return to jail.'
  },
  {
    key: 'weekly_rate_terms',
    title: 'Weekly Rate & Fee Terms',
    text: 'I understand the monitoring rate is a weekly recurring fee, that a one-time installation fee and a first prorated week\'s fee are due at installation, and that late payments will incur additional fees.'
  },
];

const EquipmentLiabilityStatement = {
  key: 'equipment_liability',
  title: 'Equipment Liability & Fee Statement',
  text: `I understand that I accept responsibility for the care of the GPS ankle monitor device and any equipment belonging to Arkansas Ankle Monitor and will return said equipment and device at the end of my sentence/bond terms in good working order. The daily fee will continue until the equipment is returned, (this includes the GPS ankle monitor device, charger, strap, & dust cap.) If the equipment is not returned or is returned in unacceptable conditions, I am responsible for the cost of replacement equipment which is $1,495.00 and will be subject to additional criminal prosecution by the State of Arkansas which will be in the form of felony charges. Replacement chargers are $125.00 and must be picked up at a location chosen by Arkansas Ankle Monitor BEFORE the GPS ankle monitor device battery is depleted. All weekly fees are due on or before Friday at 4PM central time. The payment process has been explained to me and I understand that I will make the required payments. A $50 fee per week will be added for any late payment. All fees are non-refundable, even if the GPS ankle monitor device is removed early by court order. *Removal of the GPS ankle monitor device at the end of the court sentence or bond requirement will be performed at a location chosen by Arkansas Ankle Monitor.`
};

export default function AcknowledgmentSection({ formData, onChange }) {
  const renderAck = (item) => { // Removed 'index' from parameters as it's not used for numbering anymore.
    const ackKey = `ack_${item.key}`;
    const initKey = `init_${item.key}`;
    
    return (
      <div key={item.key} className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id={ackKey}
            checked={formData[ackKey] || false}
            onCheckedChange={(checked) => onChange(ackKey, checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor={ackKey} className="font-medium text-gray-800 cursor-pointer">
              {item.title}
            </Label>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap"> {/* Added whitespace-pre-wrap */}
              {item.text}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 ml-6">
          <Label htmlFor={initKey} className="text-sm font-medium text-gray-700">
            Your Initials:
          </Label>
          <Input
            id={initKey}
            value={formData[initKey] || ''}
            onChange={(e) => onChange(initKey, e.target.value.toUpperCase())}
            placeholder="AB"
            maxLength={4}
            pattern="[A-Za-z]{2,4}"
            className="w-16 text-center font-mono"
            disabled={!formData[ackKey]}
          />
        </div>
      </div>
    );
  };
  
  return (
    <Card className="border-purple-100">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <ScrollText className="w-5 h-5" />
          Terms & Acknowledgments
        </CardTitle>
        <p className="text-sm text-purple-600 mt-1">
          Please read each statement carefully, check the box, and provide your initials to acknowledge understanding.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {acknowledgments.map(renderAck)}
          {renderAck(EquipmentLiabilityStatement)}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Legal Notice:</strong> By checking each box and providing your initials, you acknowledge that you have read, 
            understood, and agree to be bound by each term. This agreement is legally binding and will be submitted to the court 
            and monitoring authorities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
