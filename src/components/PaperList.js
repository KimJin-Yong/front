import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaperList() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://223.130.141.170:8000/api/data/get_data');
        setPapers(response.data);
        console.log(papers)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTitleClick = (paperId) => {
    // Post paper ID to backend
    axios.post(`http://223.130.141.170:8000/api/data/get_paper/${paperId}`)
      // .then(response => {
      //   // Open chatbot URL in new tab
      //   // window.open(response.data.url, '_blank');
      //   window.open(`http://localhost:3000?paperId=${paper.id}`, '_blank');
      // })
      .catch(error => {
        console.error('Error posting paper ID:', error);
      });
  };

  return (
    <div style={{position: "absolute", top: "150px", left: "5%", transform:"-50%"}}>
      <table style={{background: "#F0EDCF", borderRadius: "5px", maxWidth: "600px"}}>
        <thead >
          <tr style={{border: "1px solid", borderColor: "white", borderRadius: "5px", color: "#000000", background: "#40A2D8"}}>
            <th style={{borderRadius: "5px", padding: "5px"}}>Title</th>
            <th style={{borderRadius: "5px", padding: "5px"}}>Authors</th>
            <th style={{borderRadius: "5px", padding: "5px"}}>Year</th>
          </tr>
        </thead>
        <tbody>
          {papers.map(paper => (
            <tr key={paper.id}>
              <td style={{padding: "5px"}}>
                <a onClick={() => handleTitleClick(paper.id)} href={`http://localhost:3000/chatbot?paperId=${paper.id}`}>
                  {paper.title}
                </a>
              </td>
              <td style={{padding: "5px"}}>{paper.author1}</td>
              <td style={{padding: "5px"}}>{paper.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaperList;
