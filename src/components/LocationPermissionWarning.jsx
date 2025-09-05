import React, { useState, useEffect } from 'react';
import { MapPin, Smartphone, Chrome, Safari, Firefox, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

const LocationPermissionWarning = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('unknown');

    useEffect(() => {
        // Check current geolocation permission status
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setPermissionStatus(result.state);
            });
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const requestLocation = async () => {
        if (navigator.geolocation) {
            try {
                await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 10000,
                        enableHighAccuracy: true
                    });
                });
                setPermissionStatus('granted');
                toast.success('Location permission granted!');
            } catch (error) {
                setPermissionStatus('denied');
                toast.error('Location permission denied. Please enable it manually.');
            }
        }
    };

    if (!isVisible) return null;

    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-amber-800">
                            📍 Location Permission Required
                        </h3>
                        <button
                            onClick={handleDismiss}
                            className="text-amber-400 hover:text-amber-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="mt-2 text-sm text-amber-700">
                        <p className="mb-3">
                            This agreement system requires location tracking for compliance and audit purposes. 
                            Please allow location access when prompted by your browser.
                        </p>
                        
                        {permissionStatus === 'denied' && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                                <p className="text-red-800 font-medium mb-2">❌ Location access denied</p>
                                <p className="text-red-700 text-xs">
                                    Please follow the instructions below to enable location access manually.
                                </p>
                            </div>
                        )}

                        {permissionStatus === 'granted' && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                                <p className="text-green-800 font-medium">✅ Location access granted</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    Mobile Browser Instructions:
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                        <Chrome className="w-4 h-4 text-blue-500 mt-0.5" />
                                        <div>
                                            <strong>Chrome Mobile:</strong>
                                            <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                                                <li>Tap the lock icon in the address bar</li>
                                                <li>Select "Site settings"</li>
                                                <li>Change "Location" to "Allow"</li>
                                                <li>Refresh the page</li>
                                            </ol>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <Safari className="w-4 h-4 text-blue-500 mt-0.5" />
                                        <div>
                                            <strong>Safari Mobile:</strong>
                                            <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                                                <li>Go to Settings → Safari</li>
                                                <li>Scroll to "Privacy & Security"</li>
                                                <li>Tap "Location Services"</li>
                                                <li>Ensure "Ask" or "Allow" is selected</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-amber-800 mb-2">
                                    Desktop Browser Instructions:
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                        <Chrome className="w-4 h-4 text-blue-500 mt-0.5" />
                                        <div>
                                            <strong>Chrome/Edge:</strong>
                                            <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                                                <li>Click the lock icon in the address bar</li>
                                                <li>Click "Site settings"</li>
                                                <li>Change "Location" to "Allow"</li>
                                                <li>Refresh the page</li>
                                            </ol>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <Firefox className="w-4 h-4 text-orange-500 mt-0.5" />
                                        <div>
                                            <strong>Firefox:</strong>
                                            <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                                                <li>Click the shield icon in the address bar</li>
                                                <li>Click "Permissions"</li>
                                                <li>Change "Location" to "Allow"</li>
                                                <li>Refresh the page</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {permissionStatus !== 'granted' && (
                                <div className="pt-2">
                                    <button
                                        onClick={requestLocation}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-amber-600 text-white text-xs font-medium rounded-md hover:bg-amber-700 transition-colors"
                                    >
                                        <MapPin className="w-3 h-3" />
                                        Request Location Access Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPermissionWarning;
