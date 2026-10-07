// Package entry — re-exports every component.
// CSS is NOT auto-imported here; consumers import what they want:
//   import "stxdesign-sandbox/global.css";
//   import "stxdesign-sandbox/tokens.css";

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

export { cn, withClass } from "./lib/cn";

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
export { ButtonGroup } from "./components/ButtonGroup";
export type { ButtonGroupProps, ButtonGroupOrientation } from "./components/ButtonGroup";
export { Tag } from "./components/Tag";
export type { TagProps } from "./components/Tag";
export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeWrapProps } from "./components/Badge";

// Form
export { Field } from "./components/Field";
export type { FieldRootProps, FieldLabelProps, FieldDescriptionProps, FieldErrorProps } from "./components/Field";
export { Input } from "./components/Input";
export type { InputProps, InputTrailingButton } from "./components/Input";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { Select } from "./components/Select";
export type {
  SelectRootProps,
  SelectControlProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIconProps,
  SelectClearProps,
  SelectPopupProps,
  SelectListProps,
  SelectItemProps,
  SelectGroupProps,
  SelectGroupLabelProps,
  SelectSeparatorProps,
} from "./components/Select";
export { MultiSelect } from "./components/MultiSelect";
export type {
  MultiSelectRootProps,
  MultiSelectInputGroupProps,
  MultiSelectChipsProps,
  MultiSelectChipProps,
  MultiSelectChipRemoveProps,
  MultiSelectInputProps,
  MultiSelectClearProps,
  MultiSelectTriggerProps,
  MultiSelectPopupProps,
  MultiSelectListProps,
  MultiSelectEmptyProps,
  MultiSelectItemProps,
  MultiSelectValueProps,
} from "./components/MultiSelect";
export { DateInput } from "./components/DateInput";
export type { DateInputProps } from "./components/DateInput";
export { Calendar } from "./components/Calendar";
export type { CalendarProps } from "./components/Calendar";
export { Copybox } from "./components/Copybox";
export type { CopyboxProps } from "./components/Copybox";
export { InputCurrency } from "./components/InputCurrency";
export type {
  InputCurrencyProps,
  InputCurrencyAsset,
  InputCurrencyAssetOption,
  InputCurrencyLinkButton,
} from "./components/InputCurrency";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxRootProps, CheckboxIndicatorProps, CheckboxGroupProps } from "./components/Checkbox";
export { Radio } from "./components/Radio";
export type { RadioGroupProps, RadioRootProps, RadioIndicatorProps } from "./components/Radio";
export { Switch } from "./components/Switch";
export type { SwitchRootProps, SwitchThumbProps } from "./components/Switch";
export { Upload } from "./components/Upload";
export type { UploadProps, UploadFile, UploadHandlers } from "./components/Upload";

