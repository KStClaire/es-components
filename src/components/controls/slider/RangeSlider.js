import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../Label';
import { LabelText } from '../BaseControls';
import Slider from './Slider';
import { noop, isNil, divide, isArray, size } from 'lodash';

const ValueLabel = LabelText.extend`
  text-align: ${props => (props.inline ? 'center' : props.alignment)};
  margin: ${props => (props.inline ? 'auto' : '')};
`;

const ValueLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${props => (props.inline ? '90' : props.width)}px;
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
`;

const limitedArray = (props, propName, componentName) => {
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
    displayValues: PropTypes.bool,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    width: PropTypes.number,
    stepValue: PropTypes.number,
    rangeLimit: PropTypes.number,
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
    rangeLimit: 5,
    displayValues: true,
    inline: false
  };

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
    const { rangeLimit } = this.props;

    let finalValue;
    if (size(currentValues) < 2) {
      finalValue = value;
    } else if (name.includes('upper')) {
      const lowerValue = parseInt(
        currentValues[`${this.props.name}-lower`],
        10
      );
      finalValue =
        value > lowerValue + rangeLimit ? value : lowerValue + rangeLimit;
    } else if (name.includes('lower')) {
      const upperValue = parseInt(
        currentValues[`${this.props.name}-upper`],
        10
      );
      finalValue =
        value < upperValue - rangeLimit ? value : upperValue - rangeLimit;
    }

    currentValues[name] = finalValue;

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

  renderValueLabels(lowerValue, upperValue) {
    const { inline, width } = this.props;
    const hasLowerValue = lowerValue >= 0;
    const hasUpperValue = upperValue >= 0;
    const upperAlignment = hasLowerValue ? 'right' : 'left';

    return (
      <ValueLabelsContainer width={width} inline={inline}>
        {hasLowerValue ? (
          <ValueLabel inline={inline} alignment={'left'}>
            {lowerValue}
          </ValueLabel>
        ) : (
          ''
        )}
        {hasUpperValue ? (
          <ValueLabel inline={inline} alignment={upperAlignment}>
            {upperValue}
          </ValueLabel>
        ) : (
          ''
        )}
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
      inline,
      displayValues
    } = this.props;
    const upperValue = this.state.currentValues[`${name}-upper`];
    const lowerValue = this.state.currentValues[`${name}-lower`];
    const displayInlineLabels = displayValues && inline;
    const hasLowerValue = lowerValue >= 0;

    return (
      <Label inline={inline}>
        <LabelText inline={inline}>{labelText}</LabelText>
        {displayInlineLabels && hasLowerValue
          ? this.renderValueLabels(lowerValue)
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
          {hasLowerValue ? this.renderLowerFill(lowerValue) : ''}
        </RangedSlider>
        {displayInlineLabels
          ? this.renderValueLabels(undefined, upperValue)
          : this.renderValueLabels(lowerValue, upperValue)}
      </Label>
    );
  }
}

export default RangeSlider;
