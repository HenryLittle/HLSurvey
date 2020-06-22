import React, { Component, Fragment } from "react";
import {
    Statistic,
    DatePicker,
    Row, Col,
    Typography,
    Form,
    InputNumber,
    Space,
    Switch,
    Divider,
    List,
    Table,
    Tag
} from "antd";
import {
    ContainerOutlined
} from '@ant-design/icons';
import moment from "moment";
import { mean, variance, max, min } from "mathjs";

import { getUserToken } from "../index";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const statColumns = [
    {
        title: 'Mean',
        dataIndex: 'mean',
        key: 'mean',
    },
    {
        title: 'Variance',
        dataIndex: 'variance',
        key: 'variance',
    },
    {
        title: 'Max',
        dataIndex: 'max',
        key: 'max'
    },
    {
        title: 'Min',
        dataIndex: 'min',
        key: 'min'
    },
];



class SurveyStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            statistics: []
        }
        console.log(this.props.isPerDay)
        this.onDateRangeChanged = this.onDateRangeChanged.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
        this.onSwitchChange = this.onSwitchChange.bind(this);
    }

    getSurveyResults(onComplete) {
        getUserToken(token => {
            if (token != null) {
                this.$axios.get("/api/survey/getSurveyResById/", {
                    params: {
                        id: this.props.surveyId
                    },
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }).then(response => {
                    console.log(response);
                    this.setState({
                        results: response.data
                    });
                    onComplete();
                }).catch(err => {
                    console.log(err);
                });
            }
        })
    }

    onDateRangeChanged(dates, dateStrings) {
        if (dates == null) return;
        console.log(dates[0].valueOf());
        this.$axios.get("/api/survey/updateSurveyTimeRange/", {
            params: {
                id: this.props.surveyId,
                startAt: Math.round(dates[0].valueOf() / 1000),
                endAt: Math.round(dates[1].valueOf() / 1000)
            }
        }).then(response => {

        }).catch(err => {

        });
    }

    onNumberChange(value) {
        console.log(value);
        this.$axios.get("/api/survey/updateSurveyLimitCount/", {
            params: {
                id: this.props.surveyId,
                count: value
            }
        }).then(response => {

        }).catch(err => {

        });
    }

    onSwitchChange(checked) {
        console.log(checked);
        this.$axios.get("/api/survey/updateSurveyLimitMode/", {
            params: {
                id: this.props.surveyId,
                isPerDay: checked ? 1 : 0
            }
        }).then(response => {

        }).catch(err => {

        });
    }

    calculateStatistics() {
        // calculate statistics
        var statistics = [];
        var survey = this.props.survey.data;
        survey.pages.forEach(page => {
            page.elements.forEach(question => {
                var tempRes = {};
                console.log(question);
                if (question.type == "checkbox") {
                    tempRes.type = "checkbox";
                    tempRes.name = question.name;
                    tempRes.choices = {};
                    tempRes.choicesCol = [];
                    question.choices.forEach(choice => {
                        var temp = {};
                        temp.title = choice.text ? choice.text : choice;
                        temp.dataIndex = choice.value ? choice.value : choice;
                        temp.key = choice.value ? choice.value : choice;
                        if (choice.value) {
                            console.log(choice.value);
                            tempRes.choices[choice.value] = 0;
                        } else {
                            tempRes.choices[choice] = 0;
                        }
                        tempRes.choicesCol.push(temp);
                    });
                    this.state.results.forEach(res => {
                        console.log(res);
                        res.data[question.name].forEach(choice => {
                            tempRes.choices[choice] += 1;
                        });
                    });
                    console.log(tempRes);
                    statistics.push(tempRes);
                } else if (question.type == "radiogroup") {
                    tempRes.type = "radiogroup";
                    tempRes.name = question.name;
                    tempRes.choices = {};
                    tempRes.choicesCol = [];
                    question.choices.forEach(choice => {
                        var temp = {};
                        temp.title = choice.text ? choice.text : choice;
                        temp.dataIndex = choice.value ? choice.value : choice;
                        temp.key = choice.value ? choice.value : choice;
                        if (choice.value) {
                            console.log(choice.value);
                            tempRes.choices[choice.value] = 0;
                        } else {
                            tempRes.choices[choice] = 0;
                        }
                        tempRes.choicesCol.push(temp);
                    });
                    this.state.results.forEach(res => {
                        console.log(res);
                        tempRes.choices[res.data[question.name]] += 1;
                    });
                    statistics.push(tempRes);
                } else if (question.type == "text" && question.inputType == "number") {
                    console.log("text");
                    tempRes.type = "number";
                    tempRes.name = question.name;
                    tempRes.choices = {};
                    tempRes.choicesCol = statColumns;
                    var temp = [];
                    this.state.results.forEach(res => {
                        if (res.data[question.name]) {
                            temp.push(res.data[question.name])
                        }
                    })
                    // calculate mean max min variance
                    tempRes.choices.mean = mean(temp);
                    tempRes.choices.max = max(temp);
                    tempRes.choices.min = min(temp);
                    tempRes.choices.variance = variance(temp);
                    statistics.push(tempRes);
                }

            });
        });
        console.log(statistics)
        this.setState({
            statistics: statistics
        });
    }

    componentDidMount() {
        this.getSurveyResults(() => {
            this.calculateStatistics();
        });

    }

    render() {
        let moments = [];
        moments.push(moment(this.props.survey.startAt * 1000));
        moments.push(moment(this.props.survey.endAt * 1000));
        const listData = this.state.statistics;
        return (
            <Fragment>
                <Row gutter={64}>
                    <Col>
                        <Title style={{ marginTop: 12 }} level={2}>Overall Statistics</Title>
                        <Row style={{ paddingLeft: 24 }} gutter={16}>
                            <Col span={6}>
                                <Statistic title="Submissions" value={this.state.results.length} />
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Title style={{ marginTop: 12 }} level={2}>Survey Settings</Title>
                        <Row style={{ paddingLeft: 24, paddingTop: 24 }} justify='start' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align='middle'>
                            <Col style={{ paddingBottom: 16 }}>
                                <Space>
                                    <InputNumber
                                        min={0}
                                        max={10000}
                                        onChange={this.onNumberChange}
                                        defaultValue={this.props.survey.allowedCount}
                                    />
                                    <Text strong>Visitor Fill limit</Text>
                                </Space>
                            </Col>
                            <Col style={{ paddingBottom: 16 }}>
                                <Space>
                                    <Switch
                                        onChange={this.onSwitchChange}
                                        defaultChecked={this.props.survey.isPerDay} />
                                    <Text strong>Is limit per day</Text>
                                </Space>
                            </Col>
                            <Col style={{ paddingBottom: 16 }}>
                                <Space>
                                    <RangePicker
                                        defaultValue={moments}
                                        onChange={this.onDateRangeChanged} />
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Title level={2}>Question Statistics</Title>
                </Row>

                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 10,
                    }}
                    dataSource={listData}

                    renderItem={item => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                avatar={<IconText icon={ContainerOutlined} />}
                                title={<a>{item.name ? item.name + `  (${item.type})` : "No title"}</a>}
                                description={item.type != 'number' ? <b>Choices count for each choice</b> : <b>Statistics for number field</b> }
                            />
                            <Table
                                columns={item.choicesCol}
                                dataSource={[item.choices]}
                                pagination={false} />
                        </List.Item>
                    )}
                />
            </Fragment>
        );
    }
}

export { SurveyStatistics };