import React from "react";

export default class ThumbView extends React.Component {
  render() {
    let thumbnails = [];
    let i = 0;

    // Iterate over all images and add thumbnails
    while (this.props.hasImg(i)) {
      thumbnails.push(
        <div className="listCol" key={i}>
          <img
            className="thumbnail"
            alt="Thumbnail"
            src={this.props.getImgSource(i)}
            onClick={(i => {
              return () => this.props.setImage(i);
            })(i)}
          />
        </div>
      );
      i++;
    }

    return <div>{thumbnails}</div>;
  }
}
