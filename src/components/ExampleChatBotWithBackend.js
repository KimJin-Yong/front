import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import axios from 'axios';
import React, { Component } from 'react';

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

    axios.get(`http://localhost:8000/api/data/chatbot/${paperId}/${this.props.previousStep.message}`)
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
        component: <div>Type something to search about the paper you are interested!</div>,
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