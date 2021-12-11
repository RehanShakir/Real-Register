import React, { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import history from "../utils/CreateBrowserHistory";
import "../assets/styles/responsive.css";

import {
  Row,
  Col,
  Card,
  Descriptions,
  Avatar,
  Button,
  Image,
  Modal,
  Input,
  Form,
  message,
} from "antd";

import { CalculatorOutlined } from "@ant-design/icons";
import Calculator from "awesome-react-calculator";

import realRegister from "../api/realRegister";
const { TextArea } = Input;

const Record = () => {
  const [Record, setRecord] = useState([]);
  const [state, setState] = useState({});
  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [calResult, setCalResult] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  let ref = useRef(null);

  const record = () => {
    console.log("Calling");
    const recordId = localStorage.getItem("record-id");
    console.log(recordId);

    realRegister
      .get(`api/records/getOneRecord/${recordId}`)
      .then((res) => {
        console.log("Sucess");
        console.log(res.data.Record);
        setRecord(res.data.Record);
        setImages(res.data.Record.documents);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/record");
    }
    record();
    return () => {
      setState({});
    };
  }, [confirmLoading]);

  const renderedImages = images.map((img) => {
    return <Image width={100} src={img} />;
  });

  //Calculator Functions
  const style = {
    height: "340px",
    width: "340px",
  };
  const handleInput = (input) => {
    // console.log(
    //   `${input.expression} is shown in the calculator, User clicked the ${input.key}`
    // );
  };

  const onResultChange = (newResult) => {
    console.log(newResult.result);
    // setCalResult(newResult.result);
    setValue(newResult.result);
    form.setFieldsValue({ details: newResult.result });
    // console.log(`${newResult.expression} is validated as ${newResult.result} `);
  };

  //Modal Functions
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Form Functions
  const onFinish = (values) => {
    setConfirmLoading(true);
    console.log(values);
    let details = values.details;
    const recordId = localStorage.getItem("record-id");

    realRegister
      .put(`api/records/updateDetails/${recordId}`, { details })
      .then((res) => {
        console.log(res);
        setConfirmLoading(false);
        setIsModalVisible(false);
      })
      .catch((err) => {
        console.log(err);
        setConfirmLoading(false);
        setIsModalVisible(false);
        record();
        message.success("Details Added");
      });
  };
  const onFinishFailed = (err) => {
    console.log(err);
    setConfirmLoading(false);
    setIsModalVisible(false);
    message.error("Something Went Wrong");
  };
  return (
    <>
      <ReactToPrint
        trigger={() => (
          <Button
            className="addDevicebtn"
            type="primary"
            style={{
              borderRadius: 50,
              marginLeft: "30px",
              marginBottom: "10px",
            }}
          >
            Print
          </Button>
        )}
        content={() => ref}
      />
      <div ref={(el) => (ref = el)}>
        <Card
          className="card-profile-head"
          bodyStyle={{ display: "none" }}
          style={{ marginTop: 0 }}
          title={
            <Row justify="space-between" align="middle" gutter={[24, 0]}>
              <Col span={24} md={12} className="col-info">
                <Avatar.Group>
                  <Avatar size={74} shape="square" src={Record.Photo} />

                  <div className="avatar-info">
                    <h4 className="font-semibold m-0">{Record.clientName}</h4>
                  </div>
                </Avatar.Group>
              </Col>
            </Row>
          }
        ></Card>

        <Row gutter={[24, 0]}>
          <Descriptions
            title=""
            bordered
            size={"middle"}
            style={{
              background: "white",
              borderRadius: 10,
              marginLeft: 50,
              boxShadow: "2px 2px 5px 5px  #888888",
            }}
            className="Descriptions"
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Type">{Record.type}</Descriptions.Item>
            <Descriptions.Item label="Society Name">
              {Record.societyName}
            </Descriptions.Item>
            <Descriptions.Item label="Plot No">
              {Record.plotNo}
            </Descriptions.Item>
            <Descriptions.Item label="Block">{Record.block}</Descriptions.Item>
            <Descriptions.Item label="Size">{Record.size}</Descriptions.Item>
            <Descriptions.Item label="Price">{Record.price}</Descriptions.Item>
            <Descriptions.Item
              label="Details"
              span={3}
              style={{ height: "150px" }}
            >
              {Record.details}
              <Row justify="end" align="middle">
                <CalculatorOutlined
                  style={{
                    fontSize: "30px",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  }}
                  onClick={showModal}
                />
                <Modal
                  title="Calculator"
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  // confirmLoading={confirmLoading}
                  destroyOnClose={true}
                >
                  <Row justify="center">
                    <div className="calculator-demo" style={style}>
                      <Calculator
                        onNewInput={handleInput}
                        onResultChange={onResultChange}
                      />
                    </div>
                    <Form
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      layout="vertical"
                      className="row-col"
                      style={{ marginTop: 25 }}
                      form={form}
                    >
                      <Form.Item
                        className="username"
                        label="Details  "
                        name="details"
                      >
                        <TextArea
                          placeholder="Enter Details"
                          className="antdTextArea"
                          // defaultValue={calResult}
                          value={value}
                          style={{
                            width: 400,
                            // paddingTop: 23.5,
                            paddingBottom: 23.5,
                          }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ width: "100%" }}
                          loading={confirmLoading}
                        >
                          Save
                        </Button>
                      </Form.Item>
                    </Form>
                  </Row>
                </Modal>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Document">
              <Image.PreviewGroup>{renderedImages}</Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </Row>
      </div>
    </>
  );
};

export default Record;