// Layout / data
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/Card";
export type {
  CardProps,
  CardShadow,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./components/Card";
export { Tabs } from "./components/Tabs";
export type { TabsRootProps, TabsListProps, TabsTabProps, TabsPanelProps } from "./components/Tabs";
export {
  Table,
  TableWrap,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTable,
} from "./components/Table";
export type {
  TableProps,
  TableWrapProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
  DataTableProps,
  DataTableColumn,
  DataTableSort,
} from "./components/Table";
export { Pagination, PaginationNav, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, PaginationSummary, buildPaginationPages } from "./components/Pagination";
export type {
  PaginationProps,
  PaginationNavProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
  PaginationSummaryProps,
} from "./components/Pagination";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbButton,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/Breadcrumb";
export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbButtonProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from "./components/Breadcrumb";
export { PageTitle } from "./components/PageTitle";
export type { PageTitleProps } from "./components/PageTitle";
export {
  HorizontalSteps,
  VerticalSteps,
  VerticalStep,
  BadgeSteps,
  BadgeStepsTitle,
  BadgeStepsDescription,
} from "./components/Steps";
export type {
  HorizontalStepsProps,
  VerticalStepsProps,
  VerticalStepProps,
  VerticalStepStatus,
  BadgeStepsProps,
  BadgeStepsTitleProps,
  BadgeStepsDescriptionProps,
} from "./components/Steps";
export { EmptyState, EmptyStateTitle, EmptyStateDescription } from "./components/EmptyState";
export type {
  EmptyStateProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
} from "./components/EmptyState";
export { ErrorResponse, ErrorResponseCode, ErrorResponseTitle, ErrorResponseDescription, ErrorResponseActions } from "./components/ErrorResponse";
export type {
  ErrorResponseProps,
  ErrorResponseCodeProps,
  ErrorResponseTitleProps,
  ErrorResponseDescriptionProps,
  ErrorResponseActionsProps,
} from "./components/ErrorResponse";
export { QR } from "./components/QR";
export type { QRProps } from "./components/QR";

// Feedback
export { Alert, AlertTitle, AlertDescription, AlertActions } from "./components/Alert";
export type {
  AlertProps,
  AlertTone,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionsProps,
} from "./components/Alert";
export { ImportantNotes } from "./components/ImportantNotes";
export type { ImportantNotesProps } from "./components/ImportantNotes";
export { Toast, ToastProvider, useToast, useOptionalToast } from "./components/Toast";
export { Modal } from "./components/Modal";
export type { ModalRootProps, ModalTriggerProps, ModalPopupProps, ModalHeaderProps, ModalTitleProps, ModalDescriptionProps, ModalCloseProps, ModalMediaProps, ModalIllustrationProps, ModalBodyProps, ModalFooterProps } from "./components/Modal";
export { BottomSheet } from "./components/BottomSheet";
export type { BottomSheetRootProps, BottomSheetTriggerProps, BottomSheetPopupProps, BottomSheetHeaderProps, BottomSheetTitleProps, BottomSheetDescriptionProps, BottomSheetCloseProps, BottomSheetBodyProps, BottomSheetFooterProps } from "./components/BottomSheet";
export { Tooltip } from "./components/Tooltip";
export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPopupProps,
} from "./components/Tooltip";
export { Popover } from "./components/Popover";
export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverPopupProps,
  PopoverHeaderProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverCloseProps,
  PopoverFooterProps,
} from "./components/Popover";
export { Menu } from "./components/Menu";
export type {
  MenuRootProps,
  MenuTriggerProps,
  MenuPopupProps,
  MenuItemProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuCheckboxItemProps,
  MenuSeparatorProps,
  MenuGroupProps,
  MenuGroupLabelProps,
} from "./components/Menu";
export { Coachmark } from "./components/Coachmark";
export type { CoachmarkProps } from "./components/Coachmark";

// Composition (dashboard kit)
export {
  Sidebar,
  DEFAULT_NAV_ITEMS,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
} from "./components/Sidebar";
export type {
  SidebarProps,
  SidebarNavItem,
  SidebarSubItem,
  SidebarCompany,
  SidebarAccount,
  SidebarContextValue,
  SidebarProviderProps,
  SidebarTriggerProps,
} from "./components/Sidebar";
export { TopNavigation } from "./components/TopNavigation";
export type { TopNavigationProps, TopNavigationUser } from "./components/TopNavigation";
export { OtcBanner } from "./components/OtcBanner";
export type { OtcBannerProps } from "./components/OtcBanner";

// Brand
export { Logomark } from "./components/Logomark";
export type { LogomarkProps } from "./components/Logomark";
export { Logo } from "./components/Logo";
export type { LogoProps, LogoTone } from "./components/Logo";
export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";
export { PartnerLogo } from "./components/PartnerLogo";
export type { PartnerLogoProps } from "./components/PartnerLogo";

