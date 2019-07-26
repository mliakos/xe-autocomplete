import React from "react";
import { Card } from 'antd';

export default function Banner(props) {
  return (
    <Card
      title="Ad title"
      extra={<a href="#">More</a>}
      style={{ height: props.height, width: "100%", margin: props.margin, padding: props.padding,
      background: "linear-gradient(to right, rgba(241,231,103,1) 0%,rgba(254,182,69,1) 69%)" }}
    >
      <p>Ad content</p>
    </Card>
  )
}