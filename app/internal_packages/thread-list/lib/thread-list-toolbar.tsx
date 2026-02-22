import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Thread } from 'mailspring-exports';
import { MultiselectToolbar } from 'mailspring-component-kit';
import InjectsToolbarButtons, { ToolbarRole } from './injects-toolbar-buttons';
import ThreadListSortDropdown from './thread-list-sort-dropdown';
import ThreadListStore from './thread-list-store';

interface ThreadListToolbarProps {
  items: Thread[];
  injectedButtons: any;
  selection: { clear: () => void };
}

interface ThreadListToolbarState {
  sortOrder: string;
}

class ThreadListToolbar extends Component<ThreadListToolbarProps, ThreadListToolbarState> {
  static displayName = 'ThreadListToolbar';

  static propTypes = {
    items: PropTypes.array,
    selection: PropTypes.shape({
      clear: PropTypes.func,
    }),
    injectedButtons: PropTypes.element,
  };

  _unsubscribe: () => void;

  constructor(props) {
    super(props);
    this.state = {
      sortOrder: ThreadListStore.sortOrder(),
    };
  }

  componentDidMount() {
    this._unsubscribe = ThreadListStore.listen(this._onStoreChange);
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _onStoreChange = () => {
    this.setState({
      sortOrder: ThreadListStore.sortOrder(),
    });
  };

  onClearSelection = () => {
    this.props.selection.clear();
  };

  _onSortChanged = (sortOrder: string) => {
    ThreadListStore.setSortOrder(sortOrder);
  };

  render() {
    const { injectedButtons, items } = this.props;

    // Show sort dropdown when no items are selected
    const showSortDropdown = items.length === 0;

    return (
      <MultiselectToolbar
        collection="thread"
        selectionCount={items.length}
        toolbarElement={injectedButtons}
        onClearSelection={this.onClearSelection}
      >
        {showSortDropdown && (
          <ThreadListSortDropdown
            selectedSort={this.state.sortOrder}
            onSortChanged={this._onSortChanged}
          />
        )}
      </MultiselectToolbar>
    );
  }
}

const toolbarProps = {
  extraRoles: [`ThreadList:${ToolbarRole}`],
};

export default InjectsToolbarButtons(ThreadListToolbar, toolbarProps);
