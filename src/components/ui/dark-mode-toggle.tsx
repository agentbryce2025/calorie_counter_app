import React from 'react';
import * as Toggle from '@radix-ui/react-toggle';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <Toggle.Root
      pressed={isDarkMode}
      onPressedChange={onToggle}
      aria-label="Toggle dark mode"
      className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {isDarkMode ? (
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 15 15" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-yellow-400"
        >
          <path
            d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      ) : (
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 15 15" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-700"
        >
          <path
            d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.099976 2.49998 0.099976C2.27906 0.099976 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.099976 7.27906 0.099976 7.49998C0.099976 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.77519 11.0559 3.69383 11.4236C3.45593 11.4525 3.34976 11.6992 3.48124 11.8957C3.67231 12.1805 3.88723 12.4492 4.12262 12.6988C4.83326 13.4368 5.73054 13.9782 6.73942 14.2667C7.74831 14.5552 8.83106 14.5801 9.85478 14.3385C10.8785 14.0969 11.8057 13.5981 12.5378 12.8979C13.2699 12.1977 13.7789 11.3207 14.0129 10.3552C14.247 9.38976 14.1976 8.38047 13.8697 7.43763C13.5418 6.49479 12.9493 5.65661 12.1555 5.01654C11.3616 4.37647 10.4 3.96225 9.37973 3.81972C8.35943 3.6772 7.31977 3.81189 6.38635 4.20648C6.19089 4.28668 6.16548 4.55512 6.3529 4.65642C7.36093 5.17546 8.23938 5.95749 8.88284 6.90517C9.19869 7.40413 9.41602 7.94792 9.52808 8.50671C9.57559 8.72822 9.40493 8.92975 9.18142 8.89413L9.13421 8.8889C8.96525 8.86162 8.86876 8.71262 8.79134 8.57363C8.65015 8.31837 8.4853 8.0749 8.29981 7.84369C7.49964 6.87633 6.41812 6.17251 5.20322 5.86042C5.07784 5.83015 4.9504 5.80652 4.82114 5.78941C4.59727 5.75768 4.40714 5.98548 4.47355 6.20098C4.61743 6.65127 4.69231 7.12324 4.69231 7.60472C4.69231 8.31475 4.53995 8.99339 4.26219 9.60958C4.01812 10.1656 3.67358 10.6778 3.25035 11.1228C3.06462 11.3144 3.22219 11.6427 3.48599 11.6107L3.59442 11.5986C4.05709 11.5357 4.50616 11.4255 4.93646 11.2716C6.24002 10.7872 7.33734 9.88208 8.04921 8.72828C8.10307 8.64418 8.21853 8.61358 8.31598 8.65194L8.42299 8.69395C8.61221 8.77403 8.5894 9.03387 8.40453 9.10851L8.37355 9.12163C7.90253 9.32388 7.46012 9.58358 7.05507 9.88887C6.81786 10.0635 6.59342 10.2527 6.38305 10.4551C6.22377 10.6083 6.3411 10.8569 6.545 10.8859C6.79916 10.9219 7.06001 10.9401 7.32348 10.9401C8.6298 10.9401 9.85046 10.4693 10.8316 9.66237C10.9304 9.58092 11.0249 9.49509 11.1163 9.40598C11.2653 9.25823 11.5011 9.3492 11.5259 9.54831L11.5322 9.60472C11.6574 10.7019 11.2813 11.8006 10.5317 12.6128C9.68048 13.5469 8.49256 14.0858 7.24929 14.1323C6.00603 14.1787 4.7799 13.7298 3.85862 12.8809C3.43232 12.4908 3.09641 12.0274 2.84332 11.5722C2.74578 11.4099 2.49304 11.4157 2.37066 11.5514L2.23213 11.706C2.10514 11.8479 2.16059 12.0599 2.33193 12.1413C3.2154 12.5524 4.19031 12.7659 5.17647 12.7659C6.30752 12.7659 7.41849 12.478 8.41201 11.9306C9.40552 11.3832 10.2493 10.5958 10.8645 9.64456C11.4798 8.69335 11.8427 7.6061 11.9198 6.48016C11.9969 5.35422 11.7856 4.22699 11.3073 3.20416C10.829 2.18133 10.1007 1.29761 9.18999 0.632257C8.27926 -0.0330941 7.21486 -0.361355 6.13139 -0.316092C5.04792 -0.270829 3.9991 0.145686 3.10687 0.835732C3.0056 0.912544 2.99996 1.06724 3.09662 1.14583L3.18557 1.21866C3.29317 1.30641 3.45382 1.26913 3.56142 1.18138L3.63258 1.12279C4.09591 0.74066 4.63533 0.458889 5.21302 0.294498C5.79071 0.130107 6.39587 0.086843 6.9919 0.167713C7.58793 0.248583 8.16133 0.451854 8.6754 0.764666C8.7372 0.801459 8.79855 0.839057 8.85938 0.87745C8.97005 0.945831 8.92708 1.04127 8.8444 1.0918C8.3329 1.38884 7.86913 1.76685 7.46292 2.21031C6.38274 3.37584 5.76216 4.92515 5.76216 6.60071C5.76216 7.29675 5.87673 7.96253 6.0916 8.58619C6.14656 8.73681 6.04354 8.90276 5.88347 8.85616L5.84683 8.84535C5.59123 8.7747 5.34265 8.68465 5.10239 8.57571C4.99949 8.52882 4.88442 8.55311 4.81685 8.62458C4.72918 8.71753 4.75767 8.85921 4.87359 8.91653C5.53858 9.23494 6.26293 9.42195 7.01371 9.46839C7.96448 9.52734 8.92178 9.30679 9.76368 8.83863C9.87269 8.7779 9.96001 8.76993 10.0435 8.86301C10.063 8.8854 10.0801 8.91009 10.097 8.93478C10.1722 9.04194 10.0581 9.17013 9.94557 9.16047L9.86452 9.15326C9.37952 9.11325 8.892 9.02761 8.41216 8.89697C8.20123 8.84097 7.98902 8.90548 7.83681 9.05543C7.71171 9.17868 7.70176 9.37693 7.81825 9.50276L7.88499 9.57577C7.96473 9.66304 8.08526 9.69194 8.20075 9.66181C9.37362 9.34507 10.6109 9.39467 11.7695 9.79839C11.9062 9.84919 12.0352 9.90544 12.1558 9.96618C12.3143 10.0463 12.3467 10.257 12.2152 10.3599C11.7307 10.7398 11.1566 10.9401 10.5648 10.9401C9.97886 10.9401 9.39795 10.7433 8.913 10.3661C8.88804 10.3469 8.86343 10.3271 8.83882 10.3073C8.7994 10.2754 8.76046 10.2434 8.72447 10.2071C8.68283 10.1651 8.63376 10.1339 8.58047 10.1145C8.52718 10.0951 8.47096 10.0878 8.41493 10.0932C8.3589 10.0986 8.30455 10.1166 8.25477 10.1461C8.20499 10.1755 8.1608 10.2159 8.12487 10.2645C8.08894 10.3132 8.06196 10.3691 8.04537 10.4292C8.02879 10.4893 8.02294 10.5523 8.02816 10.615C8.03339 10.6777 8.04957 10.7388 8.07578 10.7946C8.102 10.8503 8.13776 10.8997 8.18103 10.9401C8.22429 10.9804 8.27425 11.0111 8.32812 11.0308C8.83686 11.2294 9.38218 11.3308 9.93153 11.33C10.6223 11.329 11.3051 11.1882 11.9323 10.9163C12.5596 10.6444 13.1188 10.2477 13.5715 9.75087C14.0241 9.25408 14.3607 8.6677 14.5577 8.02819C14.7546 7.38867 14.8079 6.71069 14.7142 6.04359C14.6205 5.37649 14.3817 4.73583 14.0155 4.16143C13.6494 3.58704 13.1646 3.09151 12.5935 2.70563C12.0225 2.31974 11.3782 2.05273 10.7009 1.92117C10.0235 1.78962 9.32751 1.79637 8.65359 1.9411C7.97967 2.08582 7.3416 2.36576 6.78037 2.76222C6.21913 3.15868 5.74782 3.66347 5.38892 4.24434C5.03002 4.82521 4.79074 5.47036 4.68585 6.14069C4.58096 6.81102 4.61249 7.49668 4.77836 8.15499C4.94423 8.8133 5.2414 9.4332 5.65219 9.97944C6.06298 10.5257 6.57953 10.9881 7.17014 11.3395C7.76074 11.6909 8.41404 11.9242 9.09599 12.0255C9.77794 12.1267 10.4727 12.0938 11.141 11.9289C11.8094 11.764 12.4375 11.471 12.9881 11.0678C13.5387 10.6647 14.0002 10.1599 14.3432 9.58256C14.6862 9.00522 14.9034 8.36007 14.9817 7.68975C15.0599 7.01942 14.9978 6.34059 14.7995 5.69639C14.6012 5.05219 14.271 4.45823 13.8302 3.95046C13.3893 3.44269 12.8486 3.03179 12.2435 2.74359C11.5433 2.40478 10.7675 2.2347 9.98671 2.24934C9.20591 2.26398 8.43784 2.46285 7.75278 2.82762C7.43277 2.99858 7.13532 3.20272 6.86582 3.43603C6.78183 3.50634 6.66599 3.46663 6.64848 3.35902L6.64509 3.34079C6.56636 2.87645 6.57085 2.40299 6.6584 1.93997C6.74595 1.47694 6.91496 1.03322 7.15719 0.629991C7.392 0.242077 7.77399 0 8.17647 0C8.3468 0 8.51378 0.0252966 8.67373 0.0731177L8.95672 0.155233C9.18354 0.211247 9.2565 0.483495 9.11467 0.6473C8.90644 0.889709 8.71924 1.15054 8.55535 1.42861C8.4964 1.52094 8.56013 1.63784 8.67021 1.63521L8.77843 1.63263C8.9554 1.62839 9.13144 1.66524 9.29438 1.74077C9.32662 1.75532 9.35806 1.77128 9.38861 1.78862C9.41917 1.80596 9.44875 1.82462 9.47725 1.84456C9.5057 1.86444 9.533 1.88552 9.55906 1.90772C9.58511 1.92998 9.60986 1.95329 9.63324 1.97767C9.65666 2.00201 9.67861 2.02734 9.69902 2.05359C9.71938 2.07979 9.73814 2.10682 9.75526 2.13459C9.77243 2.16242 9.78792 2.19097 9.80176 2.22015C9.81559 2.24933 9.82761 2.27907 9.83778 2.30936C9.86802 2.4004 9.78494 2.48892 9.69082 2.45931L9.63089 2.44051C9.37655 2.36528 9.1147 2.31214 8.85014 2.282C8.63139 2.25774 8.41146 2.25584 8.1926 2.27636C8.10419 2.28446 8.05268 2.25175 8.06217 2.16255L8.07207 2.06921C8.10219 1.79207 8.25376 1.55525 8.47087 1.40343C8.52659 1.36543 8.54118 1.30066 8.51339 1.24557L8.45767 1.1372C8.42879 1.07992 8.3651 1.05426 8.30423 1.06941L8.24618 1.08378C8.03275 1.1077 7.90692 0.859868 8.02936 0.683429C8.17013 0.480573 8.29981 0.269444 8.41754 0.0509152C8.44123 0.00359717 8.4541 -0.00925496 8.50498 0.00359717L8.54406 0.0137193C8.78667 0.0467953 8.88188 0.294387 8.74825 0.50625C8.61714 0.714813 8.66996 0.95977 8.54406 0.98184Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </Toggle.Root>
  );
};

export default DarkModeToggle;