
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Check, User, Users, Edit } from 'lucide-react';

const SignaturePad = ({ onSignatureEnd, onClear }) => {
    const canvasRef = useRef(null);
    const [hasSignature, setHasSignature] = useState(false);
    const isDrawingRef = useRef(false); // Changed from useState to useRef

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.scale(dpr, dpr);
        
        // Set drawing style
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        // Fill with white background to ensure clear visibility
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const getCoords = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        };
        
        const startDrawing = (e) => {
            e.preventDefault();
            isDrawingRef.current = true; // Use ref.current
            const { x, y } = getCoords(e);
            context.beginPath();
            context.moveTo(x, y);
        };
        
        const draw = (e) => {
            if (!isDrawingRef.current) return; // Use ref.current
            e.preventDefault();
            const { x, y } = getCoords(e);
            context.lineTo(x, y);
            context.stroke();
            
            // Capture signature continuously while drawing
            setHasSignature(true);
            onSignatureEnd(canvas.toDataURL('image/png'));
        };

        const stopDrawing = (e) => {
            if (!isDrawingRef.current) return; // Use ref.current
            e.preventDefault();
            isDrawingRef.current = false; // Use ref.current
            
            // Final capture when done drawing
            setHasSignature(true);
            onSignatureEnd(canvas.toDataURL('image/png'));
        };

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        
        // Touch events
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing, { passive: false });
        
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [onSignatureEnd]); // isDrawingRef is not a dependency as it's a ref

    const handleClear = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Clear the entire canvas completely
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset with white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Reset drawing style after clearing
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        setHasSignature(false);
        isDrawingRef.current = false; // Use ref.current
        onClear();
    };

    return (
        <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-32 rounded cursor-crosshair touch-none block"
                    style={{ touchAction: 'none' }}
                />
            </div>
            <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">
                    {hasSignature ? 'Signature captured ✓' : 'Sign above using your finger or mouse'}
                </p>
                <div className="flex gap-2">
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClear} 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <RotateCcw className="w-4 h-4 mr-1" /> Clear
                    </Button>
                    {hasSignature && (
                        <div className="flex items-center text-green-600 text-sm font-medium">
                            <Check className="w-4 h-4 mr-1" /> Signed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function SignatureCapture({ onSignatureChange, participantData, required = false }) {
    const isMinor = participantData?.dob ?
        Math.floor((new Date() - new Date(participantData.dob).getTime()) / 3.15576e+10) < 18 : false;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-700" /> Participant Digital Signature {required && '*'}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{participantData?.full_name ? `${participantData.full_name}, please sign below` : 'Please sign below'}</p>
                </CardHeader>
                <CardContent>
                    <SignaturePad
                        onSignatureEnd={(data) => onSignatureChange({ signature_png: data })}
                        onClear={() => onSignatureChange({ signature_png: '' })}
                    />
                </CardContent>
            </Card>

            {isMinor && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-orange-700" /> Guardian Signature Required (Minor Detected)
                        </CardTitle>
                        <p className="text-sm text-gray-600">Since the participant is under 18, a parent or guardian must print their name and sign below.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label htmlFor="guardian_printed_name">Guardian Printed Name *</Label>
                                <Input
                                    id="guardian_printed_name"
                                    value={participantData?.guardian_printed_name || ''}
                                    onChange={(e) => onSignatureChange({ guardian_printed_name: e.target.value })}
                                    placeholder="Print full legal name"
                                    required={isMinor}
                                />
                            </div>
                            <div>
                                <Label htmlFor="guardian_relationship">Relationship to Minor *</Label>
                                <Input
                                    id="guardian_relationship"
                                    value={participantData?.guardian_relationship || ''}
                                    onChange={(e) => onSignatureChange({ guardian_relationship: e.target.value })}
                                    placeholder="e.g., Mother, Father, Legal Guardian"
                                    required={isMinor}
                                />
                            </div>
                        </div>
                        <SignaturePad
                            onSignatureEnd={(data) => onSignatureChange({ guardian_signature_png: data })}
                            onClear={() => onSignatureChange({ guardian_signature_png: '' })}
                        />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-700" /> Witness / Agent Signature *
                    </CardTitle>
                    <p className="text-sm text-gray-600">The installing agent must sign here to witness the participant's signature.</p>
                </CardHeader>
                <CardContent>
                     <SignaturePad
                        onSignatureEnd={(data) => onSignatureChange({ agent_signature_png: data })}
                        onClear={() => onSignatureChange({ agent_signature_png: '' })}
                    />
                </CardContent>
            </Card>

            <p className="text-xs text-gray-500">
                By signing above, you acknowledge that this digital signature has the same legal effect as a handwritten signature.
            </p>
        </div>
    );
}
