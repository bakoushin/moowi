import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import Spinner from './Spinner';

const mainStyle = css`
  position: relative;
  background: var(--accent-color);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 1rem 3rem;
  font-family: 'League Spartan', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1;
  letter-spacing: 0.04rem;
  text-transform: uppercase;
  cursor: pointer;
`;

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  style?: SerializedStyles | null;
  children: React.ReactNode;
};

const Button = ({
  onClick,
  isLoading = false,
  style = null,
  children
}: Props) => {
  return (
    <button onClick={onClick} css={[mainStyle, style]}>
      {children}
      {isLoading && <Spinner />}
    </button>
  );
};

export default Button;
