import React from "react";

export default class Bar extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    // Conditionally set subgroup bar
    // Set group to button on image view and span on subgroup view
    let subgroupBar, group;
    if (this.props.showSubgroup) {
      subgroupBar = (
        <div className="bar barElement">
          <button
            className="barButton barElement"
            onClick={() => this.props.changeSubgroup(-1, true)}
          >
            &lt;
          </button>
          <span> </span>
          <button
            className="barButton barElement"
            onClick={this.props.toggleThumbnailView}
          >
            {this.props.subgroup}
          </button>
          <span> </span>
          <button
            className="barButton barElement"
            onClick={() => this.props.changeSubgroup(1, true)}
          >
            &gt;
          </button>
        </div>
      );
      group = (
        <button
          className="barButton barElement"
          onClick={() => this.props.back(1)}
        >
          {this.props.group}
        </button>
      );
    } else {
      group = <span>{this.props.group}</span>;
    }

    return (
      <div>
        <div className="bar barElement">
          <button
            className="barButton barElement"
            onClick={() => this.props.back(0)}
          >
            ≡
          </button>
          <span> </span>
          {group}
        </div>
        {subgroupBar}
      </div>
    );
  }
}
