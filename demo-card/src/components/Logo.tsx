import { css } from '@emotion/react';

const imageStyle = css`
  width: 100%;
  height: 100%;
`;

type Props = { size?: number; src: string; alt: string };

const Logo = ({ src, alt, size }: Props) => {
  const defaultSize = 10;

  const style = css`
    height: ${size ?? defaultSize}px;
    margin: ${(size ?? defaultSize) * 0.3}px;
  `;

  return (
    <div css={style}>
      <img src={src} alt={alt} css={imageStyle} />
    </div>
  );
};

export default Logo;
