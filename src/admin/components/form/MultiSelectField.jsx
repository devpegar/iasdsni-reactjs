import clsx from "clsx";
import TagMultiSelect from "../TagMultiSelect";

export default function MultiSelectField({
  label,
  options,
  value,
  placeholder,
  onChange,
  span = false,
}) {
  return (
    <div className={clsx({ "full-span": span })}>
      {label && <label className="label">{label}</label>}

      <TagMultiSelect
        options={options}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
