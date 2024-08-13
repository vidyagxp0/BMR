export const DefaultColor = '#006fc0';

export const Envelope = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M0 146.484v168.677l600 342.114l600-342.114V146.484zm0 276.563v494.604L305.64 597.29zm1200 0L894.36 597.29L1200 917.651zM389.575 645.19L0 1053.516h1200L810.425 645.19L600 765.161z" />
    </svg>
}

export const PhoneAlt = (size, color) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M23 2L17 8M23 2C21.7 7.5 17 13 17 13C17 13 13.5 15.2 8 17C4.2 18.2 1 18 1 18C1 18 3.2 14.8 4.4 11C5.2 8.3 5 5 5 5C5 5 8.3 4.8 11 5.6C14.8 6.8 18 9 18 9C18 9 19.8 5.5 23 4C23 4 22.8 1.3 23 2Z"></path>
    </svg>
);


export const PasswordLock = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} fillRule="evenodd" d="M6.75 8a5.25 5.25 0 0 1 10.335-1.313a.75.75 0 0 0 1.452-.374A6.75 6.75 0 0 0 5.25 8v2.055c-1.115.083-1.84.293-2.371.824C2 11.757 2 13.172 2 16c0 2.828 0 4.243.879 5.121C3.757 22 5.172 22 8 22h8c2.828 0 4.243 0 5.121-.879C22 20.243 22 18.828 22 16c0-2.828 0-4.243-.879-5.121C20.243 10 18.828 10 16 10H8c-.452 0-.867 0-1.25.004zM8 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2a1 1 0 0 0 0 2m5-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0" clipRule="evenodd" />
    </svg>
}

export const DownAngle = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M36 18L24 30L12 18" />
    </svg>
}

export const UserManagement = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="m16 21l-.3-1.5q-.3-.125-.562-.262T14.6 18.9l-1.45.45l-1-1.7l1.15-1q-.05-.35-.05-.65t.05-.65l-1.15-1l1-1.7l1.45.45q.275-.2.538-.337t.562-.263L16 11h2l.3 1.5q.3.125.563.275t.537.375l1.45-.5l1 1.75l-1.15 1q.05.3.05.625t-.05.625l1.15 1l-1 1.7l-1.45-.45q-.275.2-.537.338t-.563.262L18 21zM2 20v-2.8q0-.825.425-1.55t1.175-1.1q1.275-.65 2.875-1.1T10 13h.35q.15 0 .3.05q-.725 1.8-.6 3.575T11.25 20zm15-2q.825 0 1.413-.587T19 16q0-.825-.587-1.412T17 14q-.825 0-1.412.588T15 16q0 .825.588 1.413T17 18m-7-6q-1.65 0-2.825-1.175T6 8q0-1.65 1.175-2.825T10 4q1.65 0 2.825 1.175T14 8q0 1.65-1.175 2.825T10 12" />
    </svg>;
}

export const Search = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M10 .188A9.812 9.812 0 0 0 .187 10A9.812 9.812 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.824 1.824 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16M4.937 7.469a5.446 5.446 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.516 5.516 0 0 0 3.156-1a7.166 7.166 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312" />
    </svg>;
}

export const Edit = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413zm-3-3l1.587 1.585l-1.59 1.584l-1.586-1.585zM6 16v-1.585l7.04-7.018l1.586 1.586L7.587 16zm-2 4h16v2H4z" />
    </svg>;
}

export const Download = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="m12 16l4-5h-3V4h-2v7H8z" />
        <path fill={color} d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2z" />
    </svg>;
}

export const Setting = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M18 16V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h13c.55 0 1-.45 1-1M8 11h1c.55 0 1 .45 1 1s-.45 1-1 1H8v1.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5V13H6c-.55 0-1-.45-1-1s.45-1 1-1h1V5.5c0-.28.22-.5.5-.5s.5.22.5.5zm5-2h-1c-.55 0-1-.45-1-1s.45-1 1-1h1V5.5c0-.28.22-.5.5-.5s.5.22.5.5V7h1c.55 0 1 .45 1 1s-.45 1-1 1h-1v5.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5z" />
    </svg>;
}

export const AddIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M19.5 7.05h-7L9.87 3.87a1 1 0 0 0-.77-.37H4.5A2.47 2.47 0 0 0 2 5.93v12.14a2.47 2.47 0 0 0 2.5 2.43h15a2.47 2.47 0 0 0 2.5-2.43V9.48a2.47 2.47 0 0 0-2.5-2.43M14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2" />
    </svg>;
}

