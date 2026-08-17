import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../Button/Button";
import "./Upload.css";

function formatBytes(n) {
  if (n == null) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function isImageFile(file) {
  if (!file) return false;
  if (typeof file.type === "string" && file.type.startsWith("image/")) return true;
  const name = file.name || "";
  return /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(name);
}

function isPdfFile(file) {
  if (!file) return false;
  if (typeof file.type === "string" && file.type === "application/pdf") return true;
  const name = file.name || "";
  return /\.pdf$/i.test(name);
}

/** Generates and manages an object URL for a File/Blob. */
function useFileUrl(file) {
  const providedUrl = file?.preview || file?.url || null;
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (providedUrl) return;
    if (typeof File !== "undefined" && file instanceof Blob && typeof URL !== "undefined" && URL.createObjectURL) {
      const objUrl = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setObjectUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
  }, [file, providedUrl]);

  return providedUrl || objectUrl;
}

/** Large image preview. */
function ImagePreview({ file }) {
  const url = useFileUrl(file);
  if (url) {
    return <img src={url} alt={file.name || ""} className="upload__preview-img" />;
  }
  return (
    <div className="upload__preview-placeholder">
      <span className="material-symbols-rounded">image</span>
    </div>
  );
}

/** Large scrollable PDF preview (user can scroll pages). */
function PdfPreview({ file }) {
  const url = useFileUrl(file);
  if (url) {
    return (
      <object
        data={`${url}#view=FitH`}
        type="application/pdf"
        className="upload__pdf-object"
        aria-label={`PDF preview: ${file.name || "document"}`}
        tabIndex={-1}
      >
        <div className="upload__preview-placeholder">
          <span className="material-symbols-rounded">picture_as_pdf</span>
        </div>
      </object>
    );
  }
  return (
    <div className="upload__preview-placeholder">
      <span className="material-symbols-rounded">picture_as_pdf</span>
    </div>
  );
}

