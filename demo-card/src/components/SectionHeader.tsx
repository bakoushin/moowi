import React from 'react';
import { css } from '@emotion/react';
import oval from '../assets/oval.svg';

const style = css`
  display: flex;
  align-items: center;
  background: #d9d9d9;
  color: #000;
  text-transform: uppercase;
  line-height: 1;
  font-family: 'League Spartan', sanf-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.33rem;
  letter-spacing: 0.04rem;
  padding: 0.66rem;
`;

const childrenStyle = css`
  flex: 1;
  margin-left: 1rem;
  padding-top: 5px;
`;

const numberStyle = css`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${oval});
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 1.2rem;
  margin-left: 10px;
  padding-top: 3px;
`;

type Props = { number: number; children: React.ReactNode };

const Card = ({ children, number }: Props) => {
  return (
    <div css={style}>
      <div css={numberStyle}>{number}</div>
      <div css={childrenStyle}>{children}</div>
    </div>
  );
};

export default Card;
