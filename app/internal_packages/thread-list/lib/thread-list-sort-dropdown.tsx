import React, { Component } from 'react';
import { Menu, ButtonDropdown, RetinaImg } from 'mailspring-component-kit';
import { localized } from 'mailspring-exports';

interface ThreadListSortDropdownProps {
  selectedSort: string;
  onSortChanged: (sortOrder: string) => void;
}

export default class ThreadListSortDropdown extends Component<ThreadListSortDropdownProps> {
  static displayName = 'ThreadListSortDropdown';

  _sortOptions = [
    { key: 'date', label: localized('Date') },
    { key: 'subject', label: localized('Subject') },
    { key: 'contact', label: localized('Contact') },
    { key: 'size', label: localized('Size') },
  ];

  _onSortSelected = sortKey => {
    this.props.onSortChanged(sortKey);
  };

  render() {
    const selected = this._sortOptions.find(o => o.key === this.props.selectedSort);
    const sortLabel = selected ? selected.label : localized('Date');

    const headerComponents = [
      <span key="label">{localized('Sort by:')}</span>,
      <span key="value" style={{ marginLeft: 5 }}>
        {sortLabel}
      </span>,
    ];

    return (
      <ButtonDropdown
        primaryItem={<span>{headerComponents}</span>}
        menu={
          <Menu
            items={this._sortOptions}
            itemKey={item => item.key}
            itemContent={item => item.label}
            onSelect={this._onSortSelected}
          />
        }
      />
    );
  }
}
