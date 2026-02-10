import {
  derived,
  get,
  type Readable,
  type Writable,
  writable
} from "svelte/store";

import { type ZodType, z } from "zod";

// biome-ignore lint: no any
type CreateFormParams<T extends Record<string, any>> = {
  schema: ZodType<T>;
  defaultValues: T;
  disabledFields?: (keyof T)[];
  resetOnSuccess?: boolean;
  resetDisabledFields?: (keyof T)[];
  onPending?: () => void | Promise<void>;
  onSubmit?: (data: T) => Promise<void> | void;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
  onRollback?: () => void | Promise<void>;
};

// biome-ignore lint: no any
type CreateFormReturn<T extends Record<string, any>> = {
  formData: Writable<T>;
  formErrors: Writable<Partial<Record<keyof T, string>>>;
  isSubmitting: Writable<boolean>;
  handleInput: (event: Event) => void;
  handleSubmit: (event: Event) => Promise<void>;
  setDisabledFields: (fields: (keyof T)[]) => void;
  resetForm: (values?: T) => void;
  getField: <K extends keyof T>(key: K) => Writable<T[K]>;
  getError: <K extends keyof T>(key: K) => Readable<string | undefined>;
  setError: <K extends keyof T>(key: K, message: string) => void;
  clearError: <K extends keyof T>(key: K) => void;
  clearErrors: <K extends keyof T>(keys?: K[]) => void;
  validateField: (field: keyof T, value?: unknown) => void;
};

// biome-ignore lint: no any
export function useForm<T extends Record<string, any>>({
  schema,
  defaultValues,
  disabledFields: initialDisabledFields = [],
  resetOnSuccess = true,
  resetDisabledFields = [],
  onPending,
  onSubmit,
  onSuccess,
  onError,
  onRollback
}: CreateFormParams<T>): CreateFormReturn<T> {
  const formData = writable<T>({ ...defaultValues });
  const formErrors = writable<Partial<Record<keyof T, string>>>({});
  const isSubmitting = writable(false);
  let submitted = false;

  const disabledFields = writable<Set<keyof T>>(new Set(initialDisabledFields));
  const resetDisabledSet = new Set<keyof T>(resetDisabledFields);

  function setDisabledFields(fields: (keyof T)[]) {
    disabledFields.set(new Set(fields));
  }

  function validateField(field: keyof T, value?: unknown) {
    if (get(disabledFields).has(field)) {
      formErrors.update((e) => ({ ...e, [field]: "" }));
      return;
    }

    const currentData = get(formData);
    const dataForValidation =
      value !== undefined ? { ...currentData, [field]: value } : currentData;
    const result = schema.safeParse(dataForValidation);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      const errorMessage =
        (fieldErrors[field as keyof typeof fieldErrors] || [])[0] || "";
      formErrors.update((e) => ({ ...e, [field]: errorMessage }));
    } else {
      formErrors.update((e) => ({ ...e, [field]: "" }));
    }
  }

  function validateForm(data: T): boolean {
    const disabled = get(disabledFields);
    const result = schema.safeParse(data);
    formErrors.set({});

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      const newFormErrors: Partial<Record<keyof T, string>> = {};
      let hasErrorsForEnabledFields = false;

      for (const key in fieldErrors) {
        const typedKey = key as keyof T;
        if (!disabled.has(typedKey)) {
          newFormErrors[typedKey] = fieldErrors[typedKey]?.[0] || "";
          hasErrorsForEnabledFields = true;
        }
      }

      formErrors.set(newFormErrors);
      return !hasErrorsForEnabledFields;
    }

    return true;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    formData.update((data) => {
      let updatedValue: unknown;

      if (type === "number") updatedValue = value === "" ? null : +value;
      else if (type === "checkbox") updatedValue = checked;
      else updatedValue = value;

      const updatedData = { ...data, [name]: updatedValue } as T;

      if (submitted) validateField(name as keyof T, updatedValue);

      return updatedData;
    });
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    submitted = true;

    const data = get(formData);
    const isValid = validateForm(data);

    if (!isValid) {
      console.log("Form validation failed:", get(formErrors));
      return;
    }

    isSubmitting.set(true);
    try {
      await onPending?.();
      await onSubmit?.(data);

      if (resetOnSuccess) resetForm(defaultValues);

      await onSuccess?.(data);
    } catch (err) {
      console.error("Error during form submission:", err);
      await onError?.(err);
      await onRollback?.();
    } finally {
      isSubmitting.set(false);
    }
  }

  function resetForm(values: T = defaultValues) {
    formData.update((current) => {
      const updated: T = { ...current };

      for (const key in values) {
        if (!resetDisabledSet.has(key as keyof T)) {
          updated[key as keyof T] = values[key as keyof T];
        }
      }

      return updated;
    });

    formErrors.set({});
    submitted = false;
  }

  function getField<K extends keyof T>(key: K): Writable<T[K]> {
    return {
      subscribe: (run) => formData.subscribe(($data) => run($data[key])),
      set: (value: T[K]) => {
        formData.update((data) => ({ ...data, [key]: value }));
        if (submitted) validateField(key, value);
      },
      update: (fn) => {
        formData.update((data) => {
          const value = fn(data[key]);
          if (submitted) validateField(key, value);
          return { ...data, [key]: value };
        });
      }
    };
  }

  function getError<K extends keyof T>(key: K): Readable<string | undefined> {
    return derived(formErrors, ($errors) => $errors[key]);
  }

  function setError<K extends keyof T>(key: K, message: string) {
    formErrors.update((errors) => ({ ...errors, [key]: message }));
  }

  function clearError<K extends keyof T>(key: K) {
    formErrors.update((errors) => {
      const updated = { ...errors };
      delete updated[key];
      return updated;
    });
  }

  function clearErrors<K extends keyof T>(keys?: K[]) {
    if (!keys) {
      formErrors.set({});
    } else {
      formErrors.update((errors) => {
        const updated = { ...errors };
        for (const key of keys) {
          delete updated[key];
        }
        return updated;
      });
    }
  }

  return {
    formData,
    formErrors,
    isSubmitting,
    handleInput,
    handleSubmit,
    setDisabledFields,
    resetForm,
    getField,
    getError,
    setError,
    clearError,
    clearErrors,
    validateField
  };
}
