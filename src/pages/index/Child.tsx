import { View, Text } from "@tarojs/components";

function Child(props) {
  return (
    <View>
      <Text>我只是个孩子</Text>
      <Text>{props.userName}</Text>
    </View>
  );
}

export default Child;
