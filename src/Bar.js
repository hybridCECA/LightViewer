import React from "react";

const Bar = (props) => {
  if (!props.show) {
    return null;
  }

  // Conditionally set subgroup bar
  // Set group to button on image view and span on subgroup view
  let subgroupBar, group;
  if (props.showSubgroup) {
    subgroupBar = (
      <div className="bar barElement">
        <button
          className="barButton barElement"
          onClick={() => props.changeSubgroup(-1, true)}
        >
          &lt;
        </button>
        <span> </span>
        <button
          className="barButton barElement"
          onClick={props.toggleThumbnailView}
        >
          {props.subgroup}
        </button>
        <span> </span>
        <button
          className="barButton barElement"
          onClick={() => props.changeSubgroup(1, true)}
        >
          &gt;
        </button>
      </div>
    );
    group = (
      <button
        className="barButton barElement"
        onClick={() => props.back(1)}
      >
        {props.group}
      </button>
    );
  } else {
    group = <span>{props.group}</span>;
  }

  return (
    <div>
      <div className="bar barElement">
        <button
          className="barButton barElement"
          onClick={() => props.back(0)}
        >
          ≡
        </button>
        <span> </span>
        {group}
      </div>
      {subgroupBar}
    </div>
  );
};

export default Bar;