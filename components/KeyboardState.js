import React from 'react';
import PropTypes from 'prop-types';
import {Keyboard, Platform} from 'react-native';

const INITIAL_ANIMATION_DURATION = 250;

export default class KeyboardState extends React.Component {
  static propTypes = {
    layout: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const {layout: {height}} = this.props;

    this.state = {
      contentHeight: height,
      keyBoardHeight: 0,
      keyboardVisible: false,
      keyboardWillShow: false,
      keyboardWillHide: false,
      kyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
    }
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow),
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide),
        Keyboard.addListener('keyboardDidShow', this.keyboardDidShow),
        Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener('keyboardDidShow', this.keyboardDidShow),
        Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
      ];
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.remove());
  }

  keyboardWillShow = event => {
    this.setState({keyboardWillShow: true});

    this.measure(event);
  }

  keyboardDidShow = event => {
    this.setState({
      keyboardWillShow: false,
      keyboardDidShow: true
    });

    this.measure(event);
  }

  keyboardWillHide = event => {
    this.setSetate({keyboardWillHide: true});

    this.measure(event);
  }

  keyboardDidHide = () => {
    this.setState({
      keyboardWillHide: false,
      keyboardVisible: false
    });
  }

  measure = event => {
    const {layout} = this.props;
    const {
      endCoordinates: {height, screenY},
      duration: INITIAL_ANIMATION_DURATION
    } = event;

    this.setState({
      contentHeight: screenY - layout.y,
      keyboardHeight: height,
      keyboardAnimationDuration: duration,
    });
  }

  render() {
    const {children, layout: {height}} = this.props;
    const {
      contentHeight, 
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration
    } = this.state;

    return children({
      containerHeight: height,
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration
    });
  }
}

const styles = StyleSheet.create({
});