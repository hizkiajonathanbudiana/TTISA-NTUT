import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
};

export const CmsActionButton = ({ variant = 'primary', children, ...props }: ButtonProps) => {
    const baseClasses = "px-3 py-1 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 w-full md:w-auto";

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-secondary text-white hover:bg-secondary-hover',
        danger: 'bg-system-danger text-white hover:bg-red-700',
    };

    return (
        <button className={clsx(baseClasses, variantClasses[variant])} {...props}>
            {children}
        </button>
    );
};