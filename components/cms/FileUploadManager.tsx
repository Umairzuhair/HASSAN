
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File } from "lucide-react";
import { UploadedFileCard } from "./UploadedFileCard";
import { useFileManager } from "./hooks/useFileManager";

export const FileUploadManager = () => {
  const {
    uploadedFiles,
    uploading,
    copiedUrl,
    fileInputRef,
    handleFileSelect,
    copyToClipboard,
    deleteFile,
  } = useFileManager();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">File Upload Manager</h2>
        <p className="text-muted-foreground">
          Upload files to Supabase Storage and get copyable URLs for use in your content
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*,application/pdf,.doc,.docx,.txt"
                disabled={uploading}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: Images, PDF, Word documents, Text files
              </p>
            </div>
            {uploading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground mt-2">Uploading files...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <UploadedFileCard
                  key={file.url + index}
                  file={file}
                  copiedUrl={copiedUrl}
                  onCopy={copyToClipboard}
                  onDelete={deleteFile}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. Click "Choose Files" and select one or more files to upload</p>
            <p>2. Files will be automatically uploaded to Supabase Storage</p>
            <p>3. Copy the generated URLs to use in your content management sections</p>
            <p>4. Use the "Copy URL" button to copy the direct link to your clipboard</p>
            <p>5. Paste the URL in the "Image URL" fields in your content sections</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
