/* eslint-disable no-confusing-arrow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../Label';
import { LabelText } from '../BaseControls';
import Slider from './Slider';
import { noop, isNil, divide, isArray } from 'lodash';

const ValueLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${props => (props.isVerticalOrInline ? '35' : props.width)}px;
  margin: 10px 15px;
`;

const ValueLabel = LabelText.extend`
  text-align: ${props =>
    props.isVerticalOrInline ? 'center' : props.alignment};
  margin: ${props => (props.isVerticalOrInline ? 'auto' : '')};
`;

const SliderContainer = styled.div`
  width: ${props => props.width}px;
  height: ${props => (props.vertical ? props.width : '35')}px;
  margin: 0 15px;
`;

const RangedSlider = styled.div`
  height: 100%;
  transform: ${props => (props.vertical ? 'rotate(-90deg)' : '')};
  transform-origin: center;
`;

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValues: isArray(props.initialValues)
        ? {
          [`${props.name}-lower`]: props.initialValues[0],
          [`${props.name}-upper`]: props.initialValues[1]
        }
        : {
          [`${props.name}-upper`]: isNil(props.initialValues)
              ? divide(props.minValue + props.maxValue, 2)
              : props.initialValues
        },
      isMultiRange: isArray(props.initialValues)
    };

    this.renderLabel = this.renderLabel.bind(this);
    this.renderSlider = this.renderSlider.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.renderValueLabels = this.renderValueLabels.bind(this);
  }

  handleOnChange(event) {
    const { value, name } = event.target;
    const { currentValues, isMultiRange } = this.state;
    const { rangeLimit } = this.props;

    let finalValue;
    if (!isMultiRange) {
      finalValue = value;
    } else if (isMultiRange && name.includes('lower')) {
      const upperValue =
        parseFloat(currentValues[`${this.props.name}-upper`], 10) - rangeLimit;
      finalValue = value < upperValue ? value : upperValue;
    } else if (isMultiRange && name.includes('upper')) {
      const lowerValue =
        parseFloat(currentValues[`${this.props.name}-lower`], 10) + rangeLimit;
      finalValue = value > lowerValue ? value : lowerValue;
    }

    currentValues[name] = finalValue;

    this.setState(
      {
        currentValues
      },
      () => this.props.onValueChanged(value, name)
    );
  }

  renderLabel(value, alignment, isVerticalOrInline) {
    return (
      <ValueLabel alignment={alignment} isVerticalOrInline={isVerticalOrInline}>
        {value}
      </ValueLabel>
    );
  }

  renderValueLabels(
    lowerValue,
    upperValue,
    isMultiRange,
    isVerticalOrInline,
    firstLabel = false
  ) {
    const { width, inline, vertical } = this.props;
    const alignment = isMultiRange ? 'right' : 'left';
    const isFirstLabelDisplayed =
      (firstLabel && inline) || (!firstLabel && vertical);
    const showLowerLabel =
      isMultiRange && (isFirstLabelDisplayed || !isVerticalOrInline);
    const showUpperLabel =
      !isFirstLabelDisplayed || !isMultiRange || !isVerticalOrInline;

    return (
      <ValueLabelsContainer
        width={width}
        isVerticalOrInline={isVerticalOrInline}
      >
        {showLowerLabel
          ? this.renderLabel(lowerValue, !alignment, isVerticalOrInline)
          : ''}
        {showUpperLabel
          ? this.renderLabel(upperValue, alignment, isVerticalOrInline)
          : ''}
      </ValueLabelsContainer>
    );
  }

  renderSlider(name, value, isMultiRange, isLowerFill = false) {
    const { width, minValue, maxValue, stepValue } = this.props;

    return (
      <Slider
        name={name}
        value={value}
        width={width}
        maxValue={maxValue}
        minValue={minValue}
        stepValue={stepValue}
        isLowerFill={isLowerFill}
        isMultiRange={isMultiRange}
        onChange={this.handleOnChange}
      />
    );
  }

  render() {
    const {
      labelText,
      name,
      width,
      inline,
      vertical,
      displayValues
    } = this.props;
    const { isMultiRange, currentValues } = this.state;
    const upperValue = currentValues[`${name}-upper`];
    const lowerValue = currentValues[`${name}-lower`];
    const isVerticalOrInline = inline || vertical;
    const displayInlineLabels =
      displayValues && isMultiRange && isVerticalOrInline;

    return (
      <Label inline={inline}>
        <LabelText inline={inline}>{labelText}</LabelText>
        {displayInlineLabels
          ? this.renderValueLabels(
              lowerValue,
              upperValue,
              isMultiRange,
              isVerticalOrInline,
              true
            )
          : ''}
        <SliderContainer width={width} vertical={vertical}>
          <RangedSlider name={name} width={width} vertical={vertical}>
            {isMultiRange
              ? this.renderSlider(
                  `${name}-lower`,
                  lowerValue,
                  isMultiRange,
                  true
                )
              : ''}
            {this.renderSlider(`${name}-upper`, upperValue, isMultiRange)}
          </RangedSlider>
        </SliderContainer>
        {displayValues
          ? this.renderValueLabels(
              lowerValue,
              upperValue,
              isMultiRange,
              isVerticalOrInline
            )
          : ''}
      </Label>
    );
  }
}

RangeSlider.propTypes = {
  labelText: PropTypes.string.isRequired,
  /** The name of the input */
  name: PropTypes.string.isRequired,
  /** The width of the slider itself */
  width: PropTypes.number,
  /** Display label and values inline with slider */
  inline: PropTypes.bool,
  /** Display slider and values vertically */
  vertical: PropTypes.bool,
  /** The minimum value limit of the range */
  minValue: PropTypes.number,
  /** The maximum value limit of the range */
  maxValue: PropTypes.number,
  /** The increment that the slider increases or decreases by */
  stepValue: PropTypes.number,
  /** The amount of space enforced between the slider's multiple handles */
  rangeLimit: PropTypes.number,
  /** Display the value(s) of the slider */
  displayValues: PropTypes.bool,
  /** Function to execute when the slider's value(s) changes */
  onValueChanged: PropTypes.func,
  /** The starting value(s) of the input. Can be one number or an array of two numbers. */
  initialValues: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf((props, propName, componentName) => {
      if (props.length !== 2 || typeof props[propName] !== 'number') {
        return new Error();
      }
      return null;
    })
  ])
};

RangeSlider.defaultProps = {
  width: 200,
  minValue: 0,
  maxValue: 100,
  stepValue: 1,
  rangeLimit: 5,
  displayValues: true,
  inline: false,
  vertical: false,
  onValueChanged: noop
};

export default RangeSlider;
