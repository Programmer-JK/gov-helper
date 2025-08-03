import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#EDEEF3] p-[50px_20px_30px_20px] md:p-[70px_20px_70px_20px] w-full flex flex-col justify-center items-center gap-2.5 px-0">
      <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start content-start gap-y-[30px] md:gap-y-[38.9375rem] md:max-w-[1164px] w-full px-4">
        <div className="flex flex-col w-[14.4375rem] gap-3.5">
          <p className="text-[#59556E] text-[0.8125rem] font-normal leading-[150%]">
            GovHelper / 대표 최기헌<br />
            서울시 강남구 가로수길<br />
            02-1234-5678<br />
            govhelpers@gmail.com
          </p>
        </div>
      </div>
      
      <div className="w-full md:max-w-[1164px] px-4 my=[0.625rem]">
        <hr className="border-t border-[#D1D5DB]" />
      </div>

      <div className="flex flex-wrap justify-between items-center content-center gap-[0.625rem] md:gap-y-[44.4375rem] md:max-w-[1164px] w-full px-4">
        <div className="flex items-center gap-7">
          <Link href="/privacy-policy" className="text-[#000] text-[0.8125rem] font-semibold leading-[150%] hover:text-[#654FFF]">
            개인정보 처리방침
          </Link>
          <Link href="/terms-of-service" className="text-[#000] text-[0.8125rem] font-semibold leading-[150%] hover:text-[#654FFF]">
            이용 약관
          </Link>
        </div>
        <div>
          <p className="text-[#59556E] text-[0.8125rem] font-normal leading-[150%]">
            Copyright © GovHelper Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}