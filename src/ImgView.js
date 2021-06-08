import React from "react";

// Default config
let DELAY_TIME = 100;
let BUTTON_WIDTH_FRACTION = 1 / 5;
let TRIANGLE_LENGTH = 15;

// Dynamically drawn left and right arrow
// Draws a right triangle missing hypotenuse
const Arrow = (props) => {
  let x = new Array(3);
  let y = new Array(3);

  x[0] = TRIANGLE_LENGTH;
  y[0] = TRIANGLE_LENGTH;

  x[1] = TRIANGLE_LENGTH * 2;
  y[1] = TRIANGLE_LENGTH * 2;

  x[2] = TRIANGLE_LENGTH;
  y[2] = TRIANGLE_LENGTH * 3;

  return (
    <svg
      style={{
        position: "absolute",
        left: `${props.x - TRIANGLE_LENGTH * 1.5}px`,
        top: `${props.y - TRIANGLE_LENGTH * 2}px`
      }}
      transform={props.invert ? "scale(-1,1)" : "scale(1,1)"}
      height={TRIANGLE_LENGTH * 4}
      width={TRIANGLE_LENGTH * 3}
    >
      <polyline
        className="lineIcon"
        points={`${x[0]},${y[0]} ${x[1]},${y[1]} ${x[2]},${y[2]}`}
      />
    </svg>
  );
};

// Gray button area animation
// Dynamically shown and positioned
class ButtonArea extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div>
        <svg
          style={{
            position: "absolute",
            left: `${this.props.coordinates.x}px`,
            top: `${this.props.coordinates.y}`
          }}
          width={this.props.coordinates.w}
          height={this.props.coordinates.h}
        >
          <rect
            className="buttonArea"
            width={this.props.coordinates.w}
            height={this.props.coordinates.h}
          />
        </svg>
        <Arrow
          x={this.props.coordinates.x + this.props.coordinates.w / 2}
          y={this.props.coordinates.y + this.props.coordinates.h / 2}
          invert={this.props.left}
        />
      </div>
    );
  }
}

// Image and animation class
export default class ImgView extends React.Component {
  constructor(props) {
    super(props);

    DELAY_TIME = this.props.buttonConfig.delayTime || DELAY_TIME;
    BUTTON_WIDTH_FRACTION = this.props.buttonConfig.buttonWidth || BUTTON_WIDTH_FRACTION;
    TRIANGLE_LENGTH = this.props.buttonConfig.triangleLength || TRIANGLE_LENGTH;

    // Initialize state
    this.state = {
      areaShow: false,
      leftArrow: false,
      areaCoordinates: {}
    };

    // Image ref to get image dimensions and position
    this.imgRef = React.createRef();

    // Bind context to passed functions
    this.onImageClick = this.onImageClick.bind(this);
    this.closeArea = this.closeArea.bind(this);
  }

  // Handle image click
  onImageClick(event) {
    const btnWidth = event.target.clientWidth * BUTTON_WIDTH_FRACTION;

    // If clicked on the far left or right, change image
    let change = event.pageX < btnWidth ? -1 : 0;
    change = event.pageX > event.target.clientWidth - btnWidth ? 1 : change;

    if (change !== 0) {
      if (this.props.changeImage(change)) {
        this.showAnimation(event.target, change);
      }
    }
  }

  // Displays button animation on the right or left
  showAnimation(box, direction) {
    const btnWidth = box.clientWidth * BUTTON_WIDTH_FRACTION;

    // Set coordinates for animation
    let coordinates = {
      x: box.offsetLeft,
      y: box.offsetTop,
      w: btnWidth,
      h: box.clientHeight
    };
    if (direction === 1) {
      coordinates.x += box.clientWidth - btnWidth;
    }
    this.setState({
      areaShow: true,
      leftArrow: direction === -1,
      areaCoordinates: coordinates
    });

    // Close animation after DELAY_TIME milliseconds
    setTimeout(this.closeArea, DELAY_TIME);
  }

  // Animation close function
  closeArea() {
    if (this.state.areaShow) this.setState({ areaShow: false });
  }

  render() {
    return (
      <div 
        className="imgBox"
        onClick={this.onImageClick}
      >
        <img
          src={this.props.getSource()}
          alt={this.props.source}
          ref={this.imgRef}
        />
        <ButtonArea
          show={this.state.areaShow}
          left={this.state.leftArrow}
          coordinates={this.state.areaCoordinates}
        />
      </div>
    );
  }
}