export const EyeIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19M288 400a144 144 0 1 1 144-144a143.93 143.93 0 0 1-144 144m0-240a95.31 95.31 0 0 0-25.31 3.79a47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160" />
    </svg>;
}

export const EyeSlashIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61m313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07a32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45m-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" />
    </svg>;
}

export const CrossIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5" />
    </svg>;
}

export const AuditTrailIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke={color} strokeWidth="2" d="M8 6h8V1H8zm8-3h5v20H3V3h5m0 11l3 3l6-6" />
    </svg>;
}

export const PersonIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M12 11.385q-1.237 0-2.119-.882T9 8.385q0-1.238.881-2.12q.881-.88 2.119-.88t2.119.88q.881.882.881 2.12q0 1.237-.881 2.118T12 11.385m-7 7.23V16.97q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.833-1.018q1.418-.34 2.837-.34q1.42 0 2.837.34q1.417.34 2.832 1.018q.61.298.97.838q.361.539.361 1.158v1.646z" />
    </svg>
}

export const LoginIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M17 11h-6a3 3 0 0 0-3 3v4h2v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h2v-1a3 3 0 0 0-3-3m-7-5a4 4 0 1 0 4-4a4 4 0 0 0-4 4m6 0a2 2 0 1 1-2-2a2 2 0 0 1 2 2m6 21h-6a2.002 2.002 0 0 1-2-2v-6a2.002 2.002 0 0 1 2-2h6a2.002 2.002 0 0 1 2 2v6a2.002 2.002 0 0 1-2 2m-6-8v6h6v-6zM8 30H4a2.002 2.002 0 0 1-2-2V4a2.002 2.002 0 0 1 2-2h4v2H4v24h4zm20 0h-4v-2h4V4h-4V2h4a2.002 2.002 0 0 1 2 2v24a2.002 2.002 0 0 1-2 2" />
    </svg>;
}

export const RoleIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="m29.707 19.293l-3-3a1 1 0 0 0-1.414 0L16 25.586V30h4.414l9.293-9.293a1 1 0 0 0 0-1.414M19.586 28H18v-1.586l5-5L24.586 23zM26 21.586L24.414 20L26 18.414L27.586 20zM8 16h10v2H8zm0-6h12v2H8z" />
        <path fill={color} d="M26 4a2.002 2.002 0 0 0-2-2H4a2.002 2.002 0 0 0-2 2v13a10.981 10.981 0 0 0 5.824 9.707L13 29.467V27.2l-4.234-2.258A8.986 8.986 0 0 1 4 17V4h20v9h2Z" />
    </svg>;
}

export const DocumentViewIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="24" r="2" fill={color} />
        <path fill="none" d="M22 28a4 4 0 1 1 4-4a4.004 4.004 0 0 1-4 4m0-6a2 2 0 1 0 2 2a2.003 2.003 0 0 0-2-2" />
        <path fill={color} d="M29.777 23.479A8.64 8.64 0 0 0 22 18a8.64 8.64 0 0 0-7.777 5.479L14 24l.223.522A8.64 8.64 0 0 0 22 30a8.64 8.64 0 0 0 7.777-5.478L30 24ZM22 28a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4" />
        <path fill={color} d="M12 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6v4h2v-6a.91.91 0 0 0-.3-.7l-7-7A.909.909 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h4Zm6-23.6l5.6 5.6H18Z" />
    </svg>;
}

export const DeleteIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFF" d="M51.76 17H20.153v37.65c0 4.06 3.29 5.62 7.35 5.62H44.41c4.06 0 7.35-1.56 7.35-5.62zM31 16v-4h10v4" />
        <path fill={color} d="M51 37v20.621L48.3 60H33z" />
        <path fill="#FFF" d="M17 16h38v4H17z" />
        <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M31 16v-4h10v4m10 9v31a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V25m-4-9h38v4H17zm24 12.25V55M31 28.25V55" />
    </svg>;
}

export const RoundedRightIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M256 8c137 0 248 111 248 248S393 504 256 504S8 393 8 256S119 8 256 8m-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4" />
    </svg>;
}

export const RoundedLeftIcon = (size, color) => {
    return <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248s-111 248-248 248m28.9-143.6L209.4 288H392c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24H209.4l75.5-72.4c9.7-9.3 9.9-24.8.4-34.3l-11-10.9c-9.4-9.4-24.6-9.4-33.9 0L107.7 239c-9.4 9.4-9.4 24.6 0 33.9l132.7 132.7c9.4 9.4 24.6 9.4 33.9 0l11-10.9c9.5-9.5 9.3-25-.4-34.3" />
    </svg>;
}