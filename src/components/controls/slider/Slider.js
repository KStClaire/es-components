import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../theme';

function createFill(width, fillLower) {
  let fill = `0 0 0 -8px ${colors.gray}`;

  for (let i = 0; i <= width; i++) {
    fill = `${fill}, ${fillLower ? '-' : ''}${i}px 0 0 -8px ${colors.gray}`;
  }

  return fill;
}

const SliderInput = styled.input`
  appearance: none;
  background: none;
  cursor: pointer;
  min-height: 35px;
  overflow: hidden;
  margin: 0;
  width: 100%;
  height: ${props => (props.isVertical ? props.width : '35')}px;
  transform: ${props => (props.isVertical ? 'rotate(-90deg)' : '')};

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background: ${colors.grayDarker};
    height: 9px;
  }

  &::-webkit-slider-thumb {
    height: 25px;
    width: 25px;
    appearance: none;
    background: ${colors.accent};
    border-radius: 100px;
    box-shadow: ${props => createFill(props.width, props.lowerFill)};
    margin-top: -8px;

    &:hover {
      background: ${colors.accentLighter};
    }

    &:active {
      background: ${colors.magenta};
    }
  }
`;

function Slider({
  name,
  width,
  stepValue,
  minValue,
  maxValue,
  initialValue,
  isVertical,
  displayValue,
  onChange,
  value,
  ...otherProps
}) {
  return (
    <SliderInput
      type="range"
      name={name}
      width={width}
      min={minValue}
      max={maxValue}
      step={stepValue}
      isVertical={isVertical}
      value={value}
      onChange={onChange}
      {...otherProps}
    />
  );
}

export default Slider;

Slider.propTypes = {
  name: PropTypes.string,
  isLowerFill: PropTypes.string,
  isVertical: PropTypes.bool,
  displayValue: PropTypes.bool,
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.number,
  stepValue: PropTypes.number,
  initialValue: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.any
};
