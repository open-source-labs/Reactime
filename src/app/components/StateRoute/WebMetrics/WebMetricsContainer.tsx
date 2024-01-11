import React from 'react';
import WebMetrics from './WebMetrics';

/*
  Used to render a container for all of the 'Web Metrics' tab
*/

const WebMetricsContainer = (props) => {
  const { webMetrics } = props;

  let LCPColor: String;
  let FIDColor: String;
  let FCPColor: String;
  let TTFBColor: String;
  let CLSColor: String;
  let INPColor: String;

  // adjust the strings that represent colors of the webmetrics performance bar for 'Largest Contentful Paint (LCP)', 'First Input Delay (FID)', 'First Contentfuly Paint (FCP)', 'Time to First Byte (TTFB)', 'Cumulative Layout Shift (CLS)', and 'Interaction to Next Paint (INP)' based on webMetrics outputs.
  if (webMetrics.LCP <= 2500) LCPColor = '#0bce6b';
  if (webMetrics.LCP > 2500 && webMetrics.LCP <= 4000) LCPColor = '#fc5a03';
  if (webMetrics.LCP > 4000) LCPColor = '#fc2000';

  if (webMetrics.FID <= 100) FIDColor = '#0bce6b';
  if (webMetrics.FID > 100 && webMetrics.FID <= 300) FIDColor = '#fc5a03';
  if (webMetrics.FID > 300) FIDColor = '#fc2000';

  if (webMetrics.FCP <= 1800) FCPColor = '#0bce6b';
  if (webMetrics.FCP > 1800 && webMetrics.FCP <= 3000) FCPColor = '#fc5a03';
  if (webMetrics.FCP > 3000) FCPColor = '#fc2000';

  if (webMetrics.TTFB <= 800) TTFBColor = '#0bce6b';
  if (webMetrics.TTFB > 800 && webMetrics.TTFB <= 1800) TTFBColor = '#fc5a03';
  if (webMetrics.TTFB > 1800) TTFBColor = '#fc2000';

  if (webMetrics.CLS <= 0.1) CLSColor = '#0bce6b';
  if (webMetrics.CLS > 0.1 && webMetrics.CLS <= 0.25) CLSColor = '#fc5a03';
  if (webMetrics.CLS > 0.25) CLSColor = '#fc2000';

  if (webMetrics.INP <= 200) INPColor = '#0bce6b';
  if (webMetrics.INP > 200 && webMetrics.INP <= 500) INPColor = '#fc5a03';
  if (webMetrics.INP > 500) INPColor = '#fc2000';

  return (
    <div className='web-metrics-container'>
      <WebMetrics
        color={LCPColor}
        series={webMetrics.LCP ? [webMetrics.LCP / 70 < 100 ? webMetrics.LCP / 70 : 100] : 0}
        formatted={(_) =>
          typeof webMetrics.LCP !== 'number' ? '- ms' : `${webMetrics.LCP.toFixed(2)} ms`
        }
        score={['2500 ms', '4000 ms']}
        overLimit={webMetrics.LCP > 7000}
        label='Largest Contentful Paint'
        name='Largest Contentful Paint'
        description='Measures loading performance.'
      />
      <WebMetrics
        color={FIDColor}
        series={webMetrics.FID ? [webMetrics.FID / 5 < 100 ? webMetrics.FID / 5 : 100] : 0}
        formatted={(_) =>
          typeof webMetrics.FID !== 'number' ? '- ms' : `${webMetrics.FID.toFixed(2)} ms`
        }
        score={['100 ms', '300 ms']}
        overLimit={webMetrics.FID > 500}
        label='First Input Delay'
        name='First Input Delay'
        description='Measures interactivity.'
      />
      <WebMetrics
        color={FCPColor}
        series={webMetrics.FCP ? [webMetrics.FCP / 50 < 100 ? webMetrics.FCP / 50 : 100] : 0}
        formatted={(_) =>
          typeof webMetrics.FCP !== 'number' ? '- ms' : `${webMetrics.FCP.toFixed(2)} ms`
        }
        score={['1800 ms', '3000 ms']}
        overLimit={webMetrics.FCP > 5000}
        label='First Contentful Paint'
        name='First Contentful Paint'
        description='Measures the time it takes the browser to render the first piece of DOM content.'
      />
      <WebMetrics
        color={TTFBColor}
        series={webMetrics.TTFB ? [webMetrics.TTFB / 30 < 100 ? webMetrics.TTFB / 30 : 100] : 0}
        formatted={(_) =>
          typeof webMetrics.TTFB !== 'number' ? '- ms' : `${webMetrics.TTFB.toFixed(2)} ms`
        }
        score={['800 ms', '1800 ms']}
        overLimit={webMetrics.TTFB > 3000}
        label='Time To First Byte'
        name='Time to First Byte'
        description='Measures the time it takes for a browser to receive the first byte of page content.'
      />
      <WebMetrics
        color={CLSColor}
        series={webMetrics.CLS ? [webMetrics.CLS * 200 < 100 ? webMetrics.CLS * 200 : 100] : 0}
        formatted={(_) =>
          `CLS Score: ${
            typeof webMetrics.CLS !== 'number'
              ? 'N/A'
              : `${webMetrics.CLS < 0.01 ? '~0' : webMetrics.CLS.toFixed(2)}`
          }`
        }
        score={['0.1', '0.25']}
        overLimit={webMetrics.CLS > 0.5}
        label='Cumulative Layout Shift'
        name='Cumulative Layout Shift'
        description={`Quantifies the visual stability of a web page by measuring layout shifts during the application's loading and interaction.`}
      />
      <WebMetrics
        color={INPColor}
        series={webMetrics.INP ? [webMetrics.INP / 7 < 100 ? webMetrics.INP / 7 : 100] : 0}
        formatted={(_) =>
          typeof webMetrics.INP !== 'number' ? '- ms' : `${webMetrics.INP.toFixed(2)} ms`
        }
        score={['200 ms', '500 ms']}
        overLimit={webMetrics.INP > 700}
        label='Interaction to Next Paint'
        name='Interaction to Next Paint'
        description={`Assesses a page's overall responsiveness to user interactions by observing the latency of all click, tap, and keyboard interactions that occur throughout the lifespan of a user's visit to a page`}
      />
    </div>
  );
};

export default WebMetricsContainer;
