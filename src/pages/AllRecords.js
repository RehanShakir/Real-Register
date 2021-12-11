import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import SearchBox from "./SearchBox";
import ReactToPrint from "react-to-print";

import realRegister from "../api/realRegister";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  BackTop,
  Space,
  message,
  Popconfirm,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";

const Data = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  let ref = useRef(null);

  const allRecords = () => {
    console.log("Calling");
    realRegister
      .get("api/records/getRecords")
      .then((res) => {
        console.log("Sucess");
        console.log(res.data.Records);
        setData(res.data.Records.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    console.log("In USE");

    allRecords();
  }, []);

  const columns = [
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
        // console.log(value.toLowerCase());
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
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
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
        return record.clientName?.toLowerCase().includes(value.toLowerCase());
      },
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
    console.log(e.target.parentNode.getAttribute("id"));
    const record_id = e.target.parentNode.getAttribute("id");
    console.log("view-more-Allrec");
    localStorage.setItem("record-id", record_id);
    history.push("/record");
  };

  //Popconfirm Functions
  function confirm(e) {
    const id =
      e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("id");
    console.log(id);

    realRegister
      .delete(`/api/records/deleteRecord/${id}`)
      .then((res) => {
        message.success("Record Deleted Successfully!");

        allRecords();
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

  return (
    <>
      <div className="flex-container" style={{ marginBottom: "10px" }}></div>

      <ReactToPrint
        trigger={() => (
          <Button type="primary" style={{ borderRadius: 50, margin: "10px" }}>
            Print{" "}
          </Button>
        )}
        content={() => ref}
      />

      <div className="tabled" ref={(el) => (ref = el)}>
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="All Records"
            >
              <div className="table-responsive">
                <Table
                  key="record"
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

      <BackTop visibilityHeight={300} style={{ marginBottom: -20 }} />
    </>
  );
};

export default Data;
