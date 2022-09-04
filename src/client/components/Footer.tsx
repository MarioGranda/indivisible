import { FC } from "react";
import Image from "next/image";
import {
  DISCORD,
  INSTAGRAM,
  LINKEDIN,
  TELEGRAM,
  TWITTER,
} from "@/shared/constants/socialMedia";
import Link from "next/link";

interface Props {
  className?: string;
}

const Footer: FC<Props> = () => {
  return (
    <footer data-scroll className="flex flex-col items-center px-3 pt-8 bg-black h-[250px] border-t border-white">
      <div className="flex mb-7 space-x-5">
        <a target="_blank" href={INSTAGRAM} rel="noreferrer">
          <Image
            src="/static/icons/instagram.svg"
            alt="instagram icon"
            height="30"
            width="30"
            aria-label="instagram icon"
          />
        </a>

        <a target="_blank" href={TWITTER} rel="noreferrer">
          <Image
            src="/static/icons/twitter.svg"
            alt="twitter icon"
            height="30"
            width="30"
            aria-label="twitter icon"
          />
        </a>

        <a target="_blank" href={LINKEDIN} rel="noreferrer">
          <Image
            src="/static/icons/linkedIn.svg"
            alt="linkedin icon"
            height="30"
            width="30"
            aria-label="linkedin icon"
          />
        </a>

        <a target="_blank" href={DISCORD} rel="noreferrer">
          <Image
            src="/static/icons/discord.svg"
            alt="discord icon"
            height="30"
            width="30"
            aria-label="discord icon"
          />
        </a>

        <a target="_blank" href={TELEGRAM} rel="noreferrer">
          <Image
            src="/static/icons/telegram.svg"
            alt="discord icon"
            height="30"
            width="30"
            aria-label="discord icon"
          />
        </a>
      </div>

      <div className="flex flex-col items-center text-white mb-2">
        <small className="font-inter text-12">
          <span className="font-semibold">INDIVISIBLE</span>
        </small>

        <nav className="flex flex-row items-center justify-center space-x-2">
          <Link passHref href="/terms-of-service">
            <a>
              <small className="font-inter leading-loose underline">
                Terms of use
              </small>
            </a>
          </Link>
          <span>-</span>
          <Link passHref href="/faq">
            <a>
              <small className="font-inter leading-loose underline">FAQs</small>
            </a>
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
