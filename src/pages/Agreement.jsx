
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AgreementSubmission } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { CheckCircle, MapPin, Monitor, Clock } from 'lucide-react';

import CollapsibleSection from '../components/agreement/CollapsibleSection';
import InstallerSection from '../components/agreement/InstallerSection';
import OffenderSection from '../components/agreement/OffenderSection';
import FinancialSection from '../components/agreement/FinancialSection';
import PaymentSection from '../components/agreement/PaymentSection';
import SignatureCapture from '../components/agreement/SignatureCapture';
import FileUploadSection from '../components/agreement/FileUploadSection';
import LoadingSpinner from '../components/agreement/LoadingSpinner';
import LocationPermissionWarning from '../components/LocationPermissionWarning';

import { saveInstallerStep } from '@/api/supabaseFunctions';
import { submitAgreementToComply } from '@/api/supabaseFunctions';

const defaultFormData = {
    status: "draft",
    installer_name: "",
    device_number: "",
    dispatch_confirmed: false,
    court_name: "",
    weekly_rate: 80.00,
    install_removal_fee: 100.00,
    amount_collected: 0.00,
    full_name: "",
    dob: "",
    phone: "",
    address: "",
    city: "",
    state: "Arkansas",
    zip: "",
    ssn: "", // New field for Social Security Number
    signature_png: "",
    guardian_signature_png: "", // New field for guardian's signature
    guardian_printed_name: "",  // New field for guardian's printed name
    guardian_relationship: "",  // New field for guardian's relationship
    agent_signature_png: "",    // New field for agent's signature
    uploaded_files: [],         // New field for uploaded files
    signed_date: new Date().toISOString().split('T')[0],
    payment_type: "self_pay", // Added: 'self_pay' or 'agency_pay'
};

