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
type TextComponent = <C extends ElementType>(
  props: PolymorphicComponentPropsWithRef<C, TextProps>
) => React.ReactElement | null;

// Define the component
export default forwardRef(function Text<C extends ElementType = "span">(
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
}) as TextComponent;
