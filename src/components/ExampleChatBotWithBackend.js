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
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get('paper_id');

    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`
      }
    });

    axiosInstance.get(`http://223.130.141.170:8000/chat/?paper_id=${paperId}`)
      .then(response => {
        console.log(response.data);
        if (response.data === false) {
          axiosInstance.post(`http://223.130.141.170:8000/chat/`,
            {
              "paper_id": paperId
            }
          ).then(() => {
            const logs = [{"content": "What do you want to know about this paper?"}];
            this.setState({ logs, loading: false });
          }).catch(error => {
            console.error('Error posting initial message:', error);
            this.setState({ loading: false });
          });
        }
        else {
          const logs = response.data;
          this.setState({ logs, loading: false });
        }
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
        {loading ? <p>Loading...</p> :
          <ul style={{ listStyleType: 'none' }}>
            {logs.map((log, index) => (
              <li key={index}>{log.content}</li> // Render the content of each log
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
    const paperId = urlParams.get('paper_id');
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    axios.get(`http://223.130.128.44:8000/api/data/chatbot/${paperId}/${this.props.previousStep.message}`)
      .then(response => {
        const data = response.data;
        if (data) {
          this.setState({ loading: false, result: data });

          const userMessage = {
            "content": this.props.previousStep.message,
            "paper_id": paperId,
            "user_com": false
          };

          const botMessage = {
            "content": JSON.stringify(data.answer),
            "paper_id": paperId,
            "user_com": true
          };

          axios.post(`http://223.130.141.170:8000/chat/message`, userMessage, {
            headers: {
              Authorization: `Bearer ${accessToken.access_token}`
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
              Authorization: `Bearer ${accessToken.access_token}`
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