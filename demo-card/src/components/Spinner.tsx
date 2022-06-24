import { css, keyframes, SerializedStyles } from '@emotion/react';

const rotate = keyframes`
100% {
  transform: rotate(360deg);
}`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const spinnerStyle = css`
  animation: ${rotate} 2s linear infinite;
`;

const pathDefaultStyle = css`
  stroke: rgba(255, 255, 255, 0.66);
  stroke-linecap: round;
  animation: ${dash} 1.5s ease-in-out infinite;
`;

const boxDefaultStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: inherit;
`;

type Props = {
  size?: number | string;
  pathStyle?: SerializedStyles | null;
  boxStyle?: SerializedStyles | null;
};

const Spinner = ({ size = 32, pathStyle = null, boxStyle = null }: Props) => {
  const spinnerSize = css`
    width: ${size}px;
    height: ${size}px;
  `;

  return (
    <div css={[boxDefaultStyle, boxStyle]}>
      <svg css={[spinnerStyle, spinnerSize]} viewBox="0 0 50 50">
        <circle
          css={[pathDefaultStyle, pathStyle]}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
    </div>
  );
};

export default Spinner;
