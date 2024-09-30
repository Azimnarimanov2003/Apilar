import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Modals.css'; 

export default function Modals() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');

  const getModal = () => {
    axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/models')
      .then(res => {
        setModels(res.data.data);
      });
  };

  const getBrands = () => {
    axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/brands')
      .then(res => {
        setBrands(res.data.data);
      })
      .catch(error => {
        setError(error.message);
        console.error('Ma\'lumotlarni olishda xatolik:', error);
      });
  };

  useEffect(() => {
    getModal();
    getBrands();
  }, []);

  const addModel = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand_id', brandId);
    axios({
      url: 'https://autoapi.dezinfeksiyatashkent.uz/api/models',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: formData
    }).then(res => {
      if (res.data.success) {
        message.success("Qo'shildi");
      }
    }).catch(err => {
      message.error("Xatolik");
    });
  };

  return (
    <div>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <select onChange={(e) => setBrandId(e.target.value)}>
        {brands.map((brand, index) => (
          <option key={index} value={brand.id}>{brand.title}</option>
        ))}
      </select>
      <button onClick={addModel}>Add</button>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Nomi</th>
            <th>Brend</th>
          </tr>
        </thead>
        <tbody>
          {models && models.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.brand_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
