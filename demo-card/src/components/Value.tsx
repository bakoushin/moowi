import { css } from '@emotion/react';

const style = css`
  display: flex;
  flex-direction: column;
  width: 130px;
  height: 130px;
  border: 4px solid #333;
  border-radius: 5px;
  background: transparent;
  color: #333;
`;

const amountStyle = css`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 4rem;
`;

const currencyStyle = css`
  background: #333;
  color: #fff;
  text-align: center;
  font-family: 'League Spartan', sans-serif;
  font-weight: 900;
  line-height: 35px;
  padding-top: 5px;
  letter-spacing: 1px;
`;

type Props = { amount: string; currency: string };

const Value = ({ amount, currency }: Props) => {
  return (
    <div css={style}>
      <div css={amountStyle}>{amount}</div>
      <div css={currencyStyle}>{currency}</div>
    </div>
  );
};

export default Value;
