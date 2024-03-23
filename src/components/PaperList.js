import { useNavigate } from "react-router-dom";

function PaperList(props) {
  const { papers } = props;
  const navigate = useNavigate();
  return (
    <div style={{position: "absolute", top: "180px", left: "5%", right:"50%", transform:"-50%"}}>
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
              <td onClick={() => {navigate(`/chatbot?paper_id=${paper.id}`)}} style={{padding: "5px"}}>
                  {paper.title}
              </td>
              <td style={{padding: "5px"}}>{paper.author1}</td>
              <td style={{padding: "5px"}}>{paper.published_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaperList;
