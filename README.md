# Boring Polymorphic Component Example

```ts
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
type PolimosphicComponentPropsWithRef<C extends ElementType, P> = PolymorphicComponent<C, P> & {
  ref?: PolimosphicRef<C>;
};

// Define a type that will be used to create the props
// that will be passed to the component
type PolimosphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

// Define a type that will be used to create the component
type TextComponent = <C extends ElementType>(props: PolimosphicComponentPropsWithRef<C, TextProps>) => React.ReactElement | null;

// Define the component
export const Text: TextComponent = forwardRef(function Text<C extends ElementType = "span">(
  { as, color, style, children, ...rest }: Props<C, TextProps>,
  ref: PolimosphicRef<C>
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

```ts
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
