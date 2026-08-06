import React, { useId, useRef, useState, useEffect, useLayoutEffect } from "react";
// @ts-ignore react-dom types will be resolved when @types/react-dom is available
import { createPortal } from "react-dom";
import "./MultiSelect.css";

export type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type MultiSelectProps = {
  /** Field label */
  label?: string;
  /** Helper text below the field */
  helper?: string;
  /** Error message */
  error?: string;
  /** List of options */
  options?: MultiSelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Disables interaction */
  disabled?: boolean;
  /** Controlled selected values */
  value?: string[];
  /** Uncontrolled default values */
  defaultValue?: string[];
  /** Change handler */
  onChange?: (value: string[]) => void;
  /** Element id */
  id?: string;
  /** Additional CSS class names */
  className?: string;
};

export function MultiSelect({
  label,
  helper,
  error,
  options = [],
  placeholder = "Select…",
  disabled = false,
  value,
  defaultValue = [],
  onChange,
  id: idProp,
  className = "",
}: MultiSelectProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const isError = !!error;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const selected = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        rootRef.current && !rootRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const el = controlRef.current;
    if (!el) return undefined;
    const measure = () => setMenuRect(el.getBoundingClientRect());
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open]);

  const commit = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const toggle = (val: string) =>
    commit(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  const remove = (val: string) => commit(selected.filter((v) => v !== val));
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    commit([]);
  };

  const labelFor = (val: string) => options.find((o) => o.value === val)?.label ?? val;

  const wrapCls = [
    "multiselect",
    open && "is-open",
    isError && "is-error",
    disabled && "is-disabled",
  ].filter(Boolean).join(" ");

  return (
    <div className={"field " + className} ref={rootRef}>
      {label && <span className="field__label" id={`${id}-label`}>{label}</span>}
      <div className={wrapCls}>
        <button
          ref={controlRef}
          type="button"
          className="multiselect__control"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? `${id}-label` : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="multiselect__values">
            {selected.length === 0 ? (
              <span className="multiselect__placeholder">{placeholder}</span>
            ) : (
              selected.map((val) => (
                <span className="multiselect__chip" key={val}>
                  {labelFor(val)}
                  <span
                    className="material-symbols-rounded multiselect__chip-x"
                    role="button"
                    aria-label={`Remove ${labelFor(val)}`}
                    onClick={(e) => { e.stopPropagation(); if (!disabled) remove(val); }}
                  >
                    close
                  </span>
                </span>
              ))
            )}
          </span>
          {selected.length > 0 && !disabled && (
            <span
              className="material-symbols-rounded multiselect__clear"
              role="button"
              aria-label="Clear all"
              onClick={clearAll}
            >
              close
            </span>
          )}
          <span className="material-symbols-rounded multiselect__chevron" aria-hidden="true">
            expand_more
          </span>
        </button>

        {open && !disabled && menuRect && createPortal(
          <ul
            ref={menuRef}
            className="multiselect__menu"
            role="listbox"
            aria-multiselectable="true"
            style={{
              top: menuRect.bottom + 4,
              left: menuRect.left,
              width: menuRect.width,
            }}
          >
            {options.map((o) => {
              const on = selected.includes(o.value);
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={on}
                  className={"multiselect__option" + (on ? " is-selected" : "")}
                  aria-disabled={o.disabled || undefined}
                  onClick={() => !o.disabled && toggle(o.value)}
                >
                  <span className="multiselect__check material-symbols-rounded" aria-hidden="true">
                    {on ? "check_box" : "check_box_outline_blank"}
                  </span>
                  {o.label}
                </li>
              );
            })}
          </ul>,
          document.body
        )}
      </div>
      {(helper || error) && (
        <span className={"field__helper" + (isError ? " is-error" : "")}>{error || helper}</span>
      )}
    </div>
  );
}
