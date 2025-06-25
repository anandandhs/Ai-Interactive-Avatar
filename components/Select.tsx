import React from "react";
import { Dropdown } from "primereact/dropdown";

interface SelectProps<T> {
  options: T[];
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  isSelected: (option: T) => boolean;
  value: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
}

export function Select<T>(props: SelectProps<T>) {
  // Find the selected option object
  const selectedOption = props.options.find(props.isSelected);

  // Transform options for PrimeReact Dropdown
  const dropdownOptions = props.options.map((option, index) => ({
    label: props.renderOption(option)?.toString() || `Option ${index}`,
    value: option,
  }));

  const handleChange = (e: { value: T }) => {
    if (e.value) {
      props.onSelect(e.value);
    }
  };

  return (
    <Dropdown
      value={selectedOption}
      options={dropdownOptions}
      onChange={handleChange}
      placeholder={props.placeholder}
      disabled={props.disabled}
      className="w-full"
      optionLabel="label"
    />
  );
}
