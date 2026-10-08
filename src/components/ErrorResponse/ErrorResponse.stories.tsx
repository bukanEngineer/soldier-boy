import React from "react";
import { ErrorResponse } from "./ErrorResponse";
import { Button } from "../Button/Button";
import {
  LinkExpiredLockedIllustration,
  MaintenanceWrenchIllustration,
} from "../Illustration/illustrations/index";

export default {
  title: "Components/Error Response",
  component: ErrorResponse,
  parameters: { layout: "fullscreen" },
  argTypes: {
    code: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    className: { control: "text" },
  },
  args: {
    code: "404",
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
  },
};

export const NotFound = {
  args: {
    code: "404",
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    actions: <Button>Go home</Button>,
  },
};

export const Error400 = {
  args: {
    code: "400",
    title: "Bad request",
    description: "The request couldn't be processed. Please check your details and try again.",
    actions: <Button>Try again</Button>,
  },
};

export const Error401 = {
  args: {
    code: "401",
    title: "Session expired",
    description: "You've been signed out. Please log in again to continue.",
    actions: <Button>Log in</Button>,
  },
};

export const Error403 = {
  args: {
    code: "403",
    title: "Access denied",
    description: "You don't have permission to view this page. Contact your administrator if you think this is a mistake.",
    actions: <Button variant="secondary">Go back</Button>,
  },
};

export const Error408 = {
  args: {
    code: "408",
    title: "Request timed out",
    description: "The request took too long to complete. Please check your connection and try again.",
    actions: <Button>Retry</Button>,
  },
};

export const ServerError = {
  args: {
    code: "500",
    title: "Something went wrong",
    description: "We're investigating. Please try again in a few minutes.",
    actions: (
      <>
        <Button variant="secondary">Refresh</Button>
        <Button>Contact support</Button>
      </>
    ),
  },
};

export const KycRejected = {
  args: {
    title: "Verification unsuccessful",
    description: "We weren't able to verify your identity with the documents you provided. Please review and resubmit.",
    actions: <Button>Resubmit documents</Button>,
  },
};

export const Maintenance = {
  args: {
    media: <MaintenanceWrenchIllustration />,
    code: "503",
    title: "We'll be right back",
    description: "StraitsX is undergoing scheduled maintenance. Please try again shortly.",
  },
};

export const LinkExpired = {
  args: {
    media: <LinkExpiredLockedIllustration />,
    title: "This link has expired",
    description: "Request a new link to continue.",
    actions: <Button>Request new link</Button>,
  },
};
