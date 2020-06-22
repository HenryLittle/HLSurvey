import React, { Component } from "react";
import { getUserToken, getUserId } from "../index";
import { SurveyDetail } from "./SurveyDetail"
import { List, Avatar, Space, Card } from 'antd';
import {
    MessageOutlined,
    LikeOutlined,
    StarOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import {
    Switch,
    Route,
    useParams
} from "react-router-dom";

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);


function SurveyDetailProxy() {
    let { surveyId } = useParams();
    return (
        <SurveyDetail surveyId={surveyId} />
    );
}

class SurveyList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            surveyList: []
        }
    }

    getSurveyList() {
        getUserToken(token => {
            if (token != null) {
                this.$axios.get("/api/survey/findSurveyByUserId/", {
                    params: {
                        userid: getUserId(token)
                    },
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }).then(response => {
                    console.log(response);
                    this.setState({
                        surveyList: response.data
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    }

    componentDidMount() {
        this.getSurveyList();
    }

    render() {
        const listData = this.state.surveyList;
        // let match = useRouteMatch();
        return (
            <Switch>
                <Route path="/survey/:surveyId">
                    <SurveyDetailProxy />
                </Route>
                <Route path="/survey/">
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
                            <Card>
                                <List.Item
                                    key={item.id}
                                // actions={[
                                //     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                //     <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                //     <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                // ]}
                                // extra={
                                // <img
                                //     width={272}
                                //     alt="logo"
                                //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                // />
                                // }
                                >
                                    <List.Item.Meta
                                        avatar={<IconText icon={ContainerOutlined} />}
                                        title={<a href={`/survey/${item.id}/`}>{item.data.title ? item.data.title : "No title"}</a>}
                                        description={item.data.description ? item.data.description : "no description for this survey"}
                                    />
                                    {item.content}
                                </List.Item>
                            </Card>
                        )}
                    />
                </Route>
            </Switch>
        );
    }
}

export { SurveyList };