import React, { ReactNode } from "react";

interface Props {
  style?: React.CSSProperties;
  tagType?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: ReactNode;
  fontSize?: number;
}

export const SubTitle: React.FC<Props> = ({
  style = { fontWeight: 700 },
  tagType = "h3",
  children,
  fontSize = 20,
}) => {
  style["fontSize"] = fontSize;
  const Tag = tagType as keyof JSX.IntrinsicElements;
  return <Tag style={style}>{children}</Tag>;
};
