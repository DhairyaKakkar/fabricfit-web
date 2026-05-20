'use client';

interface Props {
  children: React.ReactNode;
  id?: string;
  background?: string;
}

export default function FeatureSlide({ children, id, background = '#fafaf7' }: Props) {
  return (
    <section
      id={id}
      className="snap-start relative w-full overflow-hidden flex items-center"
      style={{ height: '100vh', background }}
    >
      {children}
    </section>
  );
}
