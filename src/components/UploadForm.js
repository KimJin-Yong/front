// import { FaCamera } from "react-icons/fa";
// import { MyResponsiveNetwork } from './MyResponsiveNetwork';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadForm.css';
import '../App.css';
import PaperList from './PaperList';
import { MyResponsiveNetwork } from './MyResponsiveNetwork';

const UploadForm = () => {
  const [user_question, setUserQuestion] = useState('');
  const [showPaperList, setShowPaperList] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData =
      async () => {
        try {
          const response = await axios.get("http://localhost:8000/graph/mkdata");
          setData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching graph data:", error);
        }
      };

    fetchData();
  }, []);

  const handleTextChange = (event) => {
    setUserQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('user_question', user_question);

      setShowPaperList(false);
      const response = await axios.post('http://223.130.141.170:8000/api/question/upload', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUserQuestion('');
      setShowPaperList(true); // 업로드 완료 시 PaperList 표시
    } catch (error) {
      console.error('Error Rised During Search', error);
      alert('Failed to connect with server.');
    }
  };

  return (
    <div>
      <div className="inputField" style={{ padding: "5px", position: "absolute", left: "50%", transform: "translateX(-50%)", width: "600px", height: "30px" }}>
        <input id="text" value={user_question} onChange={handleTextChange} style={{ border: 0, right: "95%", width:"550px", height: "28px", float: "left", outline: "none", verticalAlign: "middle"}} />
        <button type="button" className='btn btn-primary' onClick={handleSubmit} disabled={!user_question} style={{ float: "right", position: "absolute", bottom: "8px", right: "5px", borderRadius: "12px", height: "60%", outline: "none", verticalAlign: "middle"}}>Search</button>
      </div>
      <div>
        {(
          <div className='response-container'>
            {showPaperList && <PaperList />}
            <div className="responsive-network" style={{position:"absolute", left: "50%", right:"5%", bottom:"5%",  width: "600px", height:"500px"}}>
              {showPaperList && <MyResponsiveNetwork data={data} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
