import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Upload } from "./Upload";
import { Field } from "../Field/Field";
import type { UploadHandlers } from "./Upload";

function Example(
  props: React.ComponentProps<typeof Upload> & {
    label?: string;
    helper?: string;
    error?: string;
  },
) {
  const { label, helper, error, ...controlProps } = props;
  return (
    <Field.Root invalid={!!error}>
      {label && <Field.Label>{label}</Field.Label>}
      <Upload {...controlProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'>" +
      "<rect width='400' height='200' fill='%2300d37e'/>" +
      "<rect x='80' y='50' width='240' height='100' rx='8' fill='%23002b2a'/>" +
      "<circle cx='140' cy='90' r='20' fill='%2379ffca'/>" +
      "</svg>",
  );

const sampleImage2 =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'>" +
      "<rect width='400' height='200' fill='%233b82f6'/>" +
      "<circle cx='200' cy='100' r='60' fill='%23bfdbfe'/>" +
      "</svg>",
  );

const samplePdfUrl =
  "data:application/pdf;base64,JVBERi0xLjEKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjIwNgolJUVPRgo=";

/** Simulates an upload with progress for story demos. */
const simulateUpload = (_file: unknown, { onProgress, onComplete }: UploadHandlers) => {
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

const meta: Meta<typeof Example> = {
  title: "Components/Upload",
  component: Example,
  args: { multiple: false, disabled: false, label: "Proof of identity" },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    helper: { control: "text" },
    error: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    maxSize: { control: "number" },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = { args: { label: "Proof of identity" } };

export const Uploaded: Story = {
  args: {
    label: "Proof of identity",
    defaultValue: [
      { name: "selfie.png", size: 842_000, type: "image/png", preview: sampleImage },
    ],
  },
};

export const UploadedPdf: Story = {
  args: {
    label: "Proof of identity",
    defaultValue: [
      {
        name: "tax-return-2024.pdf",
        size: 2_450_000,
        type: "application/pdf",
        preview: samplePdfUrl,
      },
    ],
  },
};

export const MultipleCarousel: Story = {
  args: {
    label: "Supporting documents",
    multiple: true,
    defaultValue: [
      { name: "selfie.png", size: 842_000, type: "image/png", preview: sampleImage },
      {
        name: "tax-return-2024.pdf",
        size: 2_450_000,
        type: "application/pdf",
        preview: samplePdfUrl,
      },
      { name: "id-back.jpg", size: 1_100_000, type: "image/jpeg", preview: sampleImage2 },
    ],
  },
};

export const WithUploadProgress: Story = {
  args: { label: "Proof of identity" },
  render: (args) => <Example {...args} onUpload={simulateUpload} />,
};

export const Error: Story = {
  args: {
    label: "Proof of identity",
    error: "File size exceeds 10 MB. Please upload a smaller file",
    defaultValue: [
      {
        name: "large-scan.pdf",
        size: 15_200_000,
        type: "application/pdf",
        preview: samplePdfUrl,
      },
    ],
  },
};
