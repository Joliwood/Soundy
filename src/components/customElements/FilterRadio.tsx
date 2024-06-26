import React, { useMemo } from 'react';
import { ReleaseYear, DurationRange } from '../../types/__generated_schemas__/graphql';

interface Props {
  inputId: string;
  labelText: string;
  value?: ReleaseYear | DurationRange;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
  yearFilter?: ReleaseYear;
  durationFilter?: DurationRange;
}

function FilterRadio({
  inputId, labelText, value, setFilter, yearFilter, durationFilter,
}: Props): JSX.Element {
  const checkedStatus = useMemo(() => {
    if (yearFilter) {
      if (yearFilter === value) {
        return true;
      }
    }
    if (durationFilter) {
      if (durationFilter === value) {
        return true;
      }
    }
    return false;
  }, [yearFilter, durationFilter, value]);

  return (
    <div className="form-control">
      <label htmlFor={inputId} className="label cursor-pointer">
        <span className="label-text px-2 font-semibold text-xs min-[860px]:text-sm">{labelText}</span>
        <input
          id={inputId}
          checked={checkedStatus}
          type="radio"
          name="radio-10"
          value={value}
          className="radio radio-xs min-[860px]:radio-sm bg-base-200"
          onChange={() => setFilter(value)}
        />
      </label>
    </div>
  );
}

export default FilterRadio;
