// Package entry — re-exports every component.
// CSS is NOT auto-imported here; consumers import what they want:
//   import "soldier-boy/global.css";
//   import "soldier-boy/tokens.css";

// ─── Theme & Constants ───
export { theme } from "./theme/theme";
export type { Theme } from "./theme/theme";
export { ThemeProvider, useTheme } from "./theme/ThemeContext";
export type { ThemeProviderProps } from "./theme/ThemeContext";

export {
  BRAND,
  STABLECOIN,
  BASE_COLOR,
  BACKGROUND,
  STATUS,
  BUTTON_COLORS,
  FONT_FAMILY,
  TYPOGRAPHY,
  SPACING,
  SPACING_PX,
  BREAKPOINTS,
  MEDIA,
  SHADOW,
  RADIUS,
  MOTION,
} from "./constants";

export {
  TEXT_COLORS,
  BACKGROUND_COLORS,
  STATUS_COLORS,
  INTERACTIVE_COLORS,
} from "./shared/ColorStyles";

export {
  FONT_WEIGHT,
  FONT_STYLE,
} from "./shared/TypographyStyles";

// ─── Components ───

// Primitives
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { IconButton } from "./components/IconButton";
export type { IconButtonProps } from "./components/IconButton";
export { LinkButton } from "./components/LinkButton";
export type { LinkButtonProps } from "./components/LinkButton";
export { Tag } from "./components/Tag";
export type { TagProps } from "./components/Tag";
export { Badge } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

// Form
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { Select } from "./components/Select";
export type { SelectProps, SelectOption } from "./components/Select";
export { MultiSelect } from "./components/MultiSelect";
export type { MultiSelectProps } from "./components/MultiSelect";
export { DateInput } from "./components/DateInput";
export type { DateInputProps } from "./components/DateInput";
export { Calendar } from "./components/Calendar";
export type { CalendarProps } from "./components/Calendar";
export { Copybox } from "./components/Copybox";
export type { CopyboxProps } from "./components/Copybox";
export { InputCurrency } from "./components/InputCurrency";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
export { Radio, RadioGroup } from "./components/Radio";
export type { RadioProps, RadioGroupProps } from "./components/Radio";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export { Upload } from "./components/Upload";

// Layout / data
export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";
export { Tabs } from "./components/Tabs";
export type { TabsProps, TabItem } from "./components/Tabs";
export { Table } from "./components/Table";
export { Pagination } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";
export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbProps } from "./components/Breadcrumb";
export { PageTitle } from "./components/PageTitle";
export type { PageTitleProps } from "./components/PageTitle";
export { HorizontalSteps, VerticalSteps, BadgeSteps } from "./components/Steps";
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";
export { ErrorResponse } from "./components/ErrorResponse";
export type { ErrorResponseProps } from "./components/ErrorResponse";
export { QR } from "./components/QR";
export type { QRProps } from "./components/QR";

// Feedback
export { Alert } from "./components/Alert";
export type { AlertProps, AlertTone } from "./components/Alert";
export { ImportantNotes } from "./components/ImportantNotes";
export type { ImportantNotesProps } from "./components/ImportantNotes";
export { Toast, ToastProvider, useToast } from "./components/Toast";
export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
export { BottomSheet } from "./components/BottomSheet";
export type { BottomSheetProps } from "./components/BottomSheet";
export { Tooltip } from "./components/Tooltip";
export { Menu } from "./components/Menu";
export { Coachmark } from "./components/Coachmark";

// Composition (dashboard kit)
export { Sidebar, DEFAULT_NAV_ITEMS } from "./components/Sidebar";
export { TopNavigation } from "./components/TopNavigation";
export { OtcBanner } from "./components/OtcBanner";

// Brand
export { Logomark } from "./components/Logomark";
export type { LogomarkProps } from "./components/Logomark";
export { Logo } from "./components/Logo";
export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";
export { PartnerLogo } from "./components/PartnerLogo";

// --- Net-new product components (StraitsX Figma) ---
export { CardAsset } from "./components/CardAsset";
export { CardSwap } from "./components/CardSwap";
export { CardStatus } from "./components/CardStatus";
export { CardSummary } from "./components/CardSummary";
export { CardChecklist } from "./components/CardChecklist";
export { CardAttribute } from "./components/CardAttribute";
export { CardSteps } from "./components/CardSteps";
export { EstimatedBalance } from "./components/EstimatedBalance";
export { ListAsset } from "./components/ListAsset";
export { ListBlockchain } from "./components/ListBlockchain";
export { InlineCrossAsset } from "./components/InlineCrossAsset";
export { ListBank } from "./components/ListBank";
export { ListSupportedNetwork } from "./components/ListSupportedNetwork";
export { StatusIcon } from "./components/StatusIcon";
export { DropdownAsset } from "./components/DropdownAsset";
export { DropdownNetwork } from "./components/DropdownNetwork";
export { FieldNetwork } from "./components/FieldNetwork";
export { FieldBank } from "./components/FieldBank";
export { FieldBlockchain } from "./components/FieldBlockchain";
export { ModalAssetOverview } from "./components/ModalAssetOverview";
export { ModalAssetSelection } from "./components/ModalAssetSelection";
export { BottomSheetNetwork } from "./components/BottomSheetNetwork";
export { Modal2FA } from "./components/Modal2FA";
export { TransactionHistoryTable } from "./components/TransactionHistoryTable";
export { AssetMark } from "./components/AssetMark";
export { CompanyProfileMenu } from "./components/CompanyProfileMenu";
export { SelectionBox } from "./components/SelectionBox";
export { DropdownBank } from "./components/DropdownBank";
export { DropdownBlockchain } from "./components/DropdownBlockchain";
export { BottomSheetBank } from "./components/BottomSheetBank";
export { TopNavProfileMenu } from "./components/TopNavProfileMenu";
export { BottomSheetBlockchain } from "./components/BottomSheetBlockchain";
