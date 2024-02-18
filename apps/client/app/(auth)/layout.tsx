import condo from "@/public/Condo.jpeg";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100vh_-_3.75rem)] relative bg-gray-50 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90">
      <div className="w-3/5 object-fill overflow-hidden relative hidden lg:block">
        <Image
          src={condo}
          alt="image of a condo"
          priority={true}
          quality={95}
          objectFit="cover"
          layout="fill"
        />
      </div>
      <div className="md:w-2/5 flex-grow">{children}</div>
    </div>
  );
}
