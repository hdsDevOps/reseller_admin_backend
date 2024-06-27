import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddCustomer from 'customer/AddCustomer';
import ReduxProvider from "./ReduxProvider";
import './index.css';
import axios from "axios";

const App = () => {

  const [data, setData] = useState("");

  const [formData, setFormData] = useState({
    to: "avijit@schemaphic.com",
    subject: "Subject Testing...",
    text:"Body testing....."
  });

  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:8000/adminservices/send-email", formData);
      setData(response.data);
    } catch (error) {
        console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container">
      <Navbar/>
      <div>Name: main</div>
      <h3><b>{data}</b></h3>
      <AddCustomer/>
      <button onClick={fetchData}>Click me</button>
      <Footer/>
    </div>
  )
}
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<ReduxProvider><App /></ReduxProvider>)
