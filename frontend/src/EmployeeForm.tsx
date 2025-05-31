import React, { useState, useEffect } from 'react';
import {
  Row, Col, Form, Input, Select, DatePicker, Button,
  Steps, Space, Divider
} from 'antd';
import moment, { type Moment } from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const { Step } = Steps;
const { Option } = Select;

interface Education {
  qualification: string;
  specialization: string;
  yearOfPassout: Moment | null;
  percentage: string;
}

interface IDProof {
  idType: string;
  idNumber: string;
}

interface FormValues {
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  gender: string;
  martialStatus: string;
  email: string;
  mobileNumber: string;
  dob: Moment | null;
  currentAddress: string;
  currentState: string;
  pinCode: string;
  department: string;
  joiningDate: Moment | null;
  mothersName: string;
  qualification?: string;
  specialization?: string;
  yearOfPassout?: Moment | null;
  percentage?: string;
  idType?: string;
  idNumber?: string;
}

const EmployeeForm: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm<FormValues>();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [idProofList, setIdProofList] = useState<IDProof[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location?.state?.employee;
  const [loading, setLoading] = useState(false);
  const isUpdate = !!stateData?.id;

  useEffect(() => {
    if (stateData) {
      form.setFieldsValue({
        ...stateData,
        dob: stateData.dob ? dayjs(stateData.dob) : null,
        joiningDate: stateData.joiningDate ? dayjs(stateData.joiningDate) : null,
        yearOfPassout: stateData.yearOfPassout ? dayjs(stateData.yearOfPassout, "YYYY") : null
      });
    }
  }, [stateData, form]);

  const handleNext = () => {
    setCurrent((prev: number) => prev + 1);
  };

  const handlePrev = () => {
    setCurrent((prev: number) => Math.max(prev - 1, 0));
  };

  const onAddIDProof = async () => {
    try {
      const values = await form.validateFields(['idType', 'idNumber']);
      setIdProofList([...idProofList, values as IDProof]);
      form.resetFields(['idType', 'idNumber']);
    } catch (err) {
      console.log('ID Proof validation failed:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const formData = form.getFieldsValue(true);

      const allData = {
        ...formData,
        dob: formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : null,
        joiningDate: formData.joiningDate ? moment(formData.joiningDate).format('YYYY-MM-DD') : null,
        educationList: educationList.map((edu) => ({
          qualification: edu.qualification,
          specialization: edu.specialization,
          yearOfPassout: edu.yearOfPassout ? moment(edu.yearOfPassout).format('YYYY') : null,
          percentage: edu.percentage,
        })),
        idProofList: idProofList.map((id) => ({
          idType: id.idType,
          idNumber: id.idNumber,
        })),
      };

      if (isUpdate && stateData?.id) {
        const response = await axios.post(
          `http://localhost:5000/employee/update/${stateData.id}`,
          allData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Updated:', response.data);
        alert('Employee Updated Successfully!');
      } else {
        const response = await axios.post(
          'http://localhost:5000/employee/create',
          allData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Submitted:', response.data);
        alert('Employee Registered Successfully!');
      }

      form.resetFields();
      setEducationList([]);
      setIdProofList([]);
      setCurrent(0);
      navigate('/employee-table');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.response?.data);
        alert(error.response?.data?.message || 'Submission failed!');
      } else {
        alert('Form validation failed!');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Personal Details',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeCode" label="Employee Code" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                <Select size="small">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="martialStatus" label="Marital Status" rules={[{ required: true }]}>
                <Select size="small">
                  <Option value="Single">Single</Option>
                  <Option value="Married">Married</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              { required: true },
              { pattern: /^[6-9]\d{9}$/, message: 'Enter valid mobile number' },
            ]}
          >
            <Input size="small" maxLength={10} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="small" />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
            <DatePicker size="small" style={{ width: '100%' }} />
          </Form.Item>
          <Divider>Current Address</Divider>
          <Form.Item name="currentState" label="State" rules={[{ required: true }]}>
            <Select size="small">
              <Option value="Telangana">Telangana</Option>
              <Option value="AP">Andhra Pradesh</Option>
              <Option value="Tamil Nadu">Tamil Nadu</Option>
              <Option value="Karnataka">Karnataka</Option>
              <Option value="Kerala">Kerala</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="pinCode"
            label="Pin Code"
            rules={[
              { required: true },
              { pattern: /^\d{6}$/, message: 'Must be 6 digits' },
            ]}
          >
            <Input size="small" maxLength={6} />
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Job Details',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select size="small">
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
            </Select>
          </Form.Item>
          <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
            <DatePicker size="small" style={{ width: '100%' }} />
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Family Details',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item name="mothersName" label="Mother's Name" rules={[{ required: true }]}>
            <Input size="small" />
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Education Details',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="qualification" label="Qualification" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="yearOfPassout" label="Year of Passout">
                <DatePicker picker="year" size="small" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="percentage"
                label="Percentage"
                rules={[
                  { required: true },
                  {
                    pattern: /^(100(\.0{1,2})?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
                    message: 'Enter valid percentage',
                  },
                ]}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      title: 'ID Proof',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item name="idType" label="ID Type" rules={[{ required: true }]}>
            <Select size="small">
              <Option value="Aadhar">Aadhar Card</Option>
              <Option value="PAN">PAN Card</Option>
              <Option value="DrivingLicense">Driving License</Option>
            </Select>
          </Form.Item>
          <Form.Item name="idNumber" label="ID Number" rules={[{ required: true }]}>
            <Input size="small" />
          </Form.Item>
          <Button type="dashed" onClick={onAddIDProof}>+ Add ID</Button>
          {idProofList.length > 0 && (
            <>
              <Divider />
              {idProofList.map((id, index) => (
                <div key={index}>
                  <p><b>{id.idType}</b>: {id.idNumber}</p>
                </div>
              ))}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Employee Registration</h2>
        <Button type="primary" onClick={() => navigate('/employee-table')}>
          View Employees
        </Button>
      </div>
      <Steps current={current} size="small" style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {/* Conditionally render form content based on loading state */}
      {!loading ? (
        <div>{steps[current].content}</div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Processing...</p>
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        {current > 0 && <Button onClick={handlePrev} style={{ marginRight: 8 }}>Previous</Button>}
        {current < steps.length - 1 && <Button type="primary" onClick={handleNext}>Next</Button>}
        {current === steps.length - 1 && (
          <>
            {!isUpdate ? (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                Submit
              </Button>
            ) : (
              <Button
                type="default"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                Update
              </Button>
            )}
          </>
        )}
      </div>
    </Form>
  );
};

export default EmployeeForm;