// --- Net-new product components (StraitsX Figma) ---
export { CardAsset } from "./components/CardAsset";
export type { CardAssetProps, CardAssetItem, CardAssetNetwork } from "./components/CardAsset";
export { CardSwap } from "./components/CardSwap";
export type { CardSwapProps, CardSwapLeg } from "./components/CardSwap";
export { CardStatus } from "./components/CardStatus";
export type {
  CardStatusProps,
  CardStatusSection,
  CardStatusSectionItem,
} from "./components/CardStatus";
export { CardSummary } from "./components/CardSummary";
export type {
  CardSummaryProps,
  CardSummaryItem,
  CardSummaryCurrencySide,
} from "./components/CardSummary";
export { CardChecklist } from "./components/CardChecklist";
export type {
  CardChecklistProps,
  CardChecklistItem,
  CardChecklistTab,
} from "./components/CardChecklist";
export { CardAttribute } from "./components/CardAttribute";
export type { CardAttributeProps, CardAttributeItem } from "./components/CardAttribute";
export { CardSteps } from "./components/CardSteps";
export type { CardStepsProps, CardStepsOption, CardStepsOptionsProps } from "./components/CardSteps";
export { EstimatedBalance } from "./components/EstimatedBalance";
export type { EstimatedBalanceProps } from "./components/EstimatedBalance";
export { ListAsset } from "./components/ListAsset";
export type { ListAssetProps, ListAssetVariant, ListAssetPlatform } from "./components/ListAsset";
export { ListBlockchain } from "./components/ListBlockchain";
export type { ListBlockchainProps, ListBlockchainVariant } from "./components/ListBlockchain";
export { InlineCrossAsset } from "./components/InlineCrossAsset";
export type { InlineCrossAssetProps } from "./components/InlineCrossAsset";
export { ListBank } from "./components/ListBank";
export type { ListBankProps, ListBankVariant } from "./components/ListBank";
export { ListSupportedNetwork } from "./components/ListSupportedNetwork";
export type { ListSupportedNetworkProps } from "./components/ListSupportedNetwork";
export { StatusIcon } from "./components/StatusIcon";
export type { StatusIconProps, StatusIconVariant } from "./components/StatusIcon";
export { DropdownAsset } from "./components/DropdownAsset";
export type { DropdownAssetProps, DropdownAssetOption } from "./components/DropdownAsset";
export { DropdownNetwork } from "./components/DropdownNetwork";
export type { DropdownNetworkProps, DropdownNetworkOption } from "./components/DropdownNetwork";
export { DropdownBank } from "./components/DropdownBank";
export type { DropdownBankProps, DropdownBankOption } from "./components/DropdownBank";
export { DropdownBlockchain } from "./components/DropdownBlockchain";
export type { DropdownBlockchainProps, DropdownBlockchainOption } from "./components/DropdownBlockchain";
export { OptionList } from "./components/OptionList";
export type {
  OptionListProps,
  OptionListItem,
  OptionListTag,
  OptionListTagVariant,
} from "./components/OptionList";
export { FieldNetwork } from "./components/FieldNetwork";
export type { FieldNetworkProps, FieldNetworkOption } from "./components/FieldNetwork";
export { FieldBank } from "./components/FieldBank";
export type { FieldBankProps, FieldBankOption } from "./components/FieldBank";
export { FieldBlockchain } from "./components/FieldBlockchain";
export type { FieldBlockchainProps, FieldBlockchainOption } from "./components/FieldBlockchain";
export { FieldOptionSelect } from "./components/FieldOptionSelect";
export type {
  FieldOptionSelectProps,
  FieldOption,
  FieldOptionStatus,
  FieldOptionAction,
} from "./components/FieldOptionSelect";
export { ModalAssetOverview } from "./components/ModalAssetOverview";
export type { ModalAssetOverviewProps, AssetMethod, AssetNetwork } from "./components/ModalAssetOverview";
export { ModalAssetSelection } from "./components/ModalAssetSelection";
export type { ModalAssetSelectionProps, AssetOption } from "./components/ModalAssetSelection";
export { BottomSheetNetwork } from "./components/BottomSheetNetwork";
export type { BottomSheetNetworkProps, NetworkOption } from "./components/BottomSheetNetwork";
export { Modal2FA } from "./components/Modal2FA";
export type { Modal2FAProps } from "./components/Modal2FA";
export { TransactionHistoryTable } from "./components/TransactionHistoryTable";
export type {
  TransactionHistoryTableProps,
  TransactionHistoryType,
} from "./components/TransactionHistoryTable";
export { AssetMark } from "./components/AssetMark";
export type { AssetMarkProps, AssetMarkTone } from "./components/AssetMark";
export { CompanyProfileMenu } from "./components/CompanyProfileMenu";
export type {
  CompanyProfileMenuProps,
  CompanyProfileCompany,
  CompanyProfileAction,
} from "./components/CompanyProfileMenu";
export { SelectionBox } from "./components/SelectionBox";
export type { SelectionBoxProps } from "./components/SelectionBox";
export { BottomSheetBank } from "./components/BottomSheetBank";
export type { BottomSheetBankProps, BankOption } from "./components/BottomSheetBank";
export { TopNavProfileMenu } from "./components/TopNavProfileMenu";
export type { TopNavProfileMenuProps, TopNavAccount } from "./components/TopNavProfileMenu";
export { BottomSheetBlockchain } from "./components/BottomSheetBlockchain";
export type { BottomSheetBlockchainProps, BlockchainOption } from "./components/BottomSheetBlockchain";
