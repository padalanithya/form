import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  message,
  Switch,
  Tag,
  Checkbox,
  Popconfirm,
  Input,
  Space,
} from 'antd';
import type { TableProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  RightSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';

interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  gender: string;
  department: string;
  mobileNumber: string;
  dob: string;
  joiningDate: string;
  idType: string;
  idNumber: string;
  martialStatus: string;
  state: string;
  pinCode: string;
  isActive: boolean;
}

const EmployeeTable: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/employee/getAll');
      if (res.data.data) {
        setData(res.data.data);
        message.success('Employees fetched successfully');
      } else {
        message.error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (record: Employee) => {
    try {
      await axios.post(`http://localhost:5000/employee/activateOrDeactivate`, {
        id: record.id,
        isActive: !record.isActive,
      });
      message.success(
        `Employee ${record.isActive ? 'deactivated' : 'activated'} successfully`
      );
      fetchEmployees();
    } catch (err) {
      console.error('Status update failed:', err);
      message.error('Failed to update employee status');
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/employee/delete/${id}`);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete employee');
    }
  };

  const handleEdit = (record: Employee) => {
    navigate('/employee-form', {
      state: {
        employee: {
          ...record,
          martialStatus: record.martialStatus || '',
          state: record.state || '',
          pinCode: record.pinCode || '',
        },
        isEdit: true,
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = data.filter((employee) =>
    Object.values(employee)
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns: TableProps<Employee>['columns'] = [
    {
      title: 'S.no',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Emp Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Mobile', dataIndex: 'mobileNumber', key: 'mobileNumber' },
    { title: 'Mother Name', dataIndex: 'mothersName', key: 'mothersName' },
    { title: 'DOB', dataIndex: 'dob', key: 'dob' },
    { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate' },
    { title: 'Marital Status', dataIndex: 'martialStatus', key: 'maritalStatus' },
    { title: 'State', dataIndex: 'currentAddress', key: 'state' },
    { title: 'Pincode', dataIndex: 'pinCode', key: 'pincode' },
    { title: 'ID Type', dataIndex: 'idType', key: 'idType' },
    { title: 'ID Number', dataIndex: 'idNumber', key: 'idNumber' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      align: 'center',
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Active
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Inactive
          </Tag>
        ),
      filterIcon: (filtered: boolean) => (
        <FilterOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => (
        <div style={{ padding: 8 }}>
          <Checkbox
            checked={selectedKeys.includes('Active')}
            onChange={() =>
              setSelectedKeys(
                selectedKeys.includes('Active')
                  ? selectedKeys.filter((key: string) => key !== 'Active')
                  : [...selectedKeys, 'Active']
              )
            }
          >
            <span style={{ color: 'green' }}>Active</span>
          </Checkbox>
          <Checkbox
            checked={selectedKeys.includes('Inactive')}
            onChange={() =>
              setSelectedKeys(
                selectedKeys.includes('Inactive')
                  ? selectedKeys.filter((key: string) => key !== 'Inactive')
                  : [...selectedKeys, 'Inactive']
              )
            }
          >
            <span style={{ color: 'red' }}>Inactive</span>
          </Checkbox>
          <div style={{ marginTop: 8 }}>
            <Button onClick={() => confirm()} size="small" type="primary" style={{ width: 90, marginRight: 8 }}>
              OK
            </Button>
            <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        const status = record.isActive ? 'Active' : 'Inactive';
        return value === status;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: (_text, record) => (
        <Space size="middle">
          {/* Edit button disabled when inactive */}
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: 16 }} />}
            disabled={!record.isActive}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={`Are you sure to ${
              record.isActive ? 'deactivate' : 'activate'
            } this employee?`}
            onConfirm={() => toggleEmployeeStatus(record)}
          >
            <Switch
              checked={record.isActive}
              checkedChildren={<RightSquareOutlined />}
              unCheckedChildren={<RightSquareOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure to delete this employee?"
            onConfirm={() => deleteEmployee(record.id)}
          >
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2>Employee Table</h2>
        <Space>
          <Input
            placeholder="Search employees..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Link to="/employee-form">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Employee
            </Button>
          </Link>
        </Space>
      </div>
      <Table<Employee>
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        bordered
        loading={loading}
        locale={{ emptyText: 'No Data Found' }}
        pagination={{ pageSize: 8, showSizeChanger: true }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default EmployeeTable;
