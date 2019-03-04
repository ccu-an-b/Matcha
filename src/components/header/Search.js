import React from 'react';
import { Field, reduxForm } from "redux-form";
import { BwmSelectLocation } from "components/shared/form/BwmSelectLocation";
import { BwmIntervalSlider } from "components/shared/form/BwmIntervalSlider";
import { BwmMultiSelect } from "components/shared/form/BwmMultiSelect";
import { BwmAutocomplete } from "components/shared/form/BwmAutocomplete";


class SearchForm extends React.Component{
    constructor() {
        super();
        this.state = {
            showFilter: false,
        }
    }

    showFilters = () => {
        this.setState({showFilter: !this.state.showFilter})
    }  
    
    render(){
        const tags = this.props.optionsTags; 
        const users = this.props.users;
        const {showFilter} = this.state;
        const { handleSubmit, submitCb} = this.props

        const groupedOptions = [
            {
                title: 'Username',
                options: users,
            },
        ];

        return (
            <form onSubmit={handleSubmit((submitCb))}>
                <div className="my-select no-border search">
                {users.length && tags.length &&
                    <Field
                    name="search"
                    component={BwmAutocomplete}
                    groupedOptions={groupedOptions}
                />
                }
                </div>
                <div className="toggle-filter" onClick={() => this.showFilters()}>
                    <i className="fas fa-sliders-h"></i>
                </div>
                <div className="start-search" onClick={submitCb}>
                    <div className="full_screen">Let's go !</div>
                    <div className="small_screen"><i className="fas fa-search"></i></div>
                </div>
                {showFilter && 
                <div className="search-filter">
                     <div className="search-titles">
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseAgeSearch" role="button" aria-expanded="false" aria-controls="multiCollapseAgeSearch">age</h2>
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseScoreSearch" aria-expanded="false" aria-controls="multiCollapseScoreSearch">score</h2>
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseLocationSearch" aria-expanded="false" aria-controls="multiCollapseLocationSearch">location</h2>
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseTagsSearch" aria-expanded="false" aria-controls="multiCollapseTagsSearch">tags</h2>
                     </div>
                      <div className="row">
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseAgeSearch">
                              <div className="my-card card card-body">
                                  <Field 
                                      name="age"
                                      min={18}
                                      max={120}
                                      component={BwmIntervalSlider}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseScoreSearch">
                              <div className="my-card card card-body">
                                  <Field  
                                      name="score"
                                      min={0}
                                      max={500}
                                      component={BwmIntervalSlider}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseLocationSearch">
                              <div className="my-card card card-body">
                              <Field
                                  name="location"
                                  type="text"
                                  placeholder="Where to ..."
                                  className="my-select no-border location"
                                  component={BwmSelectLocation}
                              />
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseTagsSearch">
                              <div className="my-card card card-body">
                                  <Field 
                                      name="tags"
                                      className="my-select no-border multi"
                                      options={tags}
                                      component={BwmMultiSelect }
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
                }
            </form>
        )
    }
}

export default reduxForm({
    form: "searchForm"
  })(SearchForm);