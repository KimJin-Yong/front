import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import axios from 'axios';
import React, { Component } from 'react';

class PreviousSessionLogs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      logs: [],
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('accessToken');
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get('paperId');

    const axiosInstance = axios.create({
      headers: {
        'Authorization': `Bearer ${accessToken.access_token}`
      }
    });

    // 백엔드 API를 호출하여 이전 세션의 로그를 가져옴
    axiosInstance.get(`http://223.130.141.170:8000/chat/${paperId}`)
      .then(response => {
        if (response.data === false) {
          axios.post(`http://223.130.141.170:8000/chat`,
            {
              paperId
            }
          )
        }
        const logs = response.data;
        this.setState({ logs, loading: false });
      })
      .catch(error => {
        console.error('Error fetching previous logs:', error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading, logs } = this.state;

    return (
      <div>
        <h3>Previous Session Logs:</h3>
        {loading ? <p>Loading...</p> :
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

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
    const accessToken = localStorage.getItem('accessToken');

    axios.get(`http://223.130.128.44:8000/api/data/chatbot/${paperId}/${this.props.previousStep.message}`)
      .then(response => {
        const data = response.data;
        if (data) {
          this.setState({ loading: false, result: data });

          const userMessage = {
            paperId: paperId,
            content: this.props.previousStep.message,
            isBot: false
          };

          const botMessage = {
            paperId: paperId,
            content: data,
            isBot: true
          };

          axios.post(`http://223.130.141.170:8000/chat/message`, userMessage, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
            .then(response => {
              console.log('Data successfully sent:', response.data);
            })
            .catch(error => {
              console.error('Error sending data:', error);
            });

          axios.post(`http://223.130.141.170:8000/chat/message`, botMessage, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
            .then(response => {
              console.log('Data successfully sent:', response.data);
            })
            .catch(error => {
              console.error('Error sending data:', error);
            });
        } else {
          this.setState({ loading: false, result: 'Not found.' });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false, result: 'Error fetching data.' });
      });

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
    hideHeader={true}
    width="100%"
    style={{ height: "89vh", boxShadow: "none" }}
    contentStyle={{ height: "82vh" }}
    steps={[
      {
        id: '1',
        component: <PreviousSessionLogs />,
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

export default ExampleChatBotWithBackend;