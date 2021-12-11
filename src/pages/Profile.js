import React, { useState, useEffect } from "react";
import history from "../utils/CreateBrowserHistory";
import SearchBox from "./SearchBox";

import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Avatar,
  Upload,
  message,
  Typography,
  Input,
  Space,
  Popconfirm,
  Table,
  Form,
  Radio,
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";

import realRegister from "../api/realRegister";

const { Text } = Typography;

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [clientRecordData, setClientRecordData] = useState([]);
  const [uploadList, setUploadList] = useState(true);
  const [type, setType] = useState("residential");
  const [state, setState] = useState({});

  const [form] = Form.useForm();

  const photo = [];

  const clientData = () => {
    console.log("Calling");
    const userId = localStorage.getItem("user-id");

    realRegister
      .get(`api/clients/getClient/${userId}`)
      .then((res) => {
        console.log("Sucess");
        console.log(res.data.client);
        setUserData(res.data.client);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clientRecord = () => {
    console.log("Calling");
    const userId = localStorage.getItem("user-id");
    console.log(userId);

    realRegister
      .get(`api/records/getRecord/${userId}`)
      .then((res) => {
        console.log("Sucess");
        console.log(res.data.Record);
        setClientRecordData(res.data.Record.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    clientData();
    clientRecord();

    return () => {
      setState({});
    };
  }, []);

  const columns = [
    {
      title: "Plot No",
      dataIndex: "plotNo",
      key: "plotNo",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <SearchBox
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys[0]}
            confirm={confirm}
            clearFilters={clearFilters}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.plotNo === value;
      },
    },
    {
      title: "Block",
      dataIndex: "block",
      key: "block",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Society Name",
      dataIndex: "societyName",
      key: "societyName",
      align: "center",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
    },

    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button type="primary" id={record._id} onClick={handleViewMoreClick}>
            View More
          </Button>
          <Popconfirm
            id={record._id}
            title="Are you sure to delete this Client?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button id={record._id} type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      align: "center",
    },
  ];

  //View More Button Handle Click Function -----------------------------------------
  const handleViewMoreClick = (e) => {
    let record_id;
    if (
      e.target.parentNode.children[0].getAttribute("id") == null &&
      e.target.parentNode.getAttribute("id") != null
    ) {
      record_id = e.target.parentNode.getAttribute("id");
    } else if (
      e.target.parentNode.children[0].getAttribute("id") != null &&
      e.target.parentNode.getAttribute("id") == null
    ) {
      record_id = e.target.parentNode.children[0].getAttribute("id");
    }

    console.log("view-more-profile" + record_id);
    localStorage.setItem("record-id", record_id);
    history.push("/record");
  };

  //Popconfirm Functions --------------------------------
  function confirm(e) {
    const id =
      e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("id");
    console.log(id);
    realRegister
      .delete(`/api/records/deleteRecord/${id}`)
      .then((res) => {
        message.success("Record Deleted Successfully!");

        clientRecord();
      })
      .catch((err) => {
        console.log("ER");
        console.log(err);
      });
  }

  function cancel(e) {
    console.log(e);
  }

  //Modal Functions --------------------------------
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Form Functions --------------------------------
  const onFinish = async (values) => {
    const id = localStorage.getItem("user-id");

    let formData = new FormData();
    // console.log(values.Documents.fileList.length);
    // console.log(photo.length);

    if (photo.length > 0) {
      for (let i = 0; i < values.Documents.fileList.length; i++) {
        formData.append("Documents", photo[i]);
      }
    }

    formData.append("clientID", id);
    formData.append("type", type);
    formData.append("societyName", values.societyName);
    formData.append("plotNo", values.plotNo);
    formData.append("block", values.block);
    formData.append("size", values.size);
    formData.append("price", values.price);
    formData.append("remarks", values.remarks);
    formData.append("clientName", userData.Name);
    formData.append("Photo", userData.Photo);

    await realRegister
      .post("/api/records/addRecord", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setIsModalVisible(false);
        console.log(res);
        // e.preventDefault();

        message.success("Record Added Successfully!");
        form.resetFields();

        clientRecord();
      })
      .catch((err) => {
        console.log("ER");
        setUploadList(false);
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //Upload Function -------------------------------
  const beforeUpload = (files) => {
    console.log(files);
    photo.push(files);

    return false;
  };

  //Radio Button Functions -----------------------------
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setType(e.target.value);
  };

  return (
    <>
      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        style={{ marginTop: 0 }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <Avatar.Group>
                <Avatar size={74} shape="square" src={userData.Photo} />

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">{userData.Name}</h4>
                  <p>Phone Number: {userData.PhoneNumber}</p>
                </div>
              </Avatar.Group>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                justifyContent: "flex-end",
              }}
            >
              <Text type="secondary">NIC: {userData.NIC}</Text>
              <Text type="secondary">Nominee Name: {userData.NomineeName}</Text>
              <Text type="secondary">
                Bank Account No: {userData.BankAccountNo}
              </Text>
            </Col>
          </Row>
        }
      ></Card>
      <Button
        type="primary"
        className="addDevicebtn"
        onClick={showModal}
        style={{
          marginLeft: "25px",
          marginBottom: "15px",
          borderRadius: "50px",
        }}
      >
        Add New Record
      </Button>
      <Modal
        title="Add a New Device"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="row-col"
        >
          <Form.Item className="username" label="Type" name="type">
            <Radio.Group onChange={onChange} value={type}>
              <Radio value={"residential"}>Residential</Radio>
              <Radio value={"commercial"}>Commercial</Radio>
              <Radio value={"agriculture"}>Agriculture</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            className="username"
            label="Society Name"
            name="societyName"
          >
            <Input
              placeholder="Enter Society Name"
              style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
            />
          </Form.Item>
          <Form.Item className="username" label="Plot No" name="plotNo">
            <Input
              placeholder="Enter Plot Number"
              style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
            />
          </Form.Item>
          <Form.Item className="username" label="Block" name="block">
            <Input
              placeholder="Enter Block"
              style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
            />
          </Form.Item>
          <Form.Item className="username" label="Size" name="size">
            <Input
              placeholder="Enter Size of Plot"
              style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
            />
          </Form.Item>
          <Form.Item className="username" label="Price" name="price">
            <Input
              placeholder="Enter Price of Plot"
              style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
            />
          </Form.Item>
          <Form.Item className="username" label="Details" name="remarks">
            <Input
              placeholder="Enter Details (if any)"
              style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
            />
          </Form.Item>
          <Form.Item name="Documents">
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={uploadList}
              multiple={true}
            >
              <Button
                style={{
                  marginTop: "10px",
                  marginLeft: "20px",
                  borderRadius: "50px",
                  align: "center",
                }}
                icon={<UploadOutlined />}
              >
                Upload Property Document Photos
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24 Descriptions"
              title="Records"
              style={{ marginLeft: 35 }}
            >
              <div className="table-responsive">
                <Table
                  key="records"
                  columns={columns}
                  pagination={5}
                  dataSource={clientRecordData}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Profile;
