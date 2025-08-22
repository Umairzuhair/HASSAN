
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, Check, File as FileIcon } from "lucide-react";
import { isImage, formatFileSize } from "./utils/fileUtils";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface UploadedFileCardProps {
  file: UploadedFile;
  copiedUrl: string | null;
  onCopy: (url: string) => void;
  onDelete: (url: string, name: string) => void;
}

export const UploadedFileCard = ({
  file,
  copiedUrl,
  onCopy,
  onDelete,
}: UploadedFileCardProps) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3 flex-1">
        <div className="flex-shrink-0">
          {isImage(file.type) ? (
            <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
              <FileIcon className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{file.name}</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline">{formatFileSize(file.size)}</Badge>
            <Badge variant="outline">{file.type}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Uploaded: {file.uploadedAt.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(file.url)}
          className="flex items-center gap-1"
        >
          {copiedUrl === file.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedUrl === file.url ? "Copied!" : "Copy URL"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(file.url, file.name)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
    <div className="mt-3">
      <Label className="text-xs text-muted-foreground">Public URL:</Label>
      <div className="bg-gray-50 rounded p-2 mt-1">
        <code className="text-xs break-all">{file.url}</code>
      </div>
    </div>
  </div>
);
