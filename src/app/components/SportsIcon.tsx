import {
  Trophy,
  Dumbbell,
  Waves,
  Activity,
  Award,
  Users
} from 'lucide-react';

interface SportsIconProps {
  sport: string;
  className?: string;
}

export function SportsIcon({ sport, className = "w-6 h-6" }: SportsIconProps) {
  const sportLower = sport.toLowerCase();

  // Football / Soccer
  if (sportLower.includes('football') || sportLower.includes('soccer')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 6.7V5.3zm-3.35-.95L11 5.3v1.4L7.01 9.49l-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.08 17.11l-1.14.1C4.73 15.81 4 13.99 4 12c0-.63.09-1.24.23-1.82l1.12-.38L6.6 10.5 9 14.06l-.47 1.65-1.45 1.4zm8.37 1.49H8.55l-.66-1.33.47-1.66 1.28-.91h4.72l1.28.91.47 1.66-.66 1.33zm2.49-1.49l-1.45-1.4L16 14.06l2.4-3.56 1.25-.7 1.12.38c.14.58.23 1.19.23 1.82 0 1.99-.73 3.81-1.94 5.21l-1.14-.1z"/>
      </svg>
    );
  }

  // Rugby
  if (sportLower.includes('rugby')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.49 3.51c-.56-.56-2.15-.97-4.16-.97-4.41 0-10.23 2.08-12.82 4.67C.89 9.83-.67 15.85 3.51 20.49c.87.87 2.73 1.39 5.01 1.39 4.07 0 9.5-1.89 12.09-4.48 2.62-2.59 4.68-8.61 1.07-12.82-.56-.72-1.19-1.07-1.19-1.07zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1 2.5v-1h2v1h-2z"/>
      </svg>
    );
  }

  // Hockey (field hockey)
  if (sportLower.includes('hockey')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.12 1.29a1 1 0 0 0-1.41 0L4.29 9.71a1 1 0 0 0 0 1.41l1.59 1.59-3.59 3.59a2 2 0 0 0 0 2.83l2.58 2.58a2 2 0 0 0 2.83 0l3.59-3.59 1.59 1.59a1 1 0 0 0 1.41 0l8.42-8.42a1 1 0 0 0 0-1.41L14.12 1.29zM7 20.29L4.71 18 8.3 14.41l2.29 2.29L7 20.29z"/>
        <circle cx="19" cy="19" r="2.5"/>
      </svg>
    );
  }

  // Elle (Sri Lankan bat and ball game)
  if (sportLower.includes('elle')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 19.5C3.12 19.5 2 18.38 2 17s1.12-2.5 2.5-2.5S7 15.62 7 17s-1.12 2.5-2.5 2.5zm0-3.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
        <path d="M20 2c-.83 0-1.58.34-2.12.89L7.71 13.06l1.41 1.41L13.06 10.53l1.41 1.41-3.94 3.94 1.41 1.41L22 7.12A3 3 0 0 0 22 2c0-.55-.22-1.05-.59-1.41A1.993 1.993 0 0 0 20 2z"/>
        <path d="M9.88 15.88l-1.41 1.41 2.12 2.12 1.41-1.41z"/>
      </svg>
    );
  }

  // NetBall
  if (sportLower.includes('netball')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="4" r="2.5"/>
        <path d="M15 22h-2v-5h-2v5H9v-7.5l-2.5-4.5L8 8h8l1.5 2-2.5 4.5V22z"/>
        <path d="M20 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
        <rect x="18.5" y="10" width="3" height="5" rx="1"/>
      </svg>
    );
  }

  // Judo
  if (sportLower.includes('judo')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="7" cy="3" r="2"/>
        <circle cx="17" cy="3" r="2"/>
        <path d="M14 7h-4c-1.1 0-2 .9-2 2v4l-3 3 1.41 1.41L9 14.83V18h2v4h2v-4h2v4h2v-4h2v-3.17l2.59 2.58L19 16l-3-3V9c0-1.1-.9-2-2-2z"/>
        <path d="M5.5 16l-2 2L5 19.5l2-2z"/>
      </svg>
    );
  }

  // Wrestling
  if (sportLower.includes('wrestling')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="3.5" r="2"/>
        <circle cx="18" cy="3.5" r="2"/>
        <path d="M15 7H9C7.9 7 7 7.9 7 9v3c0 .83.67 1.5 1.5 1.5S10 12.83 10 12v-1h4v1c0 .83.67 1.5 1.5 1.5S17 12.83 17 12V9c0-1.1-.9-2-2-2z"/>
        <path d="M5 14l-3 4.5L3.5 20 7 15.5 8.5 17l-2 4h3l1.5-3h2l1.5 3h3l-2-4L17 15.5 20.5 20l1.5-1.5L19 14l-3.5 1-1.5-1h-4l-1.5 1L5 14z"/>
      </svg>
    );
  }

  // Cricket
  if (sportLower.includes('cricket')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.06 2.53a3 3 0 0 0-4.24 0L6.34 12.01l-.7-.71-1.42 1.42.71.7-2.83 2.83a2 2 0 0 0 0 2.83l2.83 2.83a2 2 0 0 0 2.83 0l2.83-2.83.7.71 1.42-1.42-.71-.7 9.48-9.49a3 3 0 0 0 0-4.24l-1.41-1.41zM7.05 20.49L4.22 17.66l2.12-2.12 2.83 2.83-2.12 2.12z"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    );
  }

  // Swimming / Diving / Water sports
  if (sportLower.includes('swimming') || sportLower.includes('synchronized')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36C3.73 20.63 3.11 21 2 21v-2c.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2z"/>
        <path d="M22 17c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36C3.73 16.63 3.11 17 2 17v-2c.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2z"/>
        <circle cx="16.5" cy="5.5" r="2.5"/>
        <path d="M18 9h-3.5L12 12.5l1.5 1.14L15 12h1l2 3h2l-2-6z"/>
      </svg>
    );
  }

  // Diving
  if (sportLower.includes('diving')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="4" r="2.5"/>
        <path d="M7 22c1.1 0 2.5-.4 3.4-1l.6-.4.6.4c.9.6 2.3 1 3.4 1 1.1 0 2.5-.4 3.4-1l.6-.4.6.4c.9.6 2.3 1 3.4 1v-2c-.7 0-1.6-.3-2.1-.6l-1.3-.8-1.3.8c-.5.3-1.4.6-2.1.6-.7 0-1.6-.3-2.1-.6l-1.3-.8-1.3.8c-.5.3-1.4.6-2.1.6-.7 0-1.6-.3-2.1-.6L4 18.6l-1.3.8c-.5.3-1.4.6-2.1.6v2c1.1 0 2.5-.4 3.4-1l.6-.4.6.4c.9.6 2.3 1 3.4 1z"/>
        <path d="M13 8h-2v4l-3 4 1.5 1.12L12 13.5l2.5 3.62L16 16l-3-4V8z"/>
      </svg>
    );
  }

  // Water Polo
  if (sportLower.includes('water')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="4" r="2.5"/>
        <path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64C5.78 20.13 5.56 20 5 20s-.78.13-1.15.36C3.39 20.63 2.78 21 1.67 21v-2c.56 0 .78-.13 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2z"/>
        <path d="M6.5 8h5l2 2.5 2-2.5h2v4l-4 3v3h-2v-3l-2-1.5-2 1.5v3H5.5v-3l-3-4L4 8.5 6.5 8z"/>
        <circle cx="18" cy="10" r="2"/>
      </svg>
    );
  }

  // Basketball (including 3x3)
  if (sportLower.includes('basketball')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM5.23 7.75C6.1 8.62 6.7 9.74 6.91 11H4.07c.15-1.18.56-2.28 1.16-3.25zM4.07 13h2.84c-.21 1.26-.81 2.38-1.68 3.25-.6-.97-1.01-2.07-1.16-3.25zM11 19.93c-1.73-.22-3.29-1-4.49-2.14 1.17-1.13 1.96-2.62 2.2-4.29H11v6.43zm0-8.43H8.71c.24-1.67 1.03-3.16 2.2-4.29C12.1 6.08 12.9 5.3 13 4.07h-2v7.43zm2-7.43c1.73.22 3.29 1 4.49 2.14-1.17 1.13-1.96 2.62-2.2 4.29H13V4.07zm0 8.43h2.29c-.24 1.67-1.03 3.16-2.2 4.29v-4.29zm5.77.75c-.87-.87-1.47-1.99-1.68-3.25h2.84c-.15 1.18-.56 2.28-1.16 3.25zm-1.68-5.25c.21-1.26.81-2.38 1.68-3.25.6.97 1.01 2.07 1.16 3.25h-2.84z"/>
      </svg>
    );
  }

  // Volleyball
  if (sportLower.includes('volleyball')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.2 14.96L7.35 14.5 6.2 8.3l4.43-2.48 4.45 2.48-1.15 6.2-4.13 2.46zm.4 2.99V17l3.8-2.27.9 4.84c-1.4.78-3 1.24-4.7 1.38zm5.3-2.6l-.82-4.42 3.34-3.55c.37 1.02.58 2.12.58 3.27 0 1.81-.47 3.5-1.28 4.98l-1.82-.28zm1.78-6.85L16 13.74 12.38 12l-.57-3.08L15.38 6l3.9 4.5zM14.35 4.57L12.14 7.1 8.1 5.35l.58-.87C10.04 3.64 11.84 3.22 13.62 3.2l.73 1.37zM6.98 4.88l.37.86L4.4 9.5l-1.69-.98C3.67 6.87 5.1 5.57 6.98 4.88zM3.76 10.76l1.68.97-.45 2.42-1.58.61C3.14 13.8 3.06 12.6 3.15 11.4l.61-.64zm.8 5.36l1.6-.62L9.5 17.5l-.3 1.86c-1.88-.67-3.48-1.86-4.64-3.24z"/>
      </svg>
    );
  }

  // Badminton
  if (sportLower.includes('badminton')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.3 2l-1.2 3.46L8.5 2.5 7 4l3.2 3.2L6.8 8.5 2 12l4.96 1.54L3 17.5 6.5 21l3.96-3.96L12 22l3.5-4.8 1.3-3.4L20 17l1.5-1.5-2.96-2.6L22 12l-3.5-4.8-1.3-3.4L20 7l-1.5-1.5-2.96-2.6L12.3 2z"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    );
  }

  // Table Tennis
  if (sportLower.includes('table tennis') || sportLower.includes('ping pong')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.46 2.64C16.77 1.14 14.55.5 12.37.72 8.27 1.14 5 4.7 5 8.83v.67L2.3 12.2a1 1 0 0 0 0 1.41l3.09 3.09a1 1 0 0 0 1.41 0L9.5 14h.67c2.21 0 4.28-.73 5.96-2.04L18.46 2.64z"/>
        <path d="M20.72 5.5c-.14-.15-.29-.29-.44-.43l-2.28 9.15c.49-.35.95-.75 1.38-1.18 2.63-2.63 3.22-6.55 1.34-7.54z"/>
        <circle cx="18" cy="18" r="3"/>
      </svg>
    );
  }

  // Athletics / Running / Track
  if (sportLower.includes('athletics') || sportLower.includes('running') || sportLower.includes('track')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="13.5" cy="5.5" r="2.5"/>
        <path d="M17.5 10.78l-2.39-.78-1.17-1.34C13.53 8.2 12.94 8 12.36 8c-.38 0-.76.09-1.1.27L7.5 10.5l1 2 3-1.5-1.5 5L6.5 19l1.3 1.5L12 17l2-4 3 2.5v4.5h2v-6l-2.5-2.98.72-2.24z"/>
      </svg>
    );
  }

  // Kabbadi / Kabaddi
  if (sportLower.includes('kabbadi') || sportLower.includes('kabaddi')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="8" cy="3.5" r="2"/>
        <circle cx="16" cy="3.5" r="2"/>
        <path d="M16.5 7h-3c-.28 0-.55.05-.8.14L12 7.5l-.7-.36A2.01 2.01 0 0 0 10.5 7h-3C6.12 7 5 8.12 5 9.5V14h2v-4h1l-2 7h2.5l1.5-5 1.5 5H14l-2-7h1v4h2V9.5C17 8.12 15.88 7 14.5 7h2z"/>
        <path d="M4 17l-2 4h2.5L6 18.5 7.5 21H10l-2-4H4zm12 0l-2 4h2.5L18 18.5 19.5 21H22l-2-4h-4z"/>
      </svg>
    );
  }

  // Futsal
  if (sportLower.includes('futsal')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 7l-1.5 1.1-.6 1.9h4.2l-.6-1.9L12 7zm-3.8 3.6l-1.2.4-.6 1.8 1.2.9h1.4l.6-1.8-.7-1.3h-.7zm7.6 0h-.7l-.7 1.3.6 1.8h1.4l1.2-.9-.6-1.8-1.2-.4zm-6 4l-.5 1.5.9 1.3h1.4l.5-1.5-.9-1.3h-1.4zm4.4 0h-1.4l-.9 1.3.5 1.5h1.4l.9-1.3-.5-1.5z"/>
      </svg>
    );
  }

  // Handball
  if (sportLower.includes('handball')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 3c0 4.97 4.03 9 9 9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3c0 4.97-4.03 9-9 9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 12c4.97 0 9 4.03 9 9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 12c-4.97 0-9 4.03-9 9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }

  // Chess
  if (sportLower.includes('chess')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L10.5 5H9V7h1l-2 5H6v2h1l-1 3H5v2h14v-2h-1l-1-3h1v-2h-2l-2-5h1V5h-1.5L12 2zm-2.5 12l1-3h3l1 3h-5zM8 21h8v1H8v-1z"/>
      </svg>
    );
  }

  // Carrom
  if (sportLower.includes('carrom')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="4.5" cy="4.5" r="1.2"/>
        <circle cx="19.5" cy="4.5" r="1.2"/>
        <circle cx="4.5" cy="19.5" r="1.2"/>
        <circle cx="19.5" cy="19.5" r="1.2"/>
        <circle cx="12" cy="12" r="1.5"/>
        <circle cx="10" cy="10" r="1" opacity="0.7"/>
        <circle cx="14" cy="10" r="1" opacity="0.7"/>
        <circle cx="10" cy="14" r="1" opacity="0.7"/>
        <circle cx="14" cy="14" r="1" opacity="0.7"/>
        <circle cx="12" cy="9" r="0.8" opacity="0.5"/>
        <circle cx="12" cy="15" r="0.8" opacity="0.5"/>
      </svg>
    );
  }

  // Ludo
  if (sportLower.includes('ludo')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="8" height="8" rx="1" opacity="0.8"/>
        <rect x="14" y="2" width="8" height="8" rx="1" opacity="0.6"/>
        <rect x="2" y="14" width="8" height="8" rx="1" opacity="0.6"/>
        <rect x="14" y="14" width="8" height="8" rx="1" opacity="0.8"/>
        <rect x="10" y="8" width="4" height="8" rx="0.5" opacity="0.4"/>
        <rect x="8" y="10" width="8" height="4" rx="0.5" opacity="0.4"/>
        <circle cx="6" cy="6" r="1.5" fill="white"/>
        <circle cx="18" cy="6" r="1.5" fill="white"/>
        <circle cx="6" cy="18" r="1.5" fill="white"/>
        <circle cx="18" cy="18" r="1.5" fill="white"/>
      </svg>
    );
  }

  // Snakes and Ladders
  if (sportLower.includes('snakes') || sportLower.includes('ladder')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="2" y1="6.5" x2="22" y2="6.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        <line x1="2" y1="11" x2="22" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        <line x1="2" y1="15.5" x2="22" y2="15.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        {/* Ladder */}
        <line x1="7" y1="18" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="10" y1="18" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="7.3" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="1"/>
        <line x1="6.8" y1="13" x2="9.5" y2="13" stroke="currentColor" strokeWidth="1"/>
        <line x1="6.2" y1="10" x2="8.9" y2="10" stroke="currentColor" strokeWidth="1"/>
        {/* Snake */}
        <path d="M17 6c-1 1-3 0-3 2s3 1 3 3-3 1-3 3 2 2 3 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="5.5" r="1"/>
      </svg>
    );
  }

  // Scrabble
  if (sportLower.includes('scrabble')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="1" y="5" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <text x="5" y="11.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">A</text>
        <text x="8" y="12.5" textAnchor="middle" fontSize="3" fill="currentColor">1</text>
        <rect x="10" y="5" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <text x="14" y="11.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">B</text>
        <text x="17" y="12.5" textAnchor="middle" fontSize="3" fill="currentColor">3</text>
        <rect x="5.5" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <text x="9.5" y="20.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">C</text>
        <text x="12.5" y="21.5" textAnchor="middle" fontSize="3" fill="currentColor">3</text>
      </svg>
    );
  }

  // Playing Cards
  if (sportLower.includes('card')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="1" width="12" height="17" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-8 9 9.5)"/>
        <rect x="9" y="4" width="12" height="17" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(8 15 12.5)"/>
        <path d="M8 7.5c0-1.5 1.5-2.5 1.5-2.5s1.5 1 1.5 2.5c0 1-1.5 1.5-1.5 1.5S8 8.5 8 7.5z"/>
        <path d="M14 11l1 2.5 1-2.5.7 1-1.7 3-1-2.5L13.3 12z"/>
      </svg>
    );
  }

  // Darts
  if (sportLower.includes('dart')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="12" cy="12" r="1.5"/>
        <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.8"/>
        {/* Dart arrow */}
        <line x1="18" y1="3" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="19,2 21,2 21,4"/>
        <line x1="18.5" y1="4.5" x2="16.5" y2="3.5" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="19.5" y1="5.5" x2="20.5" y2="3.5" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    );
  }

  // Billiards / Pool
  if (sportLower.includes('billiard') || sportLower.includes('pool') || sportLower.includes('snooker')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        {/* Balls in triangle */}
        <circle cx="9" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="11" cy="11.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="11" cy="11.5" r="0.6"/>
        <text x="9" y="9.2" textAnchor="middle" fontSize="2.5" fill="currentColor">3</text>
        {/* Cue stick */}
        <line x1="4" y1="22" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // Foosball
  if (sportLower.includes('foosball')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        {/* Rods */}
        <line x1="0" y1="9" x2="24" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <line x1="0" y1="15" x2="24" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        {/* Players */}
        <rect x="6" y="7" width="2" height="4" rx="0.5"/>
        <rect x="11" y="7" width="2" height="4" rx="0.5"/>
        <rect x="16" y="7" width="2" height="4" rx="0.5"/>
        <rect x="4" y="13" width="2" height="4" rx="0.5"/>
        <rect x="9" y="13" width="2" height="4" rx="0.5"/>
        <rect x="14" y="13" width="2" height="4" rx="0.5"/>
        <rect x="19" y="13" width="2" height="4" rx="0.5"/>
        {/* Ball */}
        <circle cx="12" cy="12" r="1"/>
      </svg>
    );
  }

  // Video Games
  if (sportLower.includes('video game') || sportLower.includes('gaming') || sportLower.includes('esport')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM7 15H5v-2H3v-2h2V9h2v2h2v2H7v2zm7-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
      </svg>
    );
  }

  // Board Games / Dominoes - Dice
  if (sportLower.includes('board game') || sportLower.includes('dice')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="7.5" cy="7.5" r="1.5"/>
        <circle cx="12" cy="12" r="1.5"/>
        <circle cx="16.5" cy="16.5" r="1.5"/>
        <circle cx="7.5" cy="16.5" r="1.5"/>
        <circle cx="16.5" cy="7.5" r="1.5"/>
      </svg>
    );
  }

  // Dominoes
  if (sportLower.includes('domino')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="1" width="14" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="9" cy="5" r="1.2"/>
        <circle cx="15" cy="5" r="1.2"/>
        <circle cx="12" cy="8" r="1.2"/>
        <circle cx="9" cy="16" r="1.2"/>
        <circle cx="15" cy="19" r="1.2"/>
      </svg>
    );
  }

  // Puzzle Games
  if (sportLower.includes('puzzle')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.38 0 2.5 1.12 2.5 2.5S4.88 15.8 3.5 15.8H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
      </svg>
    );
  }

  // Tennis (NOT table tennis)
  if (sportLower === 'tennis' || (sportLower.includes('tennis') && !sportLower.includes('table'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        {/* Racket */}
        <ellipse cx="13" cy="8" rx="5.5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="13" y1="1" x2="13" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        <path d="M7.5 5.5c2 0 5 1.5 5 5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        <path d="M18.5 5.5c-2 0-5 1.5-5 5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        {/* Handle */}
        <line x1="10" y1="14" x2="5" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Ball */}
        <circle cx="20" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18.2 16c.8 1.2.8 2.8 0 4" fill="none" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    );
  }

  // Baseball / Softball
  if (sportLower.includes('baseball') || sportLower.includes('softball')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        {/* Bat */}
        <path d="M4 20L14 10c1-1 3-1.5 4.5-.5s1.5 3 .5 4.5L9 20c-.5.5-1.5.8-2.5.5L4 20z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="2" y1="22" x2="5" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Ball */}
        <circle cx="8" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 3.5c1 1.5 1 3.5 0 5" fill="none" stroke="currentColor" strokeWidth="0.8"/>
        <path d="M10.5 3.5c-1 1.5-1 3.5 0 5" fill="none" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    );
  }

  // Cycling
  if (sportLower.includes('cycling') || sportLower.includes('bicycle') || sportLower.includes('bike')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="18" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        {/* Frame */}
        <polyline points="6,17 10,9 14,17 18,17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="10" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="14" y1="9" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5"/>
        {/* Handlebars */}
        <line x1="14" y1="9" x2="17" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Seat */}
        <line x1="10" y1="9" x2="9" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        {/* Pedal */}
        <circle cx="14" cy="17" r="1"/>
      </svg>
    );
  }

  // Long Jump
  if (sportLower.includes('long jump')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="17" cy="4" r="2.5"/>
        {/* Body jumping forward */}
        <path d="M20 8l-4 1-3-1.5c-.6-.3-1.3-.2-1.8.2L7 11l1.2 1.6 3.3-2.1L13 12l-4 5.5L10.5 19 15 13l2 1v5h2v-6.5l-2.5-2L19 9l2 .5.5-2L20 8z"/>
        {/* Sand pit */}
        <path d="M2 20h8l1-1H3l-1 1z" opacity="0.4"/>
      </svg>
    );
  }

  // High Jump
  if (sportLower.includes('high jump')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="14" cy="3" r="2.5"/>
        {/* Body arching over bar */}
        <path d="M8 10c2-2 4-3 6-2.5l2 .5c1 .5 1.5 1.5 1 2.5l-3 4-1.5-.5 2-3-3 .5-3 4L6 17l3-5z"/>
        <path d="M16.5 14l-1 3.5L17 19h2l-1-5z"/>
        {/* Bar */}
        <line x1="3" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/>
        {/* Poles */}
        <line x1="3" y1="7" x2="3" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="21" y1="7" x2="21" y2="22" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }

  // Kho Kho
  if (sportLower.includes('kho kho')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        {/* Running chaser */}
        <circle cx="7" cy="4" r="2"/>
        <path d="M10 8L7.5 9 6 11l-3-.5.5-2 2-1.5h2l2.5 1zM4 12l-1 4.5L4.5 18l2-4z"/>
        <path d="M7 12l2 4.5h2L9 12z"/>
        {/* Sitting player */}
        <circle cx="17" cy="4" r="2"/>
        <path d="M15 8h4l1 3h-2v3h-2v-3h-2l1-3z"/>
        <rect x="14.5" y="14" width="5" height="2" rx="0.5"/>
        {/* Ground line */}
        <line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5"/>
        {/* Center poles */}
        <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="15.5" r="0.8"/>
      </svg>
    );
  }

  // Fitness / Gym / Weight / Strength Training / Cardio
  if (sportLower.includes('weight') || sportLower.includes('fitness') || sportLower.includes('gym') || sportLower.includes('cardio') || sportLower.includes('yoga') || sportLower.includes('aerobics') || sportLower.includes('crossfit') || sportLower.includes('strength')) {
    return <Dumbbell className={className} />;
  }

  // Group Classes
  if (sportLower.includes('group')) {
    return <Users className={className} />;
  }

  // Training / Personal
  if (sportLower.includes('training') || sportLower.includes('personal')) {
    return <Award className={className} />;
  }

  // Default icon
  return <Trophy className={className} />;
}
