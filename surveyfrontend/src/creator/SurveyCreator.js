import React, { Component } from "react";
import * as SurveyKo from "survey-knockout";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

//import "icheck/skins/square/blue.css";
import "pretty-checkbox/dist/pretty-checkbox.css";

import * as widgets from "surveyjs-widgets";

import { getUserToken, getUserId } from "../index";

SurveyJSCreator.StylesManager.applyTheme("default");

//widgets.icheck(SurveyKo, $);
widgets.prettycheckbox(SurveyKo);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
// widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
//widgets.signaturepad(SurveyKo);
// widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
// widgets.bootstrapslider(SurveyKo);

class SurveyCreator extends Component {
  surveyCreator;
  token = null;

  saveMySurvey = () => {
    var json = JSON.parse(this.surveyCreator.text)
    console.log(json);
    // get token
    getUserToken(token => {
      if (token != null) {
        this.$axios.post(
          "/api/survey/saveSurveyByUserId/",
          json,
          {
            params: {
              userid: getUserId(token)
            },
            headers: {
              Authorization: "Bearer " + token
            }
          }
        ).then(response => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        })
      }
    })
  };

  componentDidMount() {
    let options = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      questionTypes: ["boolean", "checkbox", "dropdown", "rating", "radiogroup", "text", "comment"]
    };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(
      null,
      options
    );
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.render("surveyCreatorContainer");
  }

  render() {
    return (
      <div>
        <div id="surveyCreatorContainer" />
      </div>
    );
  }

}

export default SurveyCreator;
