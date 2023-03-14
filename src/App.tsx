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
