/**
 * ScrollInterceptor.jsx
 * Created by Kevin Li 7/24/17
 */

import React from 'react';

export default class ScrollInterceptor extends React.PureComponent {
    constructor(props) {
        super(props);

        this.lastScroll = {
            x: 0,
            y: 0
        };

        this.requestEndScroll = null;
        this.requestMonitorScroll = null;

        this.scrollStarted = this.scrollStarted.bind(this);
        this.monitorScroll = this.monitorScroll.bind(this);
        this.scrollEnded = this.scrollEnded.bind(this);

        this.onScroll = this.onScroll.bind(this);
    }

    // componentDidMount() {
    //     this.scrollWrapper.addEventListener('scroll', this.scrollStarted);
    // }

    shouldComponentUpdate(nextProps) {
        const allowableProps = ['visibleHeight', 'visibleWidth', 'fullHeight', 'contentWidth', 'isScrolling'];
        for (let i = 0; i < allowableProps.length; i++) {
            const key = allowableProps[i];
            if (nextProps[key] !== this.props[key]) {
                return true;
            }
        }

        return false;
    }

    scrollStarted() {
        // stop listening to the scroll event (we'll indirectly monitor through rAF)
        this.scrollWrapper.removeEventListener('scroll', this.scrollStarted);

        this.requestMonitorScroll = window.requestAnimationFrame(this.monitorScroll);
    }

    monitorScroll() {
        // prepare the next animation frame
        // this.requestMonitorScroll = window.requestAnimationFrame(this.monitorScroll);
        this.requestEndScroll = window.requestAnimationFrame(this.scrollEnded);

        // get the current scroll position
        const scroll = {
            x: this.scrollWrapper.scrollLeft,
            y: this.scrollWrapper.scrollTop
        };

        // if (scroll.x === this.lastScroll.x && scroll.y === this.lastScroll.y) {
        //     // the scroll stopped
            
        //     // cancel monitoring
        //     window.cancelAnimationFrame(this.requestMonitorScroll);
        //     this.requestMonitorScroll = null;

        //     this.requestEndScroll = window.requestAnimationFrame(this.scrollEnded);
        //     return;
        // }

        // console.log(scroll);

        this.props.scrolledTo(scroll);
    }

    scrollEnded() {
        this.props.scrollEnded();
        // start listening to the scroll event again for the next scroll session
        // this.scrollWrapper.addEventListener('scroll', this.scrollStarted);
        this.requestEndScroll = null;
    }

    onScroll() {
        if (this.requestEndScroll) {
            window.cancelAnimationFrame(this.requestEndScroll);
            this.requestEndScroll = null;
        }
        window.requestAnimationFrame(this.monitorScroll);
    }

    render() {
        const overlayStyle = {
            height: this.props.visibleHeight,
            width: this.props.visibleWidth,
            pointerEvents: 'none'
        };
        const innerStyle = {
            height: this.props.fullHeight,
            width: this.props.contentWidth
        };

        if (this.props.isScrolling) {
            overlayStyle.pointerEvents = 'auto';
        }

        return (
            <div
                className="ibt-scroll-overlay"
                style={overlayStyle}
                onScroll={this.onScroll}
                ref={(div) => {
                    this.scrollWrapper = div;
                }}>
                <div className="ibt-scroll-content" style={innerStyle} />
            </div>
        );
    }
}
