import Script from "next/script";
import { FC } from "react";

const NextScripts: FC = () => {
  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            WebFontConfig = {
          google: {
              families: ['Source Code Pro:300,400,700,900']
          }
      };
            `,
        }}
      />

      <Script
        strategy="afterInteractive"
        src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
      />
    </>
  );
};

export default NextScripts;
