import React from "react";
import { PageTitle } from "./PageTitle";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../Breadcrumb/Breadcrumb";
import { Button } from "../Button/Button";
import { AssetMark } from "../AssetMark/AssetMark";

function crumb(...labels: string[]) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {labels.map((label, i) => {
          const isLast = i === labels.length - 1;
          return (
            <React.Fragment key={label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default {
  title: "P1 Components/Page Title",
  component: PageTitle,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 960 }}><S /></div>],
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    className: { control: "text" },
  },
  args: {
    title: "Transaction History",
    subtitle: "All transactions across XSGD, XIDR, and XUSD.",
  },
};

export const Default = {
  args: { title: "Transaction History", subtitle: "All transactions across XSGD, XIDR, and XUSD." },
};

export const WithoutSubtitle = {
  args: { title: "Transaction History" },
};

export const WithActions = {
  args: {
    title: "Transaction History",
    subtitle: "All transactions across XSGD, XIDR, and XUSD.",
    actions: (
      <>
        <Button variant="secondary" size="md">Export CSV</Button>
        <Button variant="primary" size="md">New transfer</Button>
      </>
    ),
  },
};

export const WithBreadcrumb = {
  args: {
    title: "Tx 0x9a1b…",
    breadcrumb: crumb("Home", "Transaction History", "Tx 0x9a1b…"),
  },
};

export const WithBreadcrumbAndActions = {
  args: {
    title: "Transaction Details",
    subtitle: "Review the details of this transaction.",
    breadcrumb: crumb("Home", "Transaction History", "Details"),
    actions: (
      <>
        <Button variant="secondary" size="md">Download</Button>
        <Button variant="primary" size="md">Share</Button>
      </>
    ),
  },
};

export const WithAssetMark = {
  args: {
    title: <><AssetMark asset="XSGD" size={24} /> XSGD</>,
    subtitle: "Singapore Dollar-pegged stablecoin on multiple networks.",
    actions: (
      <>
        <Button variant="secondary" size="md">Send</Button>
        <Button variant="primary" size="md">Receive</Button>
      </>
    ),
  },
};

