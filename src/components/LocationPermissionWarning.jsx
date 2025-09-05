import React, { useState, useEffect } from 'react';
import { MapPin, Smartphone, Chrome, Globe, Monitor, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { toast } from 'sonner';

const LocationPermissionWarning = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
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
        <div className="bg-white border border-amber-200 rounded-lg shadow-sm mb-6 overflow-hidden">
            {/* Header - Always Visible */}
            <div 
                className="bg-amber-50 px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                            <h3 className="text-sm font-semibold text-amber-800">
                                📍 Location Permission Required
                            </h3>
                            <p className="text-xs text-amber-600 mt-0.5">
                                {permissionStatus === 'granted' 
                                    ? '✅ Location access granted' 
                                    : permissionStatus === 'denied'
                                        ? '❌ Location access denied - Click to view instructions'
                                        : 'Click to view browser instructions'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {permissionStatus !== 'granted' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    requestLocation();
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
                            >
                                <MapPin className="w-3 h-3" />
                                Allow
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss();
                            }}
                            className="text-amber-400 hover:text-amber-600 p-1"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="text-amber-500">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="px-4 py-4 border-t border-amber-100">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            This agreement system requires location tracking for compliance and audit purposes. 
                            Please allow location access when prompted by your browser.
                        </p>
                        
                        {permissionStatus === 'denied' && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-red-800 font-medium text-sm mb-1">❌ Location access denied</p>
                                <p className="text-red-700 text-xs">
                                    Please follow the instructions below to enable location access manually.
                                </p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Mobile Instructions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-blue-500" />
                                    Mobile Browser
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Chrome className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">Chrome Mobile</p>
                                            <ol className="list-decimal list-inside text-xs text-gray-600 mt-1 space-y-1">
                                                <li>Tap the lock icon in the address bar</li>
                                                <li>Select "Site settings"</li>
                                                <li>Change "Location" to "Allow"</li>
                                                <li>Refresh the page</li>
                                            </ol>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">Safari Mobile</p>
                                            <ol className="list-decimal list-inside text-xs text-gray-600 mt-1 space-y-1">
                                                <li>Go to Settings → Safari</li>
                                                <li>Scroll to "Privacy & Security"</li>
                                                <li>Tap "Location Services"</li>
                                                <li>Ensure "Ask" or "Allow" is selected</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Instructions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-gray-500" />
                                    Desktop Browser
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Chrome className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">Chrome/Edge</p>
                                            <ol className="list-decimal list-inside text-xs text-gray-600 mt-1 space-y-1">
                                                <li>Click the lock icon in the address bar</li>
                                                <li>Click "Site settings"</li>
                                                <li>Change "Location" to "Allow"</li>
                                                <li>Refresh the page</li>
                                            </ol>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Monitor className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">Firefox</p>
                                            <ol className="list-decimal list-inside text-xs text-gray-600 mt-1 space-y-1">
                                                <li>Click the shield icon in the address bar</li>
                                                <li>Click "Permissions"</li>
                                                <li>Change "Location" to "Allow"</li>
                                                <li>Refresh the page</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPermissionWarning;
