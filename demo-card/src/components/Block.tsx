import React from 'react';
import { css } from '@emotion/react';

const style = css`
  max-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

type Props = { children: React.ReactNode };

const Block = ({ children }: Props) => {
  return <div css={style}>{children}</div>;
};

export default Block;
