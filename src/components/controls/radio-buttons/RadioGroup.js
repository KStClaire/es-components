import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import Fieldset from '../../containers/fieldset/Fieldset';
import RadioButton from './RadioButton';

const radioOptionShape = {
  optionText: PropTypes.string.isRequired,
  optionValue: PropTypes.any.isRequired,
  /** Render this option as disabled */
  disabled: PropTypes.bool
};

class RadioGroup extends React.Component {
  static propTypes = {
    /** The name of the radio group */
    name: PropTypes.string.isRequired,
    /** The text to render in the legend */
    legendText: PropTypes.string,
    /** Options for the radio group to display */
    radioOptions: PropTypes.arrayOf(PropTypes.shape(radioOptionShape))
      .isRequired,
    /** Selected option for the radio group */
    checkedValue: PropTypes.any,
    /** Display all radio buttons in an errored state */
    hasError: PropTypes.bool,
    /** Disable all radio buttons */
    disableAllOptions: PropTypes.bool,
    /** Display the radio buttons inline */
    inline: PropTypes.bool,
    /** Function to execute when the value of the radio group changes */
    onCheckedValueChanged: PropTypes.func,
    /** Function to execute when the selected radio button loses focus */
    onCheckedValueFocusLost: PropTypes.func
  };

  static defaultProps = {
    hasError: false,
    disableAllOptions: false,
    inline: true,
    onCheckedValueChanged: noop,
    onCheckedValueFocusLost: noop
  };

  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);

    const { checkedValue } = this.props;

    this.state = {
      checkedValue
    };
  }

  componentWillReceiveProps({ checkedValue }) {
    this.setState(() => ({ checkedValue }));
  }

  handleEvent(event, handlerName) {
    const { value } = event.currentTarget;
    const handler = this.props[handlerName];
    this.setState({ checkedValue: value }, () => handler(value));
  }

  handleOnChange(event) {
    this.handleEvent(event, 'onCheckedValueChanged');
  }

  handleFocusLost(event) {
    this.handleEvent(event, 'onCheckedValueFocusLost');
  }

  render() {
    const {
      name,
      radioOptions,
      inline,
      legendText,
      hasError: isInErrorState,
      disableAllOptions
    } = this.props;
    const { checkedValue } = this.state;

    return (
      <Fieldset legendText={legendText}>
        {radioOptions.map((config, index) => {
          const radioId = `${name}-option-${index + 1}`;
          const checked = config.optionValue === checkedValue;
          const disabled = disableAllOptions || config.disabled;
          const radioProps = {
            name,
            checked,
            isInErrorState,
            disabled,
            inline,
            id: radioId,
            onChange: this.handleOnChange,
            onBlur: this.handleFocusLost,
            optionText: config.optionText,
            value: config.optionValue
          };
          return <RadioButton key={radioId} {...radioProps} />;
        })}
      </Fieldset>
    );
  }
}

export default RadioGroup;
