import { render, screen, fireEvent } from '@testing-library/react';
import { DiscrepanciesFilterDropdown } from './discrepancies-filter-dropdown.component';
import { expect } from 'vitest';

test('should render provided filterIds as dropdown options', () => {
  // given
  const filterIds = ['id1', 'id2', 'id3'];
  const filterId = 'id2';
  const handleIdFilterChanged = () => {};

  // when
  render(
    <DiscrepanciesFilterDropdown
      labelName="Test Label"
      filterId={filterId}
      filterIds={filterIds}
      handleIdFilterChanged={handleIdFilterChanged}
    />,
  );

  const dropdown = screen.getByTestId('ArrowDropDownIcon');
  expect(dropdown).toBeInTheDocument();

  fireEvent.mouseDown(screen.getByRole('button'));
  const dropdownOptions = screen.getAllByRole('option');
  const dropdownOptionsValues = dropdownOptions.map(option => option.textContent);

  // then
  expect(dropdownOptions).toHaveLength(filterIds.length);

  filterIds.forEach(id => {
    expect(dropdownOptionsValues.includes(id)).toBe(true);
  });
  expect(filterIds.length).toBe(dropdownOptionsValues.length);
});
