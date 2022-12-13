import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function FeatureSlider() {
  const features = [
    {
      title: "State Snapshot Text Display",
      desc: "See your application state in stylized, interactive JSON format",
    },
    {
      title: "Time Travel Live Render",
      desc: "Simulate any state change from history in the DOM with a click of a button",
    },
    {
      title: "Save Snapshot Series",
      desc: "Save a series of recorded state snapshots for analysis later on",
    },
    {
      title: "Web Metrics",
      desc: "Improve user experience with insight into Web Metrics such as LCP, FCP, FID, TTFB",
    },
    {
      title: "Snapshot History Display",
      desc: "Monitor history as you time-travel or make new changes to state"
    },
    {
      title: "Components Map Display",
      desc: "Visualize relationships between components in a collapsible tree for a given snapshot",
    },
    {
      title: "Atom and Selector Relationships",
      desc: "Visualize the mapping of Atoms and Selectors to components in Recoil Apps",
    },
    {
      title: "Components Performance Display",
      desc: "Visualize the relative latency trends introduced by re-rendering each component on state change",
    },
    {
      title: "Download, Upload, and Persist",
      desc: "Save your state history for future tests",
      add1: "Keep your state changes on app reload{' '}"
    },
    {
      title: "Re-render Optimization",
      desc: "Improve performance by preventing unnecessary render cycles",
    },
    {
      title: "Gatsby Support",
      desc: "Reactime offers full support for Gatsby applications",
    },
    {
      title: "Next.js Support",
      desc: "Reactime offers debugging and performance tools for Next.js apps",
    },
  
  ]
  return (
    <Swiper
      modules = {[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween = {50}
      slidesPerView = {3}
      onSlideChange = {() => console.log('slide change')}
      onSwiper = {(swiper) => console.log(swiper)}
      navigation
      scrollbar = {{draggable: true }}
      pagination = {{ clickable: true }}
    >
      {features.map((el, index) => {
        return (
          <SwiperSlide key = {index}>
            <div className ="flex justify-center">
              <div className ="rounded-lg shadow-lg bg-white max-w-sm min-w-fit">
                <div className ="p-6">
                  <h5 className ="text-gray-900 text-xl font-medium mb-2">
                    {el.title}
                  </h5>
                  <p className ="text-gray-700 text-base mb-4">
                    {el.desc}
                  </p>
                </div>
              </div>
            </div>  
          </SwiperSlide>
        );
      })}
    </Swiper>
  )
}