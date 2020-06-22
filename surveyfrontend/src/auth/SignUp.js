import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, Result, Space } from 'antd';

import { layout, tailLayout } from './layout';


class SignUpPage extends Component {
  state = {
    registered: false,
    failed: false,
    message: ""
  }

  onFinish = values => {
    console.log("Success:", values);
    this.$axios.post('/api/auth/registerAccount/', values)
      .then(response => {
        console.log(response);
        this.setState({ registered: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          registered: true,
          failed: true,
          message: err.data
        });
      });
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const message = this.state.message;
    return (
      <div>
        {this.state.registered ?
          (!this.state.failed ?
            <Result
              status="success"
              title="Your account has been registered"
              extra={[
                <Button type="primary" key="home" href="/signin">Go Sign In</Button>
              ]}
            /> :
            <Result
              status="warning"
              title="Error registering account"
              subTitle={message}
              extra={
                <Button type="primary" key="console" href="/signup">Go Back</Button>
              }
            />
          ) :
          <Form {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email address!'
                },
                {
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: 'Wrong email address format!'
                },
                {
                  max: 50,
                  message: 'Mail address cannot exceed 50 chars!'
                }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { max: 50, message: 'Password cannot exceed 50 characters' },
                { min: 8, message: 'Password cannot be less than 8 characters' }]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit">Sign Up</Button>
                <Button type="link" href="/signin">Sign In</Button>
              </Space>
            </Form.Item>
          </Form>}
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   userPostFetch: userInfo => dispatch(userPostFetch(userInfo))
// })
// class SignUpPage extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       registered: false
//     }
//   }

//   render() {
//     return (
//       <div>
//         <Signup />
//       </div>
//     )
//   }
// };
export { SignUpPage };