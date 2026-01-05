interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md', hover = false, onClick = () => {return; } }) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-xl shadow-md ${paddings[padding]} ${className} hover:${hover}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;