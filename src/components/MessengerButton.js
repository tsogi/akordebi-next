const MESSENGER_URL = 'https://m.me/61587416465705';

const MessengerIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.444 5.544 3.7 7.257v3.5l3.258-1.787c.916.252 1.885.387 2.892.387h.15c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.076 12.429l-2.54-2.712-4.96 2.712 5.456-5.79 2.602 2.712 4.897-2.712-5.455 5.79z"/>
  </svg>
);

const sizeStyles = {
  sm: {
    button: 'py-1 px-3 text-sm rounded-lg gap-1',
    icon: 'h-4 w-4',
  },
  md: {
    button: 'py-2 px-5 text-base rounded-lg gap-2',
    icon: 'h-5 w-5',
  },
  lg: {
    button: 'py-3 px-8 text-lg rounded-xl gap-2',
    icon: 'h-6 w-6',
  },
};

export default function MessengerButton({ 
  text = 'მოგვწერე',
  size = 'md',
  className = '',
  inline = false,
}) {
  const styles = sizeStyles[size] || sizeStyles.md;
  
  return (
    <a 
      href={MESSENGER_URL} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`
        ${inline ? 'inline-flex' : 'flex'} 
        items-center 
        bg-[#0084FF] hover:bg-[#0073E6] 
        text-white font-medium 
        transition-colors 
        ${styles.button}
        ${className}
      `}
    >
      <MessengerIcon className={styles.icon} />
      {text}
    </a>
  );
}

export { MESSENGER_URL, MessengerIcon };
