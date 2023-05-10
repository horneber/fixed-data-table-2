/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is to be used with the FixedDataTable. It is a header icon
 * that allows you to reorder the corresponding column.
 *
 * @providesModule FixedDataTableColumnReorderHandle
 * @typechecks
 */

import React from 'react';
import PropTypes from 'prop-types';

import cx from './vendor_upstream/stubs/cx';
import DOMMouseMoveTracker from './vendor_upstream/dom/DOMMouseMoveTracker';
import FixedDataTableEventHelper from './FixedDataTableEventHelper';

class CustomColumnReorderHandle extends React.PureComponent {
  static propTypes = {
    /**
     * When resizing is complete this is called.
     */
    onColumnReorderEnd: PropTypes.func,

    /**
     * Column key for the column being reordered.
     */
    columnKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    // TODO HH impl?
    onColumnReorderMove: PropTypes.func,
    onMouseDown: PropTypes.func,
  };

  state = /*object*/ {
    dragDistance: 0,
  };

  componentWillUnmount() {
    // TODO HH
    console.log('CustomColumnReorderHandle componentWillUnmount');

    if (this._mouseMoveTracker) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      this._mouseMoveTracker.releaseMouseMoves();
      this._mouseMoveTracker = null;
    }
  }

  render() /*object*/ {
    // TODO HH
    console.log('CustomColumnReorderHandle render');
    var style = {
      height: this.props.height,
    };
    return (
      <div
        className={cx({
          'customColumnReorderHandle/columnReorderContainer': true,
          // TODO HH this seems to be never set in any css file, but maybe interactively somehow?
          'customColumnReorderHandle/columnReorderContainer/active': false,
        })}
        onMouseDown={this.onMouseDown}
        style={style}
      ></div>
    );
  }

  onMouseDown = (event) => {
    // TODO HH
    console.log('CustomColumnReorderHandle onMouseDown');
    var targetRect = event.target.getBoundingClientRect();
    var coordinates = FixedDataTableEventHelper.getCoordinatesFromEvent(event);

    var mouseLocationInElement = coordinates.x - targetRect.left;
    var mouseLocationInRelationToColumnGroup =
      mouseLocationInElement + event.target.parentElement.offsetLeft;

    this._mouseMoveTracker = new DOMMouseMoveTracker(
      this._onMove,
      this._onColumnReorderEnd,
      document.body,
      this.props.touchEnabled
    );
    this._mouseMoveTracker.captureMouseMoves(event);
    this.setState({
      dragDistance: 0,
    });
    this.props.onMouseDown({
      columnKey: this.props.columnKey,
      mouseLocation: {
        dragDistance: 0,
        inElement: mouseLocationInElement,
        inColumnGroup: mouseLocationInRelationToColumnGroup,
      },
    });

    this._distance = 0;
    this._animating = true;
    this.frameId = requestAnimationFrame(this._updateState);
  };

  _onMove = (/*number*/ deltaX) => {
    // TODO HH
    console.log('CustomColumnReorderHandle _onMove');
    this._distance =
      this.state.dragDistance + deltaX * (this.props.isRTL ? -1 : 1);
  };

  _onColumnReorderEnd = (/*boolean*/ cancelReorder) => {
    // TODO HH
    console.log('CustomColumnReorderHandle _onColumnReorderEnd start');
    this._animating = false;
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
    if (this._mouseMoveTracker) {
      this._mouseMoveTracker.releaseMouseMoves();
    }
    this.props.columnReorderingData.cancelReorder = cancelReorder;
    this.props.onColumnReorderEnd();
    console.log('CustomColumnReorderHandle _onColumnReorderEnd end');
  };

  _updateState = () => {
    // TODO HH
    console.log('CustomColumnReorderHandle _updateState');
    if (this._animating) {
      this.frameId = requestAnimationFrame(this._updateState);
    }
    this.setState({
      dragDistance: this._distance,
    });
    this.props.onColumnReorderMove(this._distance);
  };
}
export default CustomColumnReorderHandle;
