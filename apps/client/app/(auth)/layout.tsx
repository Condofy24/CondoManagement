import condo from "@/public/Condo.jpeg";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex relative">
      <div className="w-3/5 h-[calc(100vh_-_3rem)] object-fill overflow-hidden relative top-12">
        <Image
          src={condo}
          alt="image of a condo"
          priority={true}
          quality={95}
          layout="fill"
        />
      </div>
      <div className="w-2/5">{children}</div>
    </div>
  );
}
