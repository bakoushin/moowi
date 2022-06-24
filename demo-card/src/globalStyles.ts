import { css } from '@emotion/react';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@600;900&family=Montserrat:wght@900&display=swap');
  :root {
    --accent-color: #80009d;
  }
  * {
    box-sizing: border-box;
  }
  html {
    min-height: 100%;
  }
  body {
    min-height: 100%;
    font-family: 'League Spartan', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(
        180deg,
        var(--accent-color) 0%,
        rgba(196, 196, 196, 0) 100%
      )
      no-repeat;
    font-size: 1.33rem;
    color: #000;
    margin: 0;
    padding: 0;
  }
  #root {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  p {
    margin: 0.33rem;
  }
`;

export default globalStyles;
