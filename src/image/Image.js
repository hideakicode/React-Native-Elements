import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image as RNImage,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
} from 'react-native';

import { nodeType } from '../helpers';
import { ViewPropTypes, withTheme } from '../config';

const Image = ({
  placeholderStyle,
  PlaceholderContent,
  containerStyle,
  style,
  ImageComponent,
  ...attributes
}) => {
  const [placeholderOpacity] = useState(new Animated.Value(1));

  const onLoad = () => {
    const minimumWait = 100;
    const staggerNonce = 200 * Math.random();

    setTimeout(
      () => {
        Animated.timing(placeholderOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: Platform.OS === 'android' ? false : true,
        }).start();
      },
      Platform.OS === 'android' ? 0 : Math.floor(minimumWait + staggerNonce)
    );
  };

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      <ImageComponent
        {...attributes}
        onLoad={onLoad}
        style={style}
        testID="RNE__Image"
      />

      <Animated.View
        style={[
          styles.placeholderContainer,
          {
            opacity: placeholderOpacity,
          },
        ]}
      >
        <View
          testID="RNE__Image__placeholder"
          style={StyleSheet.flatten([
            style,
            styles.placeholder,
            placeholderStyle,
          ])}
        >
          {PlaceholderContent}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    backgroundColor: '#bdbdbd',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

Image.propTypes = {
  ...RNImage.propTypes,
  ImageComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  PlaceholderContent: nodeType,
  containerStyle: ViewPropTypes.style,
  placeholderStyle: RNImage.propTypes.style,
};

Image.defaultProps = {
  ImageComponent: ImageBackground,
  style: {},
};

export { Image };
export default withTheme(Image, 'Image');
