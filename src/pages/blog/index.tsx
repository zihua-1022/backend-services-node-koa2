import { useState, useEffect } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Kobe from "../../assets/img/kobe.png";

function Blog() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogList, setBlogList] = useState([]);

  const listData = [
    { id: 1, name: 111 },
    { id: 2, name: 222 },
    { id: 3, name: 333 },
    { id: 4, name: 444 },
    { id: 5, name: 555 },
  ];
  const flag = true;
  const testHandler = () => {
    Taro.request({
      header: { Headers: "Access-Control-Allow-Origin" },
      url: "https://sit.pingboss.com/gateway/apis?vnnox=djEvcGluZ2Jvc3MtbWFuYWdlbWVudC1zZXJ2aWNlL2FjY291bnQvcmVzb3VyY2U/JTI0ZmlsdGVyPXR5cGUlMjBlcSUyMDImJTI0b3JkZXJCeT1jcmVhdGVfYXQlMjBkZXNj",
    }).then((res) => {
      //   setBlogList(res.data.coming);
      console.log(res);
    });
  };

  useEffect(() => {
    const { router } = getCurrentInstance();
    console.log("$router: ", router);
    router && setBlogTitle(router.params.blogTitle || "");
  }, []);
  return (
    <View>
      <Text>{blogTitle}-Blog Page</Text>
      <Image src={require("../../assets/img/kobe.png")}></Image>
      {listData.map((item) => {
        return (
          <View key={item.id}>
            {item.id}-{item.name}
          </View>
        );
      })}
      <View>男猪脚：{flag === true ? "zihua" : "xxx"}</View>
      <Button>获取列表</Button>
      {blogList.map((item) => {
        return (
          <View key={item.id}>
            {item.nm}-{item.star}
          </View>
        );
      })}
    </View>
  );
}

export default Blog;
