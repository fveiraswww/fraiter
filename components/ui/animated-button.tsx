'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  ring-offset-slate-950  focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default: 'border dark:border-grey-border hover:bg-grey-hover',
        destructive: 'bg-red-900  text-slate-50  hover:bg-red-900/90',
        outline: 'text-black border hover:bg-gray-100',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-100/80  bg-slate-800  text-slate-50  hover:bg-slate-800/80',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900  hover:bg-slate-800  hover:text-slate-50',
        link: 'text-slate-900 underline-offset-4 hover:underline  text-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  gradient_blur?: boolean;
  asChild?: boolean;
  containerClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      gradient_blur = false,
      variant,
      size,
      asChild = false,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const [inputPosition, setInputPosition] = React.useState({ x: 0, y: 0 });

    const buttonRef: React.RefObject<HTMLButtonElement | null> =
      React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        const { clientX, clientY } = event;

        const buttonElement = buttonRef.current;

        if (buttonElement) {
          const { left, top } =
            buttonElement.getBoundingClientRect() as DOMRect;

          setInputPosition({ x: clientX - left, y: clientY - top });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

    return (
      <div className={cn('relative', containerClassName)}>
        <Comp
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }), 'z-100')}
          {...props}
        />
        {gradient_blur ? (
          <button
            ref={buttonRef}
            className={cn(
              'placeholder:text-dark-faint text-dark-bright !border-dark-control-base opacity pointer-events-none absolute left-0 top-0 z-10 h-full w-full cursor-default rounded-md border-2 border-grey-border !bg-[transparent] transition-colors placeholder:select-none focus:outline-none xl:text-sm',
              className
            )}
            style={{
              opacity: '1',
              maskImage: `radial-gradient(30% 30px at ${inputPosition.x}px ${inputPosition.y}px, black 45%,transparent)`,
              WebkitMaskImage: `radial-gradient(30% 30px at ${inputPosition.x}px ${inputPosition.y}px, black 45%, transparent)`,
              borderColor: 'rgb(var(--brand))',
            }}
            type="button"
          />
        ) : null}
      </div>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
