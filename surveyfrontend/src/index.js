import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import './axios/axios';
import Axios from 'axios';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

export const TOKEN_NAME = "survey-token";
export const REFRESH_TOKEN_NAME = "survey-refresh-token";

export function getUserToken(callback) {
    var token = localStorage.getItem("survey-token");
    if (token != null) {
        var comps = token.split(".");
        var info = atob(comps[1]);
        // check expiration date
        var now = new Date();
        var secondsSinceEpoch = Math.round(now.getTime() / 1000);
        console.log(secondsSinceEpoch);
        info = JSON.parse(info);
        console.log(info);
        if (info.exp < secondsSinceEpoch) {
            // access token has expired
            let refreshToken = localStorage.getItem("survey-refresh-token");
            let refreshComps = refreshToken.split(".");
            let refreshInfo = atob(refreshComps[1]);

            if (refreshInfo.exp < secondsSinceEpoch) {
                // refresh token is also expired
                callback(null);
            }
            // refresh the token
            Axios.post("/api/auth/refresh/", {
                refresh: refreshToken
            }).then(response => {
                console.log(response.data);
                let newToken = response.data.access;
                localStorage.setItem("survey-token", newToken);
                callback(newToken);
                return;
            }).catch(err => {
                console.log(err);
            });
        } else {
            callback(token);
            return;
        }
    } else {
        callback(null);
        return;
    }
};

export function getUserId(token) {
    var comps = token.split(".");
    var info = atob(comps[1]);
    info = JSON.parse(info);
    return info.user_id;
}

export function getTimeStamp() {
    var now = new Date();
    var secondsSinceEpoch = Math.round(now.getTime() / 1000);
    return secondsSinceEpoch;
}

function createVisitorInfoFor(surveyId) {
    return {
        timeStamp: getTimeStamp(),
        id: surveyId,
        count: 1
    }
}

export function addVisitorRecordFor(surveyId) {
    let info = localStorage.getItem("visitor-info");
    if (info == null) {
        // first time visitor
        let timeStamp = getTimeStamp();
        var data = {
            surveys: {}
        }
        data.surveys[surveyId] = {
            timeStamp: getTimeStamp(),
            count: 1
        };
        // store to local storage
        localStorage.setItem("visitor-info", JSON.stringify(data));
    } else {
        let data = JSON.parse(info);
        if (data.surveys[surveyId]) {
            data.surveys[surveyId].count = data.surveys[surveyId].count + 1;
        } else {
            // no record for survey
            data.surveys[surveyId] = {
                timeStamp: getTimeStamp(),
                count: 1
            };
        }
        localStorage.setItem("visitor-info", JSON.stringify(data));
    }
}

export function isVisitorValidFor(surveyId, isPerDay, limit) {
    if (limit == 0) {
        return false;
    } else {
        let info = localStorage.getItem("visitor-info");
        if (info == null) {
            console.log("Call addVisitorRecordFor before validating visitor");
        } else {
            let data = JSON.parse(info);
            if (data.surveys[surveyId]) {
                if (data.surveys[surveyId].count <= limit) {
                    return true;
                } else {
                    if (isPerDay) {
                        // if we need to refresh count
                        if (getTimeStamp() - data.surveys[surveyId].timeStamp > 24 * 3600) {
                            data.surveys[surveyId].count = 1;
                            data.surveys[surveyId].timeStamp = getTimeStamp();
                            localStorage.setItem("visitor-info", JSON.stringify(data));
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                console.log("Call addVisitorRecordFor before validating visitor");
            }
        }
    }
}