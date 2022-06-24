import { css } from '@emotion/react';
import { QRCodeSVG } from 'qrcode.react';

const style = css`
  position: relative;
`;

const buttonStyleHidden = css`
  position: absolute;
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  background-color: rgba(255, 255, 255, 0.66);
  border: none;
  color: #000;
  font-family: 'League Spartan', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.3rem;
  line-height: 1.2;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(5px);
`;

const buttonStyleRevealed = css`
  transition: 0.2s ease;
  background-color: transparent;
  backdrop-filter: none;
  visibility: hidden;
`;

type Props = {
  code: string;
  isRevealed: boolean;
  onReveal: React.MouseEventHandler<HTMLButtonElement>;
};

const SecretCode = ({ code, isRevealed, onReveal }: Props) => {
  const buttonStyle = !isRevealed
    ? buttonStyleHidden
    : [buttonStyleHidden, buttonStyleRevealed];

  return (
    <div css={style}>
      <QRCodeSVG value={code} />
      <button css={buttonStyle} onClick={onReveal}>
        Click to reveal code
      </button>
    </div>
  );
};

export default SecretCode;
