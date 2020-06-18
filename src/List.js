import React from "react";

export default class List extends React.Component {
  render() {
    // Array of elements to display
    let items = [];

    // Index of element
    let i = 0;
    for (let element of this.props.list) {
      // Conditionally set thumbnails and subtext
      let thumbnail, subtext;
      if (element.thumbnail !== undefined) {
        const thumbnailDir =
          this.props.parentDirectory +
          "/" +
          element.directory +
          "/" +
          element.thumbnail;
        thumbnail = (
          <div className="listCol">
            <img className="thumbnail" alt="Thumbnail" src={thumbnailDir} />
          </div>
        );
      }

      if (element.subtext !== undefined) {
        subtext = <p className="listSubtext">{element.subtext}</p>;
      }

      // Add element of list
      items.push(
        <div
          className="listElement"
          key={i}
          onClick={(i => {
            return () => this.props.onClick(i);
          })(i)}
        >
          {thumbnail}
          <div className="listCol">
            <span className="listText">{element.name}</span>
            {subtext}
          </div>
        </div>
      );
      i++;
    }

    return <div>{items}</div>;
  }
}
