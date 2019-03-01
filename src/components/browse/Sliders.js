import React from "react";
import Slider from "react-slick";

export class MySlider extends React.Component {

    render() {
        const {profiles} = this.props

        const settings = {
        className: "center",
        centerMode: true,
        infinite: false,
        centerPadding: "60px",
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        focusOnSelect: true,
        variableWidth: true,
        arrows: true,
        };
        
        if (profiles.length > 1 && navigator.userAgent.indexOf("Chrome") !== -1)
        {
            return (
                <div className="browse-listing"> 
                <div className="slider-container">
                    <Slider {...settings}>
                    {profiles}
                    </Slider>
                </div>
                </div>
            );
        }
        else 
        {
            return (
                <div className="browse-listing not-chrome"> 
                    <div className="browse-container">
                        {profiles }
                    </div>
                </div>
            )
        }
    }
}