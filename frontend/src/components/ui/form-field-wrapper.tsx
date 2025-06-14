import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "date" | "textarea" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
}

export function FormFieldWrapper<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  options = [],
  required = false,
}: FormFieldWrapperProps<T>) {
  const renderInput = (field: any) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={name}
            placeholder={placeholder}
            {...field}
          />
        );
      case "select":
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            {...field}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Label htmlFor={name} className="font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <FormControl>
            {renderInput(field)}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
