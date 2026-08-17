import React from "react";
import { Upload } from "./Upload";

export default {
  title: "P1 Components/Upload",
  component: Upload,
  args: { multiple: false, disabled: false },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    maxSize: { control: "number" },
    onChange: { action: "onChange" },
  },
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 480 }}><S /></div>],
};

// Inline SVG data URIs for story previews.
const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'>" +
      "<rect width='400' height='200' fill='%2300d37e'/>" +
      "<rect x='80' y='50' width='240' height='100' rx='8' fill='%23002b2a'/>" +
      "<circle cx='140' cy='90' r='20' fill='%2379ffca'/>" +
      "</svg>"
  );

const sampleImage2 =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'>" +
      "<rect width='400' height='200' fill='%233b82f6'/>" +
      "<circle cx='200' cy='100' r='60' fill='%23bfdbfe'/>" +
      "</svg>"
  );

const samplePdfUrl =
  "data:application/pdf;base64,JVBERi0xLjEKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjIwNgolJUVPRgo=";

/** Simulates an upload with progress for story demos. */
const simulateUpload = (file, { onProgress, onComplete }) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      clearInterval(interval);
      onProgress(100);
      onComplete();
    } else {
      onProgress(progress);
    }
  }, 300);
};

export const Default = { args: { label: "Proof of identity" } };

export const Uploaded = {
  args: {
    label: "Proof of identity",
    files: [
      { name: "selfie.png", size: 842_000, type: "image/png", preview: sampleImage },
    ],
  },
};

export const UploadedPdf = {
  args: {
    label: "Proof of identity",
    files: [
      { name: "tax-return-2024.pdf", size: 2_450_000, type: "application/pdf", preview: samplePdfUrl },
    ],
  },
};

export const MultipleCarousel = {
  args: {
    label: "Supporting documents",
    multiple: true,
    files: [
      { name: "selfie.png", size: 842_000, type: "image/png", preview: sampleImage },
      { name: "tax-return-2024.pdf", size: 2_450_000, type: "application/pdf", preview: samplePdfUrl },
      { name: "id-back.jpg", size: 1_100_000, type: "image/jpeg", preview: sampleImage2 },
    ],
  },
};

export const WithUploadProgress = {
  args: {
    label: "Proof of identity",
  },
  render: (args) => <Upload {...args} onUpload={simulateUpload} />,
};

export const Error = {
  args: {
    label: "Proof of identity",
    error: "File size exceeds 10 MB. Please upload a smaller file",
    files: [
      { name: "large-scan.pdf", size: 15_200_000, type: "application/pdf", preview: samplePdfUrl },
    ],
  },
};
