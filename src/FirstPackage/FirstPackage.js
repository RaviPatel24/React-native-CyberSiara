import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

const FirstPackage = () => {
  const [data, setdata] = useState(true);
  console.log(data);
  return (
    <View>
      <Text>FirstPackage</Text>
      <Button
        title="Submit"
        color="orange"
        onPress={() => (data ? setdata(false) : setdata(true))}
      />
    </View>
  );
};

export default FirstPackage;
