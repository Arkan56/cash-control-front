type CardProps = {
  title: string;
  subtitle?: string;
  onClick?: () => void;
};

function Card({ title, subtitle, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center bg-white rounded-2xl shadow-lg p-4 h-40 hover:scale-105 transition"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default Card;
