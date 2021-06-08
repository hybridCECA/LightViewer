import React from "react";
import jQuery from "jquery";

// Import other components
import ImgView from "./ImgView.js";
import ThumbView from "./ThumbView.js";
import Bar from "./Bar.js";
import List from "./List.js";

const $ = (window.$ = window.jQuery = jQuery);

// Main app class
export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      content: 0, // 0: Group List   1: Subgroup List   2: Image   3: Thumbnails
      groupName: "",
      subgroupName: ""
    };

    // Bind context to passed functions
    this.backToContent = this.backToContent.bind(this);
    this.toggleThumbnailView = this.toggleThumbnailView.bind(this);
    this.changeSubgroup = this.changeSubgroup.bind(this);
    this.onSubgroupClick = this.onSubgroupClick.bind(this);
    this.onGroupClick = this.onGroupClick.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.setImage = this.setImage.bind(this);
    this.getImgSource = this.getImgSource.bind(this);
    this.hasImg = this.hasImg.bind(this);

    // Execute getJSON's synchronously
    $.ajaxSetup({
      async: false
    });

    // Load config file
    let config = $.getJSON("lightviewer_config.json");
    let groupListFile;

    if (
      config.responseJSON === undefined ||
      config.responseJSON.groupListFile === undefined
    ) {
      groupListFile = "group_list.json";
    } else {
      groupListFile = config.responseJSON.groupListFile;
    }

    if (
      config.responseJSON === undefined ||
      config.responseJSON.buttonConfig === undefined
    ) {
      this.buttonConfig = {
        delayTime: null,
        buttonWidth: null,
        triangleLength: null
      };
    } else {
      this.buttonConfig = config.responseJSON.buttonConfig;
    }

    // Get group list
    let data = $.getJSON(groupListFile);
    this.groupList = data.responseJSON.list;

    // Load URL Parameters
    let url = new URL(window.location);
    let tName = url.searchParams.get("group");
    this.groupNum = this.search(this.groupList, tName);
    // Restore if not null
    if (this.groupNum != null) {
      this.populateSubgroupList();
      let cName = url.searchParams.get("subgroup");
      this.subgroupNum = this.search(this.subgroupList, cName);

      if (this.subgroupNum != null) {
        this.state = { content: 2, subgroupName: cName };
      } else {
        this.state.content = 1;
      }

      this.state.groupName = tName;
    }
    this.imgNum = parseInt(url.searchParams.get("image"), 10);
    this.imgNum = isNaN(this.imgNum) ? null : this.imgNum;
  }

  // Updates current URL parameters with group, subgroup, and image number
  updateURLParams() {
    let url = new URL(window.location);
    this.setParam(url, this.groupNum, "group", this.groupList);
    this.setParam(url, this.subgroupNum, "subgroup", this.subgroupList);
    this.setParam(url, this.imgNum, "image");
    window.history.pushState({}, null, url);
  }

  // Sets a single parameter, either uses array.name or index
  setParam(url, index, key, array) {
    if (index != null) {
      if (array !== undefined) index = array[index].name;

      url.searchParams.set(key, index);
    } else {
      url.searchParams.delete(key);
    }
  }

  // Search list for name and returns index
  search(list, name) {
    let index = 0;
    for (let element of list) {
      if (element.name === name) return index;

      index++;
    }
    return null;
  }

  // Used by bar to return to higher view
  backToContent(i) {
    this.imgNum = null;
    this.subgroupNum = null;
    this.groupNum = i === 0 ? null : this.groupNum;
    this.setState({ content: i });
  }

  toggleThumbnailView() {
    if (this.state.content === 2) {
      this.setState({ content: 3 });
    } else {
      this.setState({ content: 2 });
    }
  }

  // Change subgroup in a direction
  // start is a boolean which sets to last page if false
  // returns true if subgroup successfully changed
  changeSubgroup(direction, start) {
    if (!this.hasSubgroup(direction)) return false;

    this.subgroupNum += direction;

    this.imgNum = 0;
    // If start is false, iterate to last page
    while (!start && this.hasImg(this.imgNum + 1)) {
      this.imgNum++;
    }

    this.setState({
      content: 2,
      subgroupName: this.subgroupList[this.subgroupNum].name
    });

    return true;
  }

  // Checks if index subgroup exists
  hasSubgroup(i) {
    let newSubgroup = this.subgroupNum + i;
    return newSubgroup >= 0 && newSubgroup < this.subgroupList.length;
  }

  // Sets subgroup
  onSubgroupClick(i) {
    this.subgroupNum = i;
    this.changeSubgroup(0, true);
  }

  // Sets group
  onGroupClick(i) {
    this.groupNum = i;
    this.populateSubgroupList();
    this.setState({
      content: 1,
      groupName: this.groupList[this.groupNum].name
    });
  }

  // Fills subgroup list with subgroups from current group
  populateSubgroupList() {
    // Get subgroup list filename or use default
    let subgroupListFile = this.groupList[this.groupNum].subgroupListFile;
    if (subgroupListFile === undefined) {
      subgroupListFile = "subgroup_list.json";
    }
    let data = $.getJSON(
      this.groupList[this.groupNum].directory + "/" + subgroupListFile
    );
    this.subgroupList = data.responseJSON.list;
  }

  // Gets source for image
  getImgSource(i) {
    const group = this.groupList[this.groupNum];
    const subgroup = this.subgroupList[this.subgroupNum];
    // Choose prefix and postfix with preference for subgroup values
    const prefix =
      subgroup.imagePrefix === undefined
        ? group.imagePrefix
        : subgroup.imagePrefix;
    const postfix =
      subgroup.imagePostfix === undefined
        ? group.imagePostfix
        : subgroup.imagePostfix;

    return (
      "/" +
      group.directory +
      "/" +
      subgroup.directory +
      "/" +
      prefix +
      (i + 1) +
      postfix
    );
  }

  // Check if image index exists
  hasImg(i) {
    let exists = this.hasFile(this.getImgSource(i));
    return exists;
  }

  // Check if file exists
  hasFile(file) {
    try {
      require(`../public${file}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Change image in a direction
  changeImage(direction) {
    if (this.hasImg(this.imgNum + direction)) {
      this.imgNum += direction;
      this.setState({});
      return true;
    } else {
      return this.changeSubgroup(direction, direction === 1);
    }
  }

  // Set image to an index
  setImage(i) {
    this.imgNum = i;
    this.setState({ content: 2 });
  }

  render() {
    // Update URL parameters every update
    this.updateURLParams();

    // Boolean variables for appearance of full bar and subgroup bar
    let bar, subgroupBar;
    bar = subgroupBar = false;

    // Choose content view based on state.content
    let content;
    switch (this.state.content) {
      case 0:
        // Group list
        content = (
          <div>
            <span className="listText">LightViewer</span>
            <p />
            <List
              onClick={this.onGroupClick}
              list={this.groupList}
              parentDirectory={""}
            />
          </div>
        );
        break;
      case 1:
        // Subgroup list
        bar = true;
        content = (
          <List
            onClick={this.onSubgroupClick}
            list={this.subgroupList}
            parentDirectory={this.groupList[this.groupNum].directory}
          />
        );
        break;
      case 2:
        // Image
        bar = true;
        subgroupBar = true;
        content = (
          <ImgView
            getSource={() => this.getImgSource(this.imgNum)}
            changeImage={this.changeImage}
            buttonConfig={this.buttonConfig}
          />
        );
        break;
      default:
        // Thumbnails
        bar = true;
        subgroupBar = true;
        content = (
          <ThumbView
            hasImg={this.hasImg}
            getImgSource={this.getImgSource}
            setImage={this.setImage}
          />
        );
        break;
    }

    // Returns bar and content
    return (
      <>
        <Bar
          show={bar}
          showSubgroup={subgroupBar}
          group={this.state.groupName}
          subgroup={this.state.subgroupName}
          back={this.backToContent}
          changeSubgroup={this.changeSubgroup}
          toggleThumbnailView={this.toggleThumbnailView}
        />
        {content}
      </>
    );
  }
}
