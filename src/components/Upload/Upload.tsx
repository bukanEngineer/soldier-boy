import React, { useEffect, useRef, useState, useCallback } from "react";
import { Field } from "../Field/Field";
import { cn } from "../../lib/cn";
import { Button } from "../Button/Button";
import "./Upload.css";

/** A selected `File`, or a descriptor for an already uploaded file. */
export type UploadFile =
  | File
  | {
      name: string;
      size?: number;
      type?: string;
      /** Preview URL (data or object URL) */
      preview?: string;
      /** Link to the uploaded file */
      url?: string;
    };

export type UploadHandlers = {
  onProgress: (progress: number) => void;
  onComplete: () => void;
  onError: () => void;
};

type UploadState = { progress: number; status: "uploading" | "complete" | "error" };

function formatBytes(n?: number) {
  if (n == null) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function isImageFile(file?: UploadFile) {
  if (!file) return false;
  if (typeof file.type === "string" && file.type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(file.name || "");
}

function isPdfFile(file?: UploadFile) {
  if (!file) return false;
  if (file.type === "application/pdf") return true;
  return /\.pdf$/i.test(file.name || "");
}

/** Generates and manages an object URL for a File/Blob. */
function useFileUrl(file?: UploadFile) {
  const providedUrl = file && !(file instanceof Blob) ? file.preview || file.url || null : null;
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (providedUrl) return;
    if (typeof Blob !== "undefined" && file instanceof Blob && typeof URL !== "undefined" && URL.createObjectURL) {
      const objUrl = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setObjectUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
  }, [file, providedUrl]);

  return providedUrl || objectUrl;
}

function Placeholder({ icon }: { icon: string }) {
  return (
    <div className="upload__preview-placeholder">
      <span className="material-symbols-rounded" aria-hidden="true">{icon}</span>
    </div>
  );
}

/** Large image preview. */
function ImagePreview({ file }: { file: UploadFile }) {
  const url = useFileUrl(file);
  if (!url) return <Placeholder icon="image" />;
  return <img src={url} alt={file.name || ""} className="upload__preview-img" />;
}

/** Large scrollable PDF preview (user can scroll pages). */
function PdfPreview({ file }: { file: UploadFile }) {
  const url = useFileUrl(file);
  if (!url) return <Placeholder icon="picture_as_pdf" />;
  return (
    <object
      data={`${url}#view=FitH`}
      type="application/pdf"
      className="upload__pdf-object"
      aria-label={`PDF preview: ${file.name || "document"}`}
      tabIndex={-1}
    >
      <Placeholder icon="picture_as_pdf" />
    </object>
  );
}

/** Progress bar for file upload. */
function UploadProgress({ progress, status }: UploadState) {
  const isError = status === "error";
  const value = Math.min(100, Math.max(0, progress));
  return (
    <div className="upload__progress">
      <div
        className="upload__progress-bar"
        role="progressbar"
        aria-label="Upload progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
      >
        <div
          className="upload__progress-fill"
          data-status={status}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="upload__progress-text">
        {isError ? "Upload failed" : `${Math.round(progress)}%`}
      </span>
    </div>
  );
}

/** Small thumbnail for the carousel strip. */
function Thumbnail({ file, active, onClick }: { file: UploadFile; active: boolean; onClick: () => void }) {
  const url = useFileUrl(file);
  const image = isImageFile(file) && url;
  return (
    <button
      type="button"
      className={cn("upload__thumb-item", !image && "upload__thumb-item--placeholder")}
      data-active={active || undefined}
      aria-current={active || undefined}
      aria-label={file.name}
      onClick={onClick}
    >
      {image ? (
        <img src={url} alt="" className="upload__thumb-img" />
      ) : (
        <span className="material-symbols-rounded" aria-hidden="true">
          {isPdfFile(file) ? "picture_as_pdf" : "description"}
        </span>
      )}
    </button>
  );
}

export type UploadProps = Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange"> & {
  /** Hint inside the drop zone */
  hint?: React.ReactNode;
  /** Accepted file types (input `accept`) */
  accept?: string;
  /** Allow several files, with a carousel preview */
  multiple?: boolean;
  /** Controlled files */
  value?: UploadFile[];
  /** Initial files (uncontrolled) */
  defaultValue?: UploadFile[];
  /** Called with the new file list on add or delete */
  onValueChange?: (files: UploadFile[]) => void;
  /** Starts an upload for each newly selected file; report back through the handlers */
  onUpload?: (file: UploadFile, handlers: UploadHandlers) => void;
  /** Error border. Inside `<Field.Root invalid>` this is picked up automatically. */
  invalid?: boolean;
  disabled?: boolean;
  /** Max file size in bytes, shown as a hint */
  maxSize?: number;
  /** Form field name for the file input */
  name?: string;
};

/**
 * File upload with drop zone, preview, carousel (multiple) and progress.
 * Label, helper and error come from `Field`:
 *
 *   <Field.Root invalid={!!error}>
 *     <Field.Label>Proof of identity</Field.Label>
 *     <Upload accept="image/*,.pdf" />
 *     <Field.Error match>{error}</Field.Error>
 *   </Field.Root>
 */
