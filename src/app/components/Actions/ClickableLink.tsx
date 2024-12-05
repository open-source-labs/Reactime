import React, {useState} from 'react';

const ClickableLink = (): JSX.Element  => {
    //initialize showInfo to false
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        //invert the value of showInfo 
        setShowInfo(!showInfo);
      };
    

    return (
        <div>
            <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={toggleInfo}
            >
               ThemeProvider
            </span>
            {/* displayed onClick 
            logical And operator: if showInfo is true --> thes result on the righthand side is evaluated and returned 
            */}
            {showInfo && (
        <div>
            <h1>ThemeContext</h1>
          <p>
           theme: 'dark', toggleTheme: f(), colors: primary: bdjsbdjsbj
          </p>
        </div>
      )}
        </div>
    );
}

export default ClickableLink; 