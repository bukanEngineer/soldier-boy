import React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { withClass } from "../../lib/cn";
import "./Field.css";

export type FieldRootProps = BaseField.Root.Props;

function FieldRoot({ className, ...props }: FieldRootProps) {
  return <BaseField.Root className={withClass("field", className)} {...props} />;
}

export type FieldLabelProps = BaseField.Label.Props;

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <BaseField.Label className={withClass("field__label", className)} {...props} />;
}

export type FieldDescriptionProps = BaseField.Description.Props;

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <BaseField.Description className={withClass("field__description", className)} {...props} />
  );
}

export type FieldErrorProps = BaseField.Error.Props;

/**
 * Error message. Shown when the field fails native/`validate` validation; pass
 * `match` to show it unconditionally (e.g. server errors with `invalid` on Root).
 */
function FieldError({ className, ...props }: FieldErrorProps) {
  return <BaseField.Error className={withClass("field__error", className)} {...props} />;
}

/**
 * Field built on Base UI. Wires label, description and error to the control
 * (ids, aria-describedby, aria-invalid) and exposes state as data attributes.
 *
 *   <Field.Root invalid={!!error}>
 *     <Field.Label>Email</Field.Label>
 *     <Input />
 *     <Field.Description>We'll never share it.</Field.Description>
 *     <Field.Error match>{error}</Field.Error>
 *   </Field.Root>
 */
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: BaseField.Control,
  Description: FieldDescription,
  Error: FieldError,
  Item: BaseField.Item,
  Validity: BaseField.Validity,
};
