import React, { Component } from "react";
import PropTypes from "prop-types";
import { mS, screenHeight, screenWidth } from "../../widgets/ResponsiveScreen";
import { ButtonCard } from "./ButtonCard";
import { View } from "react-native";

class PrevNextComponent extends Component {
  render() {
    console.warn("showExit", this.props.showExit);
    if (this.props.showSubmit) {
      return (
        <View
          style={{
            height: mS(screenHeight * 0.1),
            width: screenWidth,
            position: "absolute",
            bottom: mS(16),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: mS(16 * 2),
            paddingRight: mS(16 * 2)
          }}
        >
          <ButtonCard
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: screenWidth / 2 - 50
            }}
            item={{ text: "Prev." }}
            addToSelected={() => {
              this.props.onPrev();
            }}
            isSelected={false}
          />
          <ButtonCard
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: screenWidth / 2 - 50
            }}
            item={{ text: "Submit" }}
            addToSelected={() => {
              this.props.onSubmit();
            }}
            isSelected={true}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          height: mS(screenHeight * 0.1),
          width: screenWidth,
          position: "absolute",
          bottom: mS(16),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: mS(16 * 2),
          paddingRight: mS(16 * 2)
        }}
      >
        <ButtonCard
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: screenWidth / 2 - 50
          }}
          item={{ text: !!this.props.showExit ? "Exit Survey" : "Prev." }}
          addToSelected={() => {
            !!this.props.showExit ? this.props.onExit() : this.props.onPrev();
          }}
          isSelected={false}
        />
        <ButtonCard
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: screenWidth / 2 - 50
          }}
          item={{ text: "Next" }}
          addToSelected={() => {
            this.props.onNext();
          }}
          isSelected={true}
        />
      </View>
    );
  }
}

// PrevNextComponent.propTypes = {};

export default PrevNextComponent;
