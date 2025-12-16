"use client";
import Image from "next/image";

const ExploreBtn = () => {

   return (
      <button type="button" id="explore-btn" className="mt-7 mx-auto">
         <a href="#events">
            <h2>Explore Events</h2>
            <Image
               src="/icons/arrow-down.svg"
               alt="arrow-down"
               width={16}
               height={16}
               className="ml-5"
            />
         </a>
      </button>
   );
};

export default ExploreBtn;
