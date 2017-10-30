/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../Label';
import { LabelText } from '../BaseControls';
import Slider from './Slider';
import { noop, isNil, divide, isArray } from 'lodash';

const ValueLabel = LabelText.extend`
  text-align: ${props =>
    props.inline ? 'center' : props.lowerFill ? 'left' : 'right'};
  margin: auto;
`;

const ValueLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${props => (props.inline ? '90' : props.width)}px;
  margin: 0 5px;
  text-align: center;
`;

const RangedSlider = styled.div`
  position: relative;
  min-height: 35px;
  width: ${props => props.width}px;
`;

const ExtendedSlider = styled(Slider)`
  position: absolute;

  &::-webkit-slider-thumb {
    position: relative;
    z-index: 1;
  }

  // &::-webkit-slider-runnable-track {
  //   padding-right: ${props => (props.lowerFill ? props.maxValue : '')}px;
  //   padding-left: ${props => (props.lowerFill ? '' : props.minValue)}px;
  // }
`;

const limitedArray = function(props, propName, componentName) {
  if (!isArray(props.initialValues) || props.initialValues.length !== 2) {
    return new Error(
      `${propName} in ${componentName} cannot contain more than two numbers`
    );
  }
  return null;
};

class RangeSlider extends React.Component {
  static propTypes = {
    labelText: PropTypes.string,
    name: PropTypes.string,
    inline: PropTypes.bool,
    isVertical: PropTypes.bool,
    multiple: PropTypes.bool,
    displayValues: PropTypes.bool,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    width: PropTypes.number,
    stepValue: PropTypes.number,
    initialValues: PropTypes.oneOfType([PropTypes.number, limitedArray]),
    lowerRangeInitialValue: PropTypes.number,
    handleOnValueChanged: PropTypes.func
  };

  static defaultProps = {
    handleOnValueChanged: noop,
    name: 'sliderName',
    width: 200,
    minValue: 0,
    maxValue: 100,
    stepValue: 1,
    multiple: false
  };

  constructor(props) {
    super(props);

    this.state = {
      currentValues:
        isArray(props.initialValues) || props.multiple
          ? {
              [`${props.name}-lower`]: isNil(props.initialValues)
                ? props.minValue
                : props.initialValues[0],
              [`${props.name}-upper`]: isNil(props.initialValues)
                ? props.maxValue
                : props.initialValues[1]
            }
          : {
              [`${props.name}-upper`]: isNil(props.initialValues)
                ? divide(props.maxValue, 2)
                : props.initialValues
            }
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.renderLowerFill = this.renderLowerFill.bind(this);
    this.renderValueLabels = this.renderValueLabels.bind(this);
  }

  handleOnChange(event) {
    const { value, name } = event.target;
    const { currentValues } = this.state;

    currentValues[name] = value;

    this.setState(
      {
        currentValues
      },
      () => this.props.handleOnValueChanged(value, name)
    );
  }

  renderLowerFill(lowerValue) {
    const { name, width, minValue, maxValue } = this.props;

    return (
      <ExtendedSlider
        name={`${name}-lower`}
        lowerFill
        width={width}
        maxValue={maxValue}
        minValue={minValue}
        value={lowerValue}
        onChange={this.handleOnChange}
      />
    );
  }

  renderValueLabels(
    inline,
    width,
    upperValue,
    lowerValue,
    isMultiRange,
    displayInlineLowerValue = false
  ) {
    return (
      <ValueLabelsContainer width={width} inline={inline}>
        {displayInlineLowerValue
          ? ''
          : isMultiRange
            ? <ValueLabel inline={inline} lowerFill>
                {lowerValue}
              </ValueLabel>
            : ''}
        {displayInlineLowerValue
          ? ''
          : <ValueLabel inline={inline}>
              {upperValue}
            </ValueLabel>}
      </ValueLabelsContainer>
    );
  }

  render() {
    const {
      labelText = 'label',
      name,
      width,
      minValue,
      maxValue,
      multiple,
      inline,
      displayValues = true
    } = this.props;
    const upperValue = this.state.currentValues[`${name}-upper`];
    const lowerValue = this.state.currentValues[`${name}-lower`];

    const isMultiRange = multiple || lowerValue;

    return (
      <Label inline={inline}>
        <LabelText inline={inline}>
          {labelText}
        </LabelText>
        {displayValues
          ? this.renderValueLabels(
              inline,
              width,
              upperValue,
              lowerValue,
              isMultiRange,
              true
            )
          : ''}
        <RangedSlider name={name} width={width}>
          <ExtendedSlider
            name={`${name}-upper`}
            width={width}
            maxValue={maxValue}
            minValue={minValue}
            value={upperValue}
            onChange={this.handleOnChange}
          />
          {isMultiRange ? this.renderLowerFill(lowerValue) : ''}
        </RangedSlider>
        {displayValues
          ? this.renderValueLabels(
              inline,
              width,
              upperValue,
              lowerValue,
              isMultiRange
            )
          : ''}
      </Label>
    );
  }
}

export default RangeSlider;