/** Progress bar for file upload. */
function UploadProgress({ progress, status }) {
  if (status === "complete") return null;
  const isError = status === "error";
  return (
    <div className="upload__progress">
      <div className="upload__progress-bar">
        <div
          className={`upload__progress-fill ${isError ? "is-error" : ""}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <span className="upload__progress-text">
        {isError ? "Upload failed" : `${Math.round(progress)}%`}
      </span>
    </div>
  );
}

/** Small thumbnail for the carousel strip. */
function Thumbnail({ file, isActive, onClick }) {
  const url = useFileUrl(file);
  const cls = `upload__thumb-item ${isActive ? "is-active" : ""}`;

  if (isImageFile(file) && url) {
    return (
      <button type="button" className={cls} onClick={onClick} aria-label={file.name}>
        <img src={url} alt="" className="upload__thumb-img" />
      </button>
    );
  }

  const icon = isPdfFile(file) ? "picture_as_pdf" : "description";
  return (
    <button type="button" className={`${cls} upload__thumb-item--placeholder`} onClick={onClick} aria-label={file.name}>
      <span className="material-symbols-rounded">{icon}</span>
    </button>
  );
}

export function Upload({
  label,
  hint = "Drag & Drop (accepted format such as JPEG, PNG, PDF)",
  accept,
  multiple = false,
  files: controlledFiles,
  onChange,
  onUpload,
  error,
  disabled = false,
  className = "",
  maxSize,
}) {
  const inputRef = useRef(null);
  const [internal, setInternal] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Upload progress per file: { [index]: { progress: 0-100, status: 'uploading'|'complete'|'error' } }
  const [uploadState, setUploadState] = useState({});
  const isControlled = controlledFiles !== undefined;
  const files = isControlled ? controlledFiles : internal;

  const setFiles = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };

  const startUpload = useCallback((file, index) => {
    if (!onUpload) return;

    setUploadState((prev) => ({
      ...prev,
      [index]: { progress: 0, status: "uploading" },
    }));

    onUpload(file, {
      onProgress: (progress) => {
        setUploadState((prev) => ({
          ...prev,
          [index]: { ...prev[index], progress },
        }));
      },
      onComplete: () => {
        setUploadState((prev) => ({
          ...prev,
          [index]: { progress: 100, status: "complete" },
        }));
      },
      onError: () => {
        setUploadState((prev) => ({
          ...prev,
          [index]: { ...prev[index], status: "error" },
        }));
      },
    });
  }, [onUpload]);

  const handleSelect = (list) => {
    const arr = Array.from(list || []);
    const next = multiple ? [...files, ...arr] : arr.slice(0, 1);
    setFiles(next);

    // Start upload for each new file
    const startIdx = multiple ? files.length : 0;
    arr.forEach((file, i) => {
      startUpload(file, startIdx + i);
    });

    if (multiple && arr.length > 0) {
      setActiveIndex(files.length);
    }
  };

  const remove = (file) => {
    const idx = files.indexOf(file);
    const next = files.filter((f) => f !== file);
    setFiles(next);

    // Clean up upload state
    setUploadState((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        const k = Number(key);
        if (k < idx) updated[k] = prev[k];
        else if (k > idx) updated[k - 1] = prev[k];
      });
      return updated;
    });

    if (next.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= next.length) {
      setActiveIndex(next.length - 1);
    } else if (idx < activeIndex) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const goPrev = () => {
    setActiveIndex((i) => (i > 0 ? i - 1 : files.length - 1));
  };
  const goNext = () => {
    setActiveIndex((i) => (i < files.length - 1 ? i + 1 : 0));
  };

  const dropCls = [
    "upload__drop",
    dragging && "is-dragging",
  ].filter(Boolean).join(" ");

  const hasFiles = files.length > 0;
  const activeFile = files[activeIndex] || files[0];
  const url = useFileUrl(activeFile);
  const activeUpload = uploadState[activeIndex];

  return (
    <div className={"upload " + className}>
      {label && <span className="field__label">{label}</span>}

      {/* Default / empty state — drop zone */}
      {!hasFiles && (
        <label
          className={dropCls}
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
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => { handleSelect(e.target.files); e.target.value = ""; }}
          />
        </label>
      )}

      {/* Uploaded state */}
      {hasFiles && (
        <div className={`upload__card ${error ? "is-error" : ""}`}>
          <div className="upload__card-content">
            {/* Hidden file input for "Add" button */}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              onChange={(e) => { handleSelect(e.target.files); e.target.value = ""; }}
            />
            {/* Preview area with chevron navigation */}
            <div className="upload__preview">
              {multiple && files.length > 1 && (
                <button
                  type="button"
                  className="upload__chevron upload__chevron--left"
                  onClick={goPrev}
                  aria-label="Previous file"
                >
                  <span className="material-symbols-rounded">chevron_left</span>
                </button>
              )}

              {isImageFile(activeFile) ? (
                <ImagePreview file={activeFile} />
              ) : isPdfFile(activeFile) ? (
                <PdfPreview file={activeFile} />
              ) : (
                <div className="upload__preview-placeholder">
                  <span className="material-symbols-rounded">description</span>
                </div>
              )}

              {multiple && files.length > 1 && (
                <button
                  type="button"
                  className="upload__chevron upload__chevron--right"
                  onClick={goNext}
                  aria-label="Next file"
                >
                  <span className="material-symbols-rounded">chevron_right</span>
                </button>
              )}
            </div>

            {/* Upload progress bar */}
            {activeUpload && activeUpload.status !== "complete" && (
              <UploadProgress
                progress={activeUpload.progress}
                status={activeUpload.status}
              />
            )}

            {/* Thumbnail strip below preview */}
            {multiple && files.length > 1 && (
              <div className="upload__thumbstrip" role="tablist" aria-label="Uploaded files">
                {files.map((file, i) => (
                  <Thumbnail
                    key={i}
                    file={file}
                    isActive={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}

            {/* File info */}
            <div className="upload__file-info">
              <a
                className={`upload__filename ${error ? "is-error" : ""}`}
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
              {error && <span className="upload__error-message">{error}</span>}
            </div>

            {/* Actions */}
            <div className="upload__actions">
              {multiple && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={disabled}
                  type="button"
                  onClick={() => inputRef.current && inputRef.current.click()}
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
