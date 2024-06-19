import React, { useEffect, useState } from "react";
import ProductNavbar from "../../../components/ProductNavbar/ProductNavbar";
import { Table, Spin, Alert, Modal, Form, Input, Select } from "antd";
import axios from "axios";
import moment from "moment";
import Button from "../../../components/Button/Button";
import AddCustomerForm from "../../../components/AddCustomer/AddCustomer";
import CustomerDetails from "../../../components/CustomerDetails/CustomerDetails";
import { FaEdit, FaEye, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { MdOutlineAdd } from "react-icons/md";
import { CSVLink } from "react-csv";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

function ProductAdminCustomer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleDeleteCustomer = async (_id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.delete(
            `${apiUrl}/restaurantAdmin/deleteCustomer/${_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            fetchCustomers();
          } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
          }
        } catch (err) {
          console.error("Error deleting customer:", err);
        }
      },
    });
  };

  const handleEditCustomer = async (editedData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${apiUrl}/restaurantAdmin/editCustomer/${selectedCustomer._id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditModalOpen(false);
        fetchCustomers();
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error updating customer:", err);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditModal = (record) => {
    setSelectedCustomer(record);
    setEditModalOpen(true);
  };

  const handleEditOk = () => {
    setEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
  };

  const fetchCustomerDetails = async (_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${apiUrl}/restaurantAdmin/getCustomer/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCustomerDetails(response.data);
        setDetailModalOpen(true);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
    }
  };

  const showRewardModal = (record, action) => {
    setSelectedCustomer(record);
    form.setFieldsValue({ action });
    setRewardModalOpen(true);
  };

  const handleRewardOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem("accessToken");
        const restaurantId = localStorage.getItem("restaurantId");
        const response = await axios.post(
          `${apiUrl}/restaurantAdmin/addReward`,
          {
            customerId: selectedCustomer._id,
            email: selectedCustomer.email,
            points: values.points,
            restaurantId: restaurantId,
            type: values.action.toLowerCase(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setRewardModalOpen(false);
          form.resetFields();
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error adding reward points:", error);
      }
    });
  };

  const handleRewardCancel = () => {
    setRewardModalOpen(false);
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Reg on",
      dataIndex: "registeredOn",
      key: "registeredOn",
      render: (text, record) => moment(record.createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => showEditModal(record)}
          >
            <FaEdit />
          </button>
          <button
            className="text-green-500 hover:text-green-600"
            onClick={() => fetchCustomerDetails(record._id)}
          >
            <FaEye />
          </button>
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => handleDeleteCustomer(record._id)}
          >
            <FaTrash />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-600"
            onClick={() => showRewardModal(record, "Redeem")}
          >
            <FaMinus />
          </button>
          <button
            className="text-purple-500 hover:text-purple-600"
            onClick={() => showRewardModal(record, "Add")}
          >
            <FaPlus />
          </button>
        </div>
      ),
    },
  ];

  const handleAddCustomer = async (customerData) => {
    try {
      const restaurantId = localStorage.getItem("restaurantId");
      const token = localStorage.getItem("accessToken");

      console.log("Sending data:", { ...customerData, restaurantId });

      const response = await axios.post(
        `${apiUrl}/restaurantAdmin/addCustomer`,
        {
          ...customerData,
          restaurantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsModalOpen(false);
        fetchCustomers();
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      if (err.response) {
        console.error(
          `Server Error: ${err.response.status} - ${err.response.data.message}`
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error", err.message);
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      const restaurantId = localStorage.getItem("restaurantId");
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${apiUrl}/common/getCustomers`,
        {
          page: page,
          limit: 10,
          restaurantId: restaurantId,
          phone: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative z-10 px-[48px] py-[20px]">
        <ProductNavbar />
        <button
          className="flex items-center text-[#1f2937] hover:text-gray-900 mt-4 font-semibold cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack className="mr-2" />
          Back
        </button>
      </div>
      <Modal
        title="Add Customer"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddCustomerForm onSubmit={handleAddCustomer} onCancel={handleCancel} />
      </Modal>

      <Modal
        title="Edit Customer"
        visible={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={null}
      >
        {selectedCustomer && (
          <AddCustomerForm
            onSubmit={handleEditCustomer}
            onCancel={handleEditCancel}
            initialData={selectedCustomer}
          />
        )}
      </Modal>

      {/* <Modal
        title="Customer Details"
        visible={detailModalOpen}
        onOk={() => setDetailModalOpen(false)}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={1000}
      >
        <div className="w-full flex justify-end">
          <Button
            className="w-1/5"
            children="Download"
          />
        </div>
        <CustomerDetails details={customerDetails} />
      </Modal> */}

      <Modal
        title={
          <div className="flex justify-between ">
            <span>Customer Details</span>
          </div>
        }
        visible={detailModalOpen}
        onOk={() => setDetailModalOpen(false)}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={1000}
      >
        <CustomerDetails details={customerDetails} />
      </Modal>

      <Modal
        title={`Add Reward to ${selectedCustomer?.firstName} ${selectedCustomer?.lastName}`}
        visible={rewardModalOpen}
        onOk={handleRewardOk}
        onCancel={handleRewardCancel}
        okButtonProps={{
          style: { backgroundColor: "#4f46e5", color: "white" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please input points" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="action"
            label="Action"
            rules={[{ required: true, message: "Please select an action" }]}
          >
            <Select placeholder="Select action">
              <Select.Option value="add">Add points</Select.Option>
              <Select.Option value="redeem">Redeem points</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between items-center mx-[48px]">
        <div>
          <h3 className="font-medium text-lg mb-4">Customers Details</h3>
        </div>
        <div>
          <Button onClick={showModal} >
            <MdOutlineAdd size={20} className="mr-[4px] font-semibold" />
            Add customer
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg  my-4 p-6 border border-gray-200 mx-[48px]">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: page,
              pageSize: 10,
              total: total,
              onChange: (page) => setPage(page),
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            }
            bordered
          />
        </div>
      </div>
    </div>
  );
}

export default ProductAdminCustomer;