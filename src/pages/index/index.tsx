import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button, Checkbox } from "@tarojs/components";
import "./index.less";

import Child from "./Child";

function App() {
  const [blogTitle, setBlogTitle] = useState("zihua-blog");
  const [userName, setUserName] = useState("zihua");
  const toBlogPage = () => {
    Taro.navigateTo({ url: "/pages/blog/index?blogTitle=" + blogTitle });
  };

  return (
    <View>
      <Text>{userName}</Text>
      <Button plain type="primary" onClick={toBlogPage}>
        按钮跳转
      </Button>
      <Checkbox value="选中" checked>
        选中
      </Checkbox>
      <Child userName={userName}></Child>
    </View>
  );
}

export default App;
