import { PropsWithChildren, ElementType, ComponentPropsWithoutRef, forwardRef, ComponentPropsWithRef } from "react";

type Rainbow = "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "violet";

type AsProp<C extends ElementType> = {
  as?: C;
};

type TextProps = {
  color?: Rainbow | string;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponent<C extends ElementType, Props = {}> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type Props<C extends ElementType, P> = PolymorphicComponent<C, P>;

type PolimosphicComponentPropsWithRef<C extends ElementType, P> = PolymorphicComponent<C, P> & {
  ref?: PolimosphicRef<C>;
};

type PolimosphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

type TextComponent = <C extends ElementType>(props: PolimosphicComponentPropsWithRef<C, TextProps>) => React.ReactElement | null;

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
