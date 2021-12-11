import "../assets/styles/main.css";
import React, { useEffect, useState } from "react";
import history from "../utils/CreateBrowserHistory";
import SearchBox from "./SearchBox";

import realRegister from "../api/realRegister";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Button,
  BackTop,
  Modal,
  Form,
  Space,
  Avatar,
  message,
  Upload,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Data = () => {
  const [data, setData] = useState([]);
  const [uploadList, setUploadList] = useState(true);
  const [dta, setDta] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const clientData = () => {
    console.log("Calling");
    realRegister
      .get("api/clients/getClients")
      .then((res) => {
        console.log("Sucess");
        console.log(res.data.clients);
        setData(res.data.clients);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // if (localStorage.getItem("token")) {
    //   history.push("/tables");
    // }
    console.log("In USE");

    clientData();
  }, []);

  const columns = [
    {
      title: "Client",
      dataIndex: "Photo",
      key: "avatar",
      render: (tPhoto) => {
        return <Avatar src={tPhoto} size={64} icon={<UserOutlined />} />;
      },

      align: "center",
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "name",
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
        return record.Name?.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "NIC",
      dataIndex: "NIC",
      key: "NIC",
      align: "center",
    },
    {
      title: "Bank Accout Number",
      dataIndex: "BankAccountNo",
      key: "BankAccountNo",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
      align: "center",
    },
    {
      title: "Nominee Name",
      dataIndex: "NomineeName",
      key: "NomineeName",
      align: "center",
    },
    {
      title: "Business Name",
      dataIndex: "BusinessName",
      key: "BusinessName",
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
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

  const handleViewMoreClick = (e) => {
    let user_id;

    if (
      e.target.parentNode.children[0].getAttribute("id") == null &&
      e.target.parentNode.getAttribute("id") != null
    ) {
      user_id = e.target.parentNode.getAttribute("id");
    } else if (
      e.target.parentNode.children[0].getAttribute("id") != null &&
      e.target.parentNode.getAttribute("id") == null
    ) {
      user_id = e.target.parentNode.children[0].getAttribute("id");
    }

    console.log("view-more" + user_id);
    localStorage.setItem("user-id", user_id);
    history.push("/profile");
  };

  const beforeUpload = (file) => {
    console.log(file);
    setDta(file);

    return false;
  };

  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    // setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Popconfirm Functions
  function confirm(e) {
    const id =
      e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("id");
    console.log(id);

    realRegister
      .delete(`/api/clients/deleteClient/${id}`)
      .then((res) => {
        message.success("Client Deleted Successfully!");

        clientData();
      })
      .catch((err) => {
        console.log("ER");
        console.log(err);
      });
  }

  function cancel(e) {
    console.log(e);
    message.error("Click on No");
  }

  //Form Functions
  const onFinish = async (values) => {
    let formData = new FormData();
    formData.append("Photo", dta);
    formData.append("Name", values.clientName);
    formData.append("NIC", values.NIC);
    formData.append("PhoneNumber", values.PhoneNumber);
    formData.append("BankAccountNo", values.BankAccountNo);
    formData.append("NomineeName", values.NomineeName);
    formData.append("BusinessName", values.BusinessName);
    formData.append("Address", values.Address);

    console.log("IN FINs");

    await realRegister
      .post("/api/clients/addClient", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setConfirmLoading(false);

        setIsModalVisible(false);
        console.log(res);
        message.success("Client Added Successfully!");

        clientData();
      })
      .catch((err) => {
        console.log("ER");
        // setUploadList(false);
        // console.log(err.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="flex-container" style={{ marginBottom: "10px" }}>
        <Button
          type="primary"
          className="addDevicebtn"
          onClick={showModal}
          style={{
            marginLeft: "10px",
            borderRadius: "50px",
          }}
        >
          Add New Client
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
            <Form.Item className="username" label="Name" name="clientName">
              <Input
                placeholder="Enter Client Name"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item className="username" label="NIC" name="NIC">
              <Input
                placeholder="Enter Client NIC Number"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label="Bank Account Number"
              name="BankAccountNo"
            >
              <Input
                placeholder="Enter Client Bank Account Number"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label="Phone Number"
              name="PhoneNumber"
            >
              <Input
                placeholder="Enter Client Phone Number"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label="Nominee Name"
              name="NomineeName"
            >
              <Input
                placeholder="Enter Client Nominee Name"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label="Business Name"
              name="BusinessName"
            >
              <Input
                placeholder="Enter Client Business Name"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item className="username" label="Address" name="Address">
              <Input
                placeholder="Enter Client Address"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item name="Photo">
              <Upload beforeUpload={beforeUpload} showUploadList={uploadList}>
                <Button
                  style={{
                    marginTop: "10px",
                    marginLeft: "20px",
                    borderRadius: "50px",
                    align: "center",
                  }}
                  icon={<UploadOutlined />}
                >
                  Upload Client's Photo
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Clients"
            >
              <div className="table-responsive">
                <Table
                  key="enCol"
                  columns={columns}
                  pagination={5}
                  dataSource={data}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <BackTop />
    </>
  );
};

export default Data;
