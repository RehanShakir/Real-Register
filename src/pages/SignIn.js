import React from "react";
import { Link } from "react-router-dom";
import realRegister from "../api/realRegister";
import history from "../utils/CreateBrowserHistory";

import { Layout, Button, Row, Col, Typography, Form, Input } from "antd";
import smartFarmingIot from "../assets/images/smartFarmingIot.jpg";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const onFinish = async (values) => {
    await realRegister
      .post("/api/users/login", {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        console.log("Logged in successfully");
        localStorage.setItem("token", JSON.stringify(res.data));

        history.push("/tables");

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Layout className="layout-default layout-signin">
        <Header>
          <div className="header-col header-brand">
            <h5>Smart Agri</h5>
          </div>
        </Header>
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your Username and password to sign in
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your username!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Username"
                    style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                  />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-dark font-bold">
                    Sign Up
                  </Link>
                </p>
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 100 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img src={smartFarmingIot} alt="" />
            </Col>
          </Row>
        </Content>
        <Footer>
          <p className="copyright"> Copyright © 2021 </p>
        </Footer>
      </Layout>
    </>
  );
};

export default SignIn;
