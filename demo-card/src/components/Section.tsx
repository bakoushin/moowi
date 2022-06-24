import React from 'react';
import { css } from '@emotion/react';
import SectionHeader from '../components/SectionHeader';
import M from '../assets/M.svg';

type Props = {
  number: number;
  title: string;
  children: React.ReactNode;
};

const Section = ({ number, title, children }: Props) => {
  const style = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding: 40px;
    background-color: #fff;
    background-image: url(${M});
    background-repeat: no-repeat;
    background-size: 180%;
    background-position: ${number % 2 ? '-10% 10%' : '110%'};
    @media only screen and (min-width: 400px) {
      background-size: 110%;
      background-position: -300%;
      background-position: ${number % 2 ? '300%' : '-300%'};
    }
  `;

  return (
    <section>
      <SectionHeader number={number}>{title}</SectionHeader>
      <div css={style}>{children}</div>
    </section>
  );
};

export default Section;
