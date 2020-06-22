import React, { Component } from "react";
import * as Survey from "survey-react";
import { getUserToken, getUserId, isVisitorValidFor, addVisitorRecordFor } from "../index";
import { Result, Button } from "antd";
import { SurveyStatistics } from "./SurveyStatistic";
const UserType = {
    CREATOR: "creator",
    USER: "user",
    VISITOR: "visitor",
    FORBIDDEN: "forbidden"
}


class SurveyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userId: -1,
            creatorId: -1,
            userType: "",
            isPerDay: false,
            allowedCount: 0,
            responseData: {},
            json: {}
        };
        this.onComplete = this.onComplete.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    getSurveyById(onComplete) {
        this.$axios.get("/api/survey/getSurveyById/", {
            params: {
                id: this.props.surveyId
            }
        }).then(response => {
            console.log(response)
            let json = response.data.data;
            this.setState({
                responseData: response.data,
                creatorId: response.data.creator,
                isPerDay: response.data.isPerDay,
                allowedCount: response.data.allowedCount,
                json: json
            });
            onComplete();
        }).catch(err => {
            console.log(err);
        })
    }

    onComplete(result) {
        console.log(result.data);
        if (this.state.userType == UserType.VISITOR) {
            addVisitorRecordFor(this.props.surveyId);
            let hasAccess = isVisitorValidFor(
                this.props.surveyId,
                this.state.isPerDay,
                this.state.allowedCount
            );
            if (!hasAccess) {
                this.setState({
                    userType:UserType.FORBIDDEN
                });
                return;
            }
        }
        // submit the result
        this.$axios.post(
            "/api/survey/submitSurveyResult/", 
            result.data,{
                params:{
                    id: this.props.surveyId,
                    userid: this.state.userId
                }
            }).then(response => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            });
    }

    onValueChanged() {
        console.log("Value Changed!");
    }

    componentDidMount() {
        this.getSurveyById(() => {
            getUserToken(token => {
                if (token != null) {
                    // user is logged in
                    if (getUserId(token) === this.state.creatorId) {
                        // its the creator show control and statistic panel
                        console.log("Creator");
                        this.setState({
                            userId: getUserId(token),
                            userType: UserType.CREATOR
                        });
                    } else {
                        // another user
                        console.log("Site User");
                        this.setState({
                            userId: getUserId(token),
                            userType: UserType.USER
                        });
                    }
                } else {
                    // it's a visitor
                    console.log("Visitor");
                    this.setState({
                        userType: UserType.VISITOR
                    });
                }
            })
        });
    }

    render() {
        const json = this.state.json;
        const model = new Survey.Model(json);
        const userType = this.state.userType;
        const creatorId = this.state.creatorId;
        console.log("Rendering");
        return (
            <div>
                {(userType === UserType.USER || userType === UserType.VISITOR) &&
                    <Survey.Survey
                        model={model}
                        onComplete={this.onComplete}
                        onValueChanged={this.onValueChanged}
                    />
                }{
                    (userType === UserType.CREATOR) &&
                    <div>
                        Welcome user No.{creatorId}
                        <SurveyStatistics surveyId={this.props.surveyId} survey={this.state.responseData}/>    
                    </div>
                }{
                    (userType === UserType.FORBIDDEN) &&
                    <Result
                        status="warning"
                        title="You have reached limit of submitting result to this survey as a visitor."
                        subTitle={""}
                        extra={
                            <Button type="primary" key="console" href="/signup">Sign Up</Button>
                        }
                    />
                }
            </div>
        );
    }
}

export { SurveyDetail };