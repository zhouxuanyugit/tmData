import React from "react";
import Content from "./Content";
import Header from "./Header";
import TagsView from "./TagsView";
import { Layout } from "antd";
const Main = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header />
        <TagsView />
        <Content />
      </Layout>
    </Layout>
  );
};
export default Main;
