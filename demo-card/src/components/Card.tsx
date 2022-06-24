import React from 'react';
import { css } from '@emotion/react';
import perforation from '../assets/perforation.svg';

const style = css`
  position: relative;
  margin: 40px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 15px 60px rgba(0, 0, 0, 0.33);
`;

const perforationStyle = css`
  height: 60px;
  background-image: url(${perforation});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

type Props = { children: React.ReactNode };

const Card = ({ children }: Props) => {
  return (
    <div css={style}>
      <div css={perforationStyle}></div>
      {children}
    </div>
  );
};

export default Card;