export default function AgreementPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [recordId, setRecordId] = useState(null);
    const [formData, setFormData] = useState(defaultFormData);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [auditData, setAuditData] = useState(null);

    useEffect(() => {
        const loadExistingRecord = async (id) => {
            setLoading(true);
            try {
                const loadedData = await AgreementSubmission.getById(id);
                if (loadedData) {
                    if (loadedData.status === 'signed') {
                        setIsSuccess(true);
                    } else {
                        // Merge loaded data with default to ensure all fields exist
                        setFormData(prev => ({ ...defaultFormData, ...prev, ...loadedData }));
                    }
                } else {
                    toast.error('Agreement not found. Starting a new form.');
                    setSearchParams({});
                    setFormData(defaultFormData); // Reset to default if not found
                }
            } catch (err) {
                toast.error('Failed to load agreement data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const id = searchParams.get('id');
        if (id) {
            setRecordId(id);
            loadExistingRecord(id);
        } else {
            setLoading(false);
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        // Capture client-side audit information
        const captureAuditData = async () => {
            const auditInfo = {
                user_agent: navigator.userAgent,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                platform: navigator.platform,
                language: navigator.language,
                geolocation_permission: 'pending'
            };

            // Request geolocation
            if (navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            timeout: 10000,
                            enableHighAccuracy: true
                        });
                    });
                    
                    auditInfo.geolocation_lat = position.coords.latitude;
                    auditInfo.geolocation_lon = position.coords.longitude;
                    auditInfo.geolocation_accuracy = position.coords.accuracy;
                    auditInfo.geolocation_permission = 'granted';
                } catch (error) {
                    auditInfo.geolocation_permission = 'denied';
                    console.log('Geolocation denied or unavailable:', error.message);
                }
            } else {
                auditInfo.geolocation_permission = 'not_supported';
            }

            setAuditData(auditInfo);
        };

        captureAuditData();
    }, []);

    const handleUpdate = (update) => {
        setFormData(prev => ({ ...prev, ...update }));
    };

    const validateForm = () => {
        // Add all validations here
        const requiredFields = {
            'Agent Name': formData.installer_name,
            'Device Number': formData.device_number,
            'Court Name': formData.court_name,
            'Participant Name': formData.full_name,
            'Date of Birth': formData.dob,
            'Phone': formData.phone,
            'Address': formData.address,
            'City': formData.city,
            'ZIP Code': formData.zip,
        };

        // Conditionally validate financial fields if payment_type is not 'agency_pay'
        if (formData.payment_type !== 'agency_pay') {
            if (formData.weekly_rate === null || formData.weekly_rate === undefined || formData.weekly_rate === '') {
                toast.error('Weekly Rate is a required financial field.');
                return false;
            }
            if (formData.install_removal_fee === null || formData.install_removal_fee === undefined || formData.install_removal_fee === '') {
                toast.error('Installation & Removal Fee is a required financial field.');
                return false;
            }
        }

        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === null || value === undefined || value === '') {
                toast.error(`${key} is a required field.`);
                return false;
            }
        }
        
        const age = formData.dob ? Math.floor((new Date() - new Date(formData.dob).getTime()) / 3.15576e+10) : null;
        if (age === null || age >= 18) {
            if (!formData.ssn || formData.ssn.trim() === '') {
                toast.error('Social Security Number is required for participants 18 and older.');
                return false;
            }
        }

        if (!/^\d{8}$/.test(formData.device_number)) {
            toast.error('Device Number must be exactly 8 digits.');
            return false;
        }
        if (!formData.dispatch_confirmed) {
            toast.error('You must confirm dispatch activation to continue.');
            return false;
        }

        const acknowledgments = ['abide_restrictions', 'payments_advance', 'charge_maintain', 'gps_tracking', 'no_tamper', 'rules_explained', 'equipment_liability', 'weekly_rate_terms', 'revocation_conditions'];
        for (const ack of acknowledgments) {
            if (!formData[`ack_${ack}`] || !/^[A-Za-z]{2,4}$/.test((formData[`init_${ack}`] || "").trim())) {
                toast.error(`All acknowledgments must be checked and initialed correctly.`);
                return false;
            }
        }

        if (!formData.signature_png) {
            toast.error("The participant's digital signature is required.");
            return false;
        }

        const isMinor = formData.dob ? Math.floor((new Date() - new Date(formData.dob).getTime()) / 3.15576e+10) < 18 : false;
        if (isMinor && (!formData.guardian_signature_png || !formData.guardian_printed_name || !formData.guardian_relationship)) {
            toast.error("A guardian's printed name, relationship, and signature are required for a minor.");
            return false;
        }

        if (!formData.agent_signature_png) {
            toast.error("The agent's witnessing signature is required.");
            return false;
        }
        return true;
    };

    const handleFinalSubmit = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            // Step 1: Create a record or update it to get an ID.
            const { data: savedStep } = await saveInstallerStep({ recordId, ...formData });
            if (!savedStep || !savedStep.id) {
                throw new Error("Failed to save initial data.");
            }
            const currentRecordId = savedStep.id;

            // Step 2: Finalize the submission with the guaranteed ID and audit data.
            const submissionData = {
                id: currentRecordId,
                ...formData,
                audit_metadata: auditData
            };
            
            const { data: finalResponse } = await submitAgreementToComply(submissionData);
            if (finalResponse.success) {
                toast.success("Agreement submitted successfully!");
                setIsSuccess(true);
                setSearchParams({ id: currentRecordId });
                if (finalResponse.pdfUrl) {
                    window.open(finalResponse.pdfUrl, '_blank');
                }
            } else {
                throw new Error(finalResponse.error || "An unknown error occurred during final submission.");
            }
        } catch (error) {
            console.error(error);
            const message = error?.response?.data?.error || error.message || "An unknown error occurred.";
            toast.error(`Submission failed: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <LoadingSpinner message="Loading agreement..." />;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Agreement Submitted!</h1>
                    <p className="text-gray-600 mt-2">The agreement has been successfully signed and submitted. A PDF copy should have opened in a new tab.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster richColors position="top-center" />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-800">Arkansas Ankle Monitor</h1>
                            <p className="text-gray-600">Agreement System</p>
                        </div>
                    </div>
                </div>

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                    <LocationPermissionWarning />
                    
                    <CollapsibleSection title="Section 1: Agent & Device Setup">
                        <InstallerSection data={formData} onUpdate={handleUpdate} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Section 2: Participant & Agreement Terms">
                        <OffenderSection data={formData} onUpdate={handleUpdate} />
                    </CollapsibleSection>

                    {formData.payment_type !== 'agency_pay' && (
                        <CollapsibleSection title="Section 3: Financial Terms & Payment">
                            <FinancialSection data={formData} onUpdate={handleUpdate} />
                            <PaymentSection data={formData} onUpdate={handleUpdate} />
                        </CollapsibleSection>
                    )}
                    
                    <CollapsibleSection title="Section 4: Document & Photo Uploads">
                         <FileUploadSection uploadedFiles={formData.uploaded_files} onUpdate={handleUpdate} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Section 5: Signatures & Final Submission">
                        <SignatureCapture 
                            onSignatureChange={handleUpdate}
                            participantData={formData}
                            required 
                        />
                    </CollapsibleSection>

                    {auditData && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                Audit Trail Information (auto-captured on submission)
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                                <div>• Browser/OS: {auditData.user_agent.split(' ').slice(-2).join(' ')}</div>
                                <div>• Device: {auditData.platform} {auditData.screen_resolution}</div>
                                <div className="flex items-center gap-1">
                                    • <Clock className="w-3 h-3" /> Time Zone: {auditData.timezone}
                                </div>
                                <div className="flex items-center gap-1">
                                    • <MapPin className="w-3 h-3" /> Location: {
                                        auditData.geolocation_permission === 'granted' 
                                            ? `${auditData.geolocation_lat?.toFixed(4)}, ${auditData.geolocation_lon?.toFixed(4)}`
                                            : auditData.geolocation_permission === 'denied' 
                                                ? 'Permission denied'
                                                : auditData.geolocation_permission === 'not_supported'
                                                    ? 'Not supported'
                                                    : 'Not available'
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-end pt-4">
                        <Button size="lg" onClick={handleFinalSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Final Agreement'}
                        </Button>
                    </div>
                </main>
            </div>
        </>
    );
}
