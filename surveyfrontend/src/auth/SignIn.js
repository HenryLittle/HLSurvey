import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, Result } from 'antd';

import { layout, tailLayout } from './layout';

import {TOKEN_NAME, REFRESH_TOKEN_NAME} from '../index'

class SignInPage extends Component {
    state = {
        signed: false,
        failed: false,
        remember: false
    }

    signIn(values) {
        this.$axios.post('/api/auth/', values)
            .then(response => {
                console.log(response.data);
                this.setState({ signed: true });
                // save token to local store
                console.log(response.data.access);
                console.log(response.data.refresh);
                if (this.state.remember) {
                    localStorage.setItem(TOKEN_NAME, response.data.access);
                    localStorage.setItem(REFRESH_TOKEN_NAME, response.data.refresh);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    signed: true,
                    failed: true
                });
            });
    }

    onFinish = values => {
        this.state.remember = values.remember;
        delete values.remember;
        console.log('Success:', values);
        // get JWT token from backend 
        this.signIn(values);
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render() {
        let remember = this.state.remember;
        return (
            <div>
                {this.state.signed ?
                    (!this.state.failed ?
                        <Result
                            status="success"
                            title="Sign success"
                            extra={[
                                <Button type="primary" key="home" href="/">Go Home</Button>
                            ]}
                        /> :
                        <Result
                            status="warning"
                            title="Error singing in account"
                            extra={
                                <Button type="primary" key="back" href="/signin">Go Back</Button>
                            }
                        />
                    ) :
                    <Form {...layout}
                        name="basic"
                        initialValues={{ remember: remember }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}>

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
                                { required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>}
            </div>
        );
    }
}

export { SignInPage };