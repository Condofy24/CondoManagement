"use client";
import BuildingView from "@/public/home/buildingView.jpg";
import Buildings from "@/public/home/buildings.jpg";
import UnitView from "@/public/home/unitView.jpg";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import * as React from "react";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "./components/page-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";

export default function Home() {
  const user = useAppSelector((state) => state.auth.value.user);

  return (
    <main className="relative">
      <PageHeader>
        <PageHeaderHeading className="hidden md:block">
          Welcome to Condofy {user?.name}
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">Condofy</PageHeaderHeading>
        <PageHeaderDescription>
          At Condofy, we understand that managing a condominium involves a
          delicate balance between ensuring resident satisfaction and
          maintaining operational efficiency. That's why we've created a
          comprehensive platform designed to simplify every aspect of condo
          management, transforming challenges into opportunities for community
          enhancement and seamless administration.
        </PageHeaderDescription>
      </PageHeader>
      <section className="px-4">
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
          <Carousel>
            <CarouselContent className="px-3 py-3">
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex flex-col justify-center">
                <Image src={UnitView} alt="condo unit" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex flex-col justify-center">
                <Image src={Buildings} alt="condo unit" objectFit="cover" />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex flex-col justify-center">
                <Image src={BuildingView} alt="condo unit" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </main>
  );
}
