interface FieldProps {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}

export const Field = (props: FieldProps) => {
  return (
    <div className="flex flex-column gap-1">
      <label className="text-sm font-medium" style={{ color: "#333333" }}>
        {props.label}
      </label>
      {props.children}
    </div>
  );
};
