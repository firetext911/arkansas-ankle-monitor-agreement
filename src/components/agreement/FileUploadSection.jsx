import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, File, Trash2, Loader2, Paperclip } from 'lucide-react';
import { UploadFile as UploadFileIntegration } from '@/api/integrations';
import { toast } from 'sonner';

export default function FileUploadSection({ uploadedFiles = [], onUpdate }) {
    const [showUploader, setShowUploader] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileType, setFileType] = useState('other');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { file_url } = await UploadFileIntegration({ file });
            const newFile = {
                file_url,
                file_type: fileType,
                file_name: file.name
            };
            const updatedFiles = [...uploadedFiles, newFile];
            onUpdate({ uploaded_files: updatedFiles });
            toast.success(`File "${file.name}" uploaded successfully.`);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("File upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = (indexToRemove) => {
        const updatedFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
        onUpdate({ uploaded_files: updatedFiles });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-gray-600" />
                    Document & Photo Uploads
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 mb-4">
                    <Checkbox
                        id="has_files_to_upload"
                        checked={showUploader}
                        onCheckedChange={setShowUploader}
                    />
                    <Label htmlFor="has_files_to_upload" className="cursor-pointer">
                        I have files or photos to upload with this agreement.
                    </Label>
                </div>

                {showUploader && (
                    <div className="p-4 border border-dashed rounded-lg space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="file-type-select">Document/Photo Type</Label>
                                <Select value={fileType} onValueChange={setFileType}>
                                    <SelectTrigger id="file-type-select">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="offender_photo">Photo of Participant</SelectItem>
                                        <SelectItem value="install_photo">Photo of Ankle Monitor Install</SelectItem>
                                        <SelectItem value="court_order">Court Order</SelectItem>
                                        <SelectItem value="bond_paperwork">Bond Paperwork</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button asChild className="w-full cursor-pointer">
                                    <label htmlFor="file-upload" className="w-full flex items-center justify-center gap-2">
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                        {isUploading ? 'Uploading...' : 'Choose or Capture File'}
                                    </label>
                                </Button>
                                <input id="file-upload" type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={handleFileChange} />
                            </div>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2 pt-4">
                                <h4 className="font-medium text-sm">Uploaded Files:</h4>
                                <ul className="list-none p-0">
                                    {uploadedFiles.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Paperclip className="w-4 h-4 text-gray-500" />
                                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                                                    {file.file_name}
                                                </a>
                                                <span className="text-xs text-gray-500">({file.file_type})</span>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {!isUploading && (
                            <p className="text-xs text-gray-500">
                                Tip: You can upload multiple files by selecting a type and choosing/capturing files one at a time.
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}