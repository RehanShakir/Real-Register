import "../assets/styles/main.css";

import React from "react";

import { Input, Button, Space } from "antd";

import { SearchOutlined } from "@ant-design/icons";

const SearchBox = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
}) => {
  return (
    <div style={{ padding: 8 }}>
      <Input
        placeholder="Search..."
        allowClear
        enterButton="Search"
        size="large"
        value={selectedKeys}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
          confirm({ closeDropdown: false });
        }}
        onPressEnter={() => {
          confirm();
        }}
        onBlur={() => {
          confirm();
        }}
        className="mac-search"
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginTop: 10, borderRadius: 20 }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters()}
          size="small"
          type="danger"
          style={{ width: 90, marginTop: 10, borderRadius: 20 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  );
};

export default SearchBox;