export function Upload({
  hint = "Drag & Drop (accepted format such as JPEG, PNG, PDF)",
  accept,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  onUpload,
  invalid,
  disabled = false,
  maxSize,
  name,
  id,
  className,
  ...props
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<UploadFile[]>(defaultValue ?? []);
  const [dragging, setDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Upload progress per file index.
  const [uploadState, setUploadState] = useState<Record<number, UploadState>>({});
  const isControlled = value !== undefined;
  const files = isControlled ? value : internal;

  const setFiles = (next: UploadFile[]) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const startUpload = useCallback((file: UploadFile, index: number) => {
    if (!onUpload) return;
    const patch = (next: Partial<UploadState>) =>
      setUploadState((prev) => ({ ...prev, [index]: { ...prev[index], ...next } }));

    patch({ progress: 0, status: "uploading" });
    onUpload(file, {
      onProgress: (progress) => patch({ progress }),
      onComplete: () => patch({ progress: 100, status: "complete" }),
      onError: () => patch({ status: "error" }),
    });
  }, [onUpload]);

  const handleSelect = (list: FileList | null) => {
    const arr = Array.from(list || []);
    if (arr.length === 0) return;
    const next = multiple ? [...files, ...arr] : arr.slice(0, 1);
    setFiles(next);

    const startIdx = multiple ? files.length : 0;
    (multiple ? arr : next).forEach((file, i) => startUpload(file, startIdx + i));

    if (multiple) setActiveIndex(files.length);
  };

  const remove = (file: UploadFile) => {
    const idx = files.indexOf(file);
    const next = files.filter((f) => f !== file);
    setFiles(next);

    // Shift upload state for files after the removed one.
    setUploadState((prev) => {
      const updated: Record<number, UploadState> = {};
      Object.keys(prev).forEach((key) => {
        const k = Number(key);
        if (k < idx) updated[k] = prev[k];
        else if (k > idx) updated[k - 1] = prev[k];
      });
      return updated;
    });

    if (next.length === 0) setActiveIndex(0);
    else if (activeIndex >= next.length) setActiveIndex(next.length - 1);
    else if (idx < activeIndex) setActiveIndex(activeIndex - 1);
  };

  const goPrev = () => setActiveIndex((i) => (i > 0 ? i - 1 : files.length - 1));
  const goNext = () => setActiveIndex((i) => (i < files.length - 1 ? i + 1 : 0));

  const hasFiles = files.length > 0;
  const activeFile = files[activeIndex] || files[0];
  const url = useFileUrl(activeFile);
  const activeUpload = uploadState[activeIndex];
  const showCarousel = multiple && files.length > 1;

  // Field.Control wires id, label, description and invalid state from a parent Field.Root.
  const input = (
    <Field.Control
      ref={inputRef}
      type="file"
      id={id}
      name={name}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      // Once files are shown, the "Add" button opens the picker instead.
      tabIndex={hasFiles ? -1 : undefined}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleSelect(e.target.files);
        e.target.value = "";
      }}
    />
  );

  return (
    <div
      className={cn("upload", className)}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      {...props}
    >
      {/* Default / empty state: drop zone */}
      {!hasFiles && (
        // Drag events on the label are intentional: the nested file input makes this a drop zone.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- drop zone
        <label
          className="upload__drop"
          data-dragging={dragging || undefined}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (disabled) return;
            handleSelect(e.dataTransfer.files);
          }}
        >
          <span className="material-symbols-rounded upload__icon" aria-hidden="true">cloud_upload</span>
          <span className="upload__primary">
            <span className="upload__link">Click to upload</span> or drag and drop
          </span>
          <span className="upload__hint">{hint}</span>
          {maxSize && (
            <span className="upload__hint">Max file size: {formatBytes(maxSize)}</span>
          )}
          {input}
        </label>
      )}

      {/* Uploaded state */}
      {hasFiles && (
        <div className="upload__card">
          <div className="upload__card-content">
            {input}
            {/* Preview area with chevron navigation */}
            <div className="upload__preview">
              {showCarousel && (
                <button
                  type="button"
                  className="upload__chevron upload__chevron--left"
                  onClick={goPrev}
                  aria-label="Previous file"
                >
                  <span className="material-symbols-rounded" aria-hidden="true">chevron_left</span>
                </button>
              )}

              {isImageFile(activeFile) ? (
                <ImagePreview file={activeFile} />
              ) : isPdfFile(activeFile) ? (
                <PdfPreview file={activeFile} />
              ) : (
                <Placeholder icon="description" />
              )}

              {showCarousel && (
                <button
                  type="button"
                  className="upload__chevron upload__chevron--right"
                  onClick={goNext}
                  aria-label="Next file"
                >
                  <span className="material-symbols-rounded" aria-hidden="true">chevron_right</span>
                </button>
              )}
            </div>

            {activeUpload && activeUpload.status !== "complete" && (
              <UploadProgress progress={activeUpload.progress} status={activeUpload.status} />
            )}

            {/* Thumbnail strip below preview */}
            {showCarousel && (
              <div className="upload__thumbstrip" role="group" aria-label="Uploaded files">
                {files.map((file, i) => (
                  <Thumbnail
                    key={i}
                    file={file}
                    active={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}

            {/* File info */}
            <div className="upload__file-info">
              <a
                className="upload__filename"
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!url) e.preventDefault(); }}
              >
                {activeFile.name}
              </a>
              {activeFile.size != null && (
                <span className="upload__filesize">{formatBytes(activeFile.size)}</span>
              )}
            </div>

            <div className="upload__actions">
              {multiple && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={disabled}
                  onClick={() => inputRef.current?.click()}
                >
                  Add
                </Button>
              )}
              <Button
                variant="tertiary"
                size="sm"
                disabled={disabled}
                className="upload__delete-btn"
                onClick={() => remove(activeFile)}
                aria-label={`Delete ${activeFile.name}`}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
