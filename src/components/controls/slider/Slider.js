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
  position: absolute;
  appearance: none;
  background: none;
  cursor: pointer;
  width: ${props => props.width}px;
  min-height: 35px;
  overflow: hidden;
  margin: 0;
  pointer-events: none;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background: ${colors.grayDarker};
    height: 9px;
  }
  &::-webkit-slider-thumb {
    position: relative;
    z-index: 1;
    height: 25px;
    width: 25px;
    appearance: none;
    background: ${colors.accent};
    border-radius: 100px;
    box-shadow: ${props => createFill(props.width, props.isLowerFill)};
    margin-top: -8px;

    &:hover {
      background: ${colors.accentLighter};
    }
    &:active {
      background: ${colors.magenta};
    }
  }
  &:focus::-webkit-slider-thumb {
    outline-color: #4D90FE;
    outline-style: auto;
    outline-width: 5px;
    // border-radius: 100px;
    // border: 1px solid #4D90FE;
    // box-shadow: ${props =>
      createFill(props.width, props.isLowerFill)}, 0px 0px 5px #4D90FE;
  }
`;

function Slider({
  name,
  value,
  width,
  stepValue,
  minValue,
  maxValue,
  onChange,
  ...otherProps
}) {
  return (
    <SliderInput
      type="range"
      name={name}
      value={value}
      width={width}
      min={minValue}
      max={maxValue}
      step={stepValue}
      onChange={onChange}
      {...otherProps}
    />
  );
}

Slider.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  width: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  stepValue: PropTypes.number,
  isLowerFill: PropTypes.bool,
  isMultiRange: PropTypes.bool,
  onChange: PropTypes.func
};

export default Slider;
