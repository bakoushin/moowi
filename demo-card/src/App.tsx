import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import Button from './components/Button';
import Card from './components/Card';
import Section from './components/Section';
import androidLogo from './assets/android-logo.svg';
import appleLogo from './assets/apple-logo.svg';
import moowiLogo from './assets/moowi-logo.svg';
import moowiLogoBig from './assets/moowi-logo-big.svg';
import demoCardLogo from './assets/demo-card.svg';
import { QRCodeSVG } from 'qrcode.react';
import Block from './components/Block';
import Logo from './components/Logo';
import Value from './components/Value';
import SecretCode from './components/SecretCode';
import Spinner from './components/Spinner';

const header = css`
  display: flex;
  flex-wrap: wrap;
  margin: 40px 10px 0;
  justify-content: center;
`;

const rowStyle = css`
  display: flex;
`;

const bottomButtonStyle = css`
  margin-bottom: 40px;
`;

const cardSpinnerBoxStyle = css`
  background: #fff;
`;

const cardSpinnerStyle = css`
  stroke: var(--accent-color);
`;

function App() {
  const appLink = 'exp://exp.host/@bakoushin/Moowi';

  const [isSecretCodeRevealed, setIsSecretCodeRevealed] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(true);
  const [secretCode, setSecretCode] = useState<string | null>(null);

  const isGettingNewCodeStarted = useRef(false);

  const handleSecretCodeReveal = () => {
    setIsSecretCodeRevealed(true);
  };

  const getNewCode = async () => {
    try {
      const res = await fetch(
        'https://qd8vnkby53.execute-api.eu-central-1.amazonaws.com/moowi-new-card'
      );
      const { code } = await res.json();
      setSecretCode(`moowi://topup/${code}`);
      setIsSecretCodeRevealed(false);
      setIsCardLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isGettingNewCodeStarted.current) {
      return;
    }
    isGettingNewCodeStarted.current = true;
    getNewCode();
  }, []);

  return (
    <React.Fragment>
      <header css={header}>
        <Logo size={30} src={moowiLogoBig} alt="Moowi Logo" />
        <Logo size={30} src={demoCardLogo} alt="Demo card" />
      </header>
      <Card>
        <Section number={1} title="Download the app">
          <Block>
            <div>
              <Logo size={30} src={moowiLogo} alt="Moowi Logo" />
            </div>
            <div css={rowStyle}>
              <Logo size={30} src={appleLogo} alt="Apple Logo" />
              <Logo size={30} src={androidLogo} alt="Android Logo" />
            </div>
          </Block>
          <Block>
            <QRCodeSVG value={appLink} />
          </Block>
        </Section>
        <Section number={2} title="Scan secret code">
          <Block>
            {secretCode && (
              <SecretCode
                code={secretCode}
                isRevealed={isSecretCodeRevealed}
                onReveal={handleSecretCodeReveal}
              />
            )}
          </Block>
          <Block>
            <Value amount="0.1" currency="cUSD" />
          </Block>
        </Section>
        {isCardLoading && (
          <Spinner
            boxStyle={cardSpinnerBoxStyle}
            pathStyle={cardSpinnerStyle}
          />
        )}
      </Card>
      {isSecretCodeRevealed && !isCardLoading && (
        <Button
          style={bottomButtonStyle}
          isLoading={isCardLoading}
          onClick={async () => {
            setIsCardLoading(true);
            await getNewCode();
          }}
        >
          Get new code
        </Button>
      )}
    </React.Fragment>
  );
}

export default App;
