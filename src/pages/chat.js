import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import axios from 'axios';
// import { MyResponsiveNetwork } from '../components/MyResponsiveNetwork'

class ChatBotWithBackend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paperId = urlParams.get('paperId');
    
    //const apiUrl = `http://localhost:8000/api/data/chatbot`;
    axios.get(`http://localhost:8000/api/data/chatbot/${paperId}/${this.props.previousStep.message}`)
      //axios.post(apiUrl, {paperId: paperId, query: this.props.previousStep.message}, {headers: {'Content-Type': 'application/json'}})
      .then(response => {
        const data = response.data;
        console.log(response.data)
        console.log(paperId)
        if (data) {
          this.setState({ loading: false, result: data });
        } else {
          this.setState({ loading: false, result: 'Not found.' });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false, result: 'Error fetching data.' });
      });

    // 데이터 요청 완료 후 자동으로 다음 단계로 이동
    this.props.triggerNextStep();
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="chatbot-with-backend">
        {loading ? <Loading /> : JSON.stringify(result.answer)}
      </div>
    );
  }
}

ChatBotWithBackend.propTypes = {
  triggerNextStep: PropTypes.func,
};

ChatBotWithBackend.defaultProps = {
  triggerNextStep: undefined,
};

const ExampleChatBotWithBackend = () => (
  <ChatBot
    headerTitle="Paper Explainer"
    width="100%"
    steps={[
      {
        id: '1',
        message: 'Type something to search about the paper you are interested!',
        trigger: 'query',
      },
      {
        id: 'query',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <ChatBotWithBackend />,
        waitAction: true,
        trigger: 'query',
      },
    ]}
  />
);

function Chat() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // useEffect(() => {
  //   const fetchData =
  //     async () => {
  //       try {
  //         const response = await axios.get("http://localhost:8000/graph/data");
  //         setData(response.data);
  //         setLoading(false);
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //         setLoading(false);
  //       }
  //     };

  //   fetchData();
  // }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div>{isVisible && <div className='bot' style={{ float:"center", zIndex: "1", marginLeft: "50px", marginRight:"50px" }}>
        <ExampleChatBotWithBackend />
      </div>}
        <button onClick={toggleVisibility} 
        style={{ 
          position: 'absolute', 
          bottom: "5%", left: "50px", zIndex: 2, 
          width: "70px", height: "50px",
          borderRadius: "12px"
        }}
        >
          {isVisible ? "ChatBot Close" : "ChatBot Open"}
        </button>
      </div>
      {/* <div className="responsive-network">
        {data && <MyResponsiveNetwork data={data} />}
      </div> */}
    </div>
  );
}

export default Chat;
