import { Button, Card, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [cities, setCities] = useState([]);

  const getCities = () => {
    axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/cities')
      .then(res => setCities(res.data.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getCities();
  }, []);

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
        <Button type='primary'>Edit</Button>
        <Button type='danger'>Delete</Button>
      </>
    ),
  }));

  return (
    <div>
      <Table columns={columns} dataSource={bigData} />
    </div>
  );
}
