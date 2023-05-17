import classNames from "classnames";
import React from "react";
import styled from "styled-components";

const TextHeadingStyle = styled.div`
  &:after {
    content: "${(props) => props.after}";
  }
`;

const TextHeading = ({ children, after }) => {
  return (
    <TextHeadingStyle
      after={after}
      className={classNames(
        ` after:top-1/2 after:-translate-y-1/2 after:text-gray-200 relative after:absolute after:left-4  after:text-4xl lg:text-6xl after:xl:text-8xl after:-z-50 after:uppercase after:tracking-widest `
      )}
    >
      <h1 className="inline-block cs-heading-primary relative z-30">
        {children}
      </h1>
    </TextHeadingStyle>
  );
};

export default TextHeading;
