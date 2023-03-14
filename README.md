#### Resources
- <https://beta.reactjs.org/reference/react/forwardRef>
- <https://www.freecodecamp.org/news/build-strongly-typed-polymorphic-components-with-react-and-typescript/#:~:text=In%20the%20world%20of%20React,already%20used%20a%20Polymorphic%20component.>(in the world of React components, a polymorphic component is a component that can be rendered with a different container element / node.)

# Boring Polymorphic Component Example

```tsx
import { PropsWithChildren, ElementType, ComponentPropsWithoutRef, forwardRef, ComponentPropsWithRef } from "react";

// Define a type that will be used to create a rainbow of colors
type Rainbow = "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "violet";

// Define a type that will be used to create a prop
// that will be used to define the type of element
// to be rendered to the DOM
type AsProp<C extends ElementType> = {
  as?: C;
};

// Define a type that will be used to create
// the props that will be passed to the component
type TextProps = {
  color?: Rainbow | string;
};

// Define a type that will be used to create a type that
// will be used to omit the props from the component
// that are used to create the type of element to be rendered
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

// Define a type that will be used to create the props
// that will be passed to the component
type PolymorphicComponent<C extends ElementType, Props = {}> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// Define a type that will be used to create the props
// that will be passed to the component
type Props<C extends ElementType, P> = PolymorphicComponent<C, P>;

// Define a type that will be used to create the props
// that will be passed to the component
type PolymorphicComponentPropsWithRef<C extends ElementType, P> = PolymorphicComponent<C, P> & {
  ref?: PolymorphicRef<C>;
};

// Define a type that will be used to create the props
// that will be passed to the component
type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

// Define a type that will be used to create the component
type TextComponent = <C extends ElementType>(props: PolymorphicComponentPropsWithRef<C, TextProps>) => React.ReactElement | null;

// Define the component
export const Text: TextComponent = forwardRef(function Text<C extends ElementType = "span">(
  { as, color, style, children, ...rest }: Props<C, TextProps>,
  ref: PolymorphicRef<C>
): JSX.Element {
  const Component = as || "span";
  const internalStyles = color ? { style: { ...style, color } } : {};

  return (
    <Component ref={ref} {...rest} {...internalStyles}>
      {children}
    </Component>
  );
});

```

```tsx
import { useRef } from "react";
import { Text } from "./components/Text";

function Emphasis({ children }: { children: React.ReactNode }) {
  return <em style={{ background: "yellow", color: "black", fontSize: "40px" }}>{children}</em>;
}

export default function App() {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const ref2 = useRef<HTMLHeadingElement | null>(null);

  return (
    <div>
      <Text as="h1" ref={ref2} color="red">
        Hello
      </Text>
      // Error
      <Text as="h1" ref={ref} color="red">
        Hello
      </Text>
      <Text as="a" href="google.com">
        google.com
      </Text>
      <Text as={Emphasis}>Hi</Text>
    </div>
  );
}

```

## Boring forwardRef Component Example

```tsx
import { ComponentProps, forwardRef } from "react";

// Define the props that are specific to this component
type ButtonProps = {
  leading?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

// The forwardRef function allows you to pass a ref to the component
export default forwardRef<HTMLButtonElement, ComponentProps<'button'> & ButtonProps>(function Button(
  { leading, onClick, children, className, ...rest }: ButtonProps,
  ref
) {
  return (
    // The ...rest is the spread operator. It allows you to pass all other props to the button element.
    <button
      ref={ref}
      onClick={onClick}
      className={`inline-flex items-center rounded bg-purple-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-500 active:bg-purple-500/90 ${className}`}
      {...rest}
    >
      {leading && <span className="mr-0.5 -ml-0.5 h-5 w-5">{leading}</span>}
      <span>{children}</span>
    </button>
  );
});
```

```tsx
import { PlusIcon } from "@heroicons/react/20/solid";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import * as Popover from "@radix-ui/react-popover";
import Button from "./button";

export default function Index() {
  return (
    <div className="antialiased; flex h-screen flex-col items-start justify-start bg-gray-900 text-gray-200">
      <header className="flex h-20 w-full border-b border-white/10 bg-gray-800 px-4 text-sm font-medium text-gray-200">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="#" className="text-xl">
              <BuildingOfficeIcon className="h-6 w-6" />
            </a>
            <a href="#">Invoices</a>
          </div>
          <div className="flex items-center">
            <Popover.Root>
              <Popover.Trigger asChild className="data-[state=open]:opacity-50">
                  {/* Pass props to the Button component */}
                <Button leading={<PlusIcon />}>New Invoice</Button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  sideOffset={8}
                  side="bottom"
                  align="end"
                  className="flex w-[360px] flex-col overflow-hidden rounded-md bg-gray-900 shadow-xl"
                >
                  <div className="flex items-center justify-between py-3 px-5 text-white">
                    <div className="flex items-center">
                      <BanknotesIcon className="mr-3 h-6 w-6 opacity-50" />
                      <p className="text-lg font-semibold">New invoice</p>
                    </div>
                    <Popover.Close className="PopoverClose">
                      <XMarkIcon className="h-6 w-6 opacity-25" />
                    </Popover.Close>
                  </div>
                  <div className="bg-gray-800 py-5 px-5">
                    <p className="text-gray-500">Create a new invoice...</p>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 items-center justify-center bg-gray-800/5">
        <BuildingOfficeIcon className="h-40 w-40 text-white/[.02]" />
      </main>
    </div>
  );
}

```
