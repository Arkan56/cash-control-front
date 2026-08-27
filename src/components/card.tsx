import type { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  actionText?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

function Card({
  title,
  subtitle,
  actionText = "Ver detalles",
  icon,
  onClick,
}: CardProps) {
  return (
    <button
      onClick={onClick}
      className="
        group
        w-full
        min-h-44
        bg-white
        border
        border-gray-200
        rounded-xl
        p-6
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:border-blue-300
        hover:shadow-md
        hover:-translate-y-1
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
      "
    >
      <div className="flex flex-col justify-between h-full">
        {icon && (
          <div
            className="
            w-11
            h-11
            flex
            items-center
            justify-center
            bg-blue-50
            text-blue-600
            rounded-lg
            text-xl
          "
          >
            {icon}
          </div>
        )}

        <div className={icon ? "mt-6" : ""}>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div
          className="
          flex
          items-center
          justify-between
          mt-6
          text-sm
          font-medium
          text-blue-600
        "
        >
          <span>{actionText}</span>

          <span
            className="
            transition-transform
            duration-200
            group-hover:translate-x-1
          "
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}

export default Card;
