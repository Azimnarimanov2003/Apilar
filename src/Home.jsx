import { Button, Form, Input, Modal, Table, message } from 'antd'; // `Input` import qilinadi
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [form] = Form.useForm();   
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);          

  const getCities = () => {     
    axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/cities')    
      .then(res => setCities(res.data.data))          
      .catch(err => console.log(err));           
  };                     

  useEffect(() => {                             
    getCities();               
    const token = localStorage.getItem('token');                
    if(!token){                  
      navigate('/')                
    }                  
  }, []);                     

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
    setEditMode(false);
    setCurrentCity(null);
    setImage(null);
  };

  const handleEdit = (city) => {
    setEditMode(true);
    setCurrentCity(city);
    setOpen(true);
    form.setFieldsValue({
      name: city.name,
      text: city.text,
    });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure delete this city?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
    });
  };

  const handleDelete = (id) => {
    axios({
      url: `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    }).then(res => {
      message.success('City deleted successfully!');
      getCities();
    }).catch(err => {
      console.log(err);
      message.error('Failed to delete city.');
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Text',
      dataIndex: 'text',
    },
    {
      title: 'Images',
      dataIndex: 'images',
    },
    {
      title: 'Action',
      dataIndex: 'card',
    },
  ];

  const bigData = cities.map((city, index) => ({
    key: index,
    Number: index + 1,
    name: city.name,
    text: city.text,
    images: (
      <img
        width={200}
        src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${city.image_src}`}
        alt={city.name}
      />
    ),
    card: (
      <>
        <Button type='primary' style={{ marginRight: 8 }} onClick={() => handleEdit(city)}>Edit</Button>
        <Button type='danger' onClick={() => confirmDelete(city.id)}>Delete</Button>
      </>
    ),
  }));

  const handleSubmit = (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('text', values.text);
    if (image) formData.append('images', image);

    const request = editMode
      ? axios({
          url: `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${currentCity.id}`,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: formData
        })
      : axios({
          url: 'https://autoapi.dezinfeksiyatashkent.uz/api/cities',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: formData
        });

    request.then(res => {
      message.success(`City ${editMode ? 'updated' : 'added'} successfully!`);
      getCities();
      closeModal();
    }).catch(err => {
      console.log(err);
      message.error(`Failed to ${editMode ? 'update' : 'add'} city.`);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div>
      <Button type='primary' onClick={showModal}>Add</Button>
      <Table columns={columns} dataSource={bigData} />
      <Modal title={editMode ? "Edit City" : "Add City"} visible={open} onCancel={closeModal} footer={null}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Text'
            name='text'
            rules={[{ required: true, message: 'Please enter the text' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Images' name='img'>
            <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
