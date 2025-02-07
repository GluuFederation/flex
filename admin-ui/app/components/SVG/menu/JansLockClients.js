import React from "react";
import PropTypes from "prop-types";

const JansLockClients = ({ className, style }) => {
  return (
    <div className={className} style={style}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="30pt"
        height="30pt"
        viewBox="0 0 900.000000 900.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,900.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <path
            d="M2128 8430 c-90 -14 -233 -66 -311 -113 -193 -114 -347 -329 -394
-551 -22 -104 -13 -317 17 -411 46 -143 123 -268 231 -371 110 -104 201 -156
346 -200 115 -35 306 -40 423 -10 98 24 245 93 317 149 219 169 333 402 333
680 0 172 -45 318 -141 461 -84 126 -245 259 -373 309 -139 54 -322 77 -448
57z"
          />
          <path
            d="M4373 8429 c-84 -12 -223 -63 -304 -110 -89 -51 -208 -164 -267 -253
-98 -146 -142 -294 -142 -474 0 -126 17 -211 60 -316 103 -247 303 -423 567
-498 112 -32 314 -32 426 0 264 75 464 251 567 498 43 105 60 190 60 316 0
125 -18 220 -62 325 -148 356 -521 567 -905 512z"
          />
          <path
            d="M6630 8429 c-342 -50 -635 -323 -706 -658 -18 -87 -18 -262 1 -351
54 -255 227 -472 468 -585 136 -63 216 -80 372 -79 110 1 144 5 218 28 145 44
236 96 346 200 112 108 199 251 238 396 26 94 25 351 -1 435 -49 160 -130 290
-248 399 -183 170 -443 252 -688 215z"
          />
          <path
            d="M1015 6455 c-194 -43 -334 -144 -401 -290 -55 -121 -55 -118 -52
-1280 l3 -1070 23 -69 c55 -163 167 -274 333 -332 41 -14 100 -29 132 -31 32
-3 60 -10 64 -16 3 -6 7 -639 7 -1406 l1 -1396 843 -3 842 -2 0 1124 0 1124
-72 12 c-207 35 -359 136 -430 286 -61 130 -59 62 -56 1692 l3 1487 27 88 c16
48 28 89 28 92 0 3 -278 5 -617 4 -473 0 -632 -4 -678 -14z"
          />
          <path
            d="M3255 6454 c-169 -35 -321 -144 -382 -274 -60 -128 -58 -78 -58
-1265 0 -1030 1 -1093 18 -1150 38 -123 93 -203 185 -272 68 -51 202 -102 289
-110 35 -3 63 -11 64 -17 1 -6 2 -639 3 -1406 l1 -1395 754 -3 754 -2 74 -56
c112 -84 253 -171 393 -240 953 -474 2103 -296 2873 445 411 396 670 904 754
1476 25 170 24 515 0 690 -59 414 -212 792 -460 1140 l-72 100 -5 940 c-6
1047 -1 980 -77 1135 -45 93 -126 176 -215 219 -120 59 -140 61 -830 61 -346
0 -628 -2 -628 -5 0 -3 12 -44 27 -92 l28 -88 3 -615 3 -615 -280 0 -280 0 -3
470 c-4 520 -4 520 -72 660 -63 128 -158 211 -295 258 l-66 22 -1215 2 c-1031
1 -1226 -1 -1285 -13z m3540 -1983 c798 -134 1437 -751 1599 -1543 56 -271 56
-528 1 -792 -105 -505 -417 -966 -842 -1244 -365 -239 -807 -356 -1216 -323
-317 26 -605 114 -862 266 -503 296 -851 801 -946 1370 -161 972 420 1915
1358 2206 285 88 612 110 908 60z"
          />
          <path
            d="M6315 3930 c-236 -37 -446 -166 -565 -347 -107 -163 -157 -345 -167
-605 l-6 -168 -119 0 -118 0 0 -700 0 -700 1125 0 1125 0 0 700 0 699 -117 3
-118 3 3 71 c2 39 -2 124 -8 190 -29 294 -136 528 -306 668 -150 123 -323 185
-539 191 -71 2 -157 0 -190 -5z m279 -571 c88 -22 154 -108 181 -236 8 -38 15
-123 15 -190 l0 -123 -320 0 -319 0 -7 37 c-10 52 2 221 21 294 31 118 86 189
166 214 54 17 204 19 263 4z"
          />
        </g>
      </svg>
    </div>
  );
};

export default JansLockClients;

JansLockClients.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
};
