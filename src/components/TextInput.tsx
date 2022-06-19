import React, {forwardRef} from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import {Box, useTheme} from '.';

export interface TextInputProps extends RNTextInputProps {
  touched?: boolean;
  error?: string;
  icon?: string;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({icon, touched, error, ...props}, ref) => {
    const theme = useTheme();
    const SIZE = theme.borderRadii.m * 2;
    const reColor = !touched ? 'text' : error ? 'danger' : 'secondary';
    const color = theme.colors[reColor];

    return (
      <Box
        flexDirection="row"
        height={48}
        alignItems="center"
        borderRadius="s"
        borderWidth={StyleSheet.hairlineWidth}
        borderColor={reColor}
        padding="s">
        <Box flex={1}>
          <RNTextInput
            underlineColorAndroid="transparent"
            placeholderTextColor={color}
            {...{ref}}
            {...props}
          />
        </Box>
      </Box>
    );
  },
);

export default TextInput;
