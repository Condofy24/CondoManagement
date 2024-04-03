"use client";
import { useAppSelector } from "@/redux/store";
import ClaimUnitForm from "../../(owner)/properties/claim-owner-form";
import { useEffect, useState } from "react";
import { fetchAssociatedProperties } from "@/actions/resident-actions";
import toast from "react-hot-toast";
import { Unit } from "@/types";
import LoadingSpinner from "@/app/components/loading-spinner";
import OwnerProperty from "../../(owner)/properties/owner-property/owner-property";
import UnitSection from "../../(owner)/properties/owner-property/unit-section";
import RenterDashboard from "./renter-dashboard";


export default function RenterUnitPage() {
    const { user, token } = useAppSelector((state) => state.auth.value);
    const [properties, setProperties] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
        setIsLoading(true);
        try {
            const properties = await fetchAssociatedProperties(
            user.id as string,
            token as string,
            );

            setProperties(properties);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
        }
        fetchProperties();
    }, [token, user?.id]);


    return (
            <div className="flex flex-1 flex-col p-4 space-y-8 md:p-10">
        <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
            <p className="text-muted-foreground">
            Here is your rented unit!
            </p>
        </div>
        </div>
        <div >
        {isLoading && <LoadingSpinner />}

        {!isLoading && properties.length === 0 ? (
            <h1>No unit found</h1>
        ) : (
            
            properties.map((property) => {
            return <RenterDashboard 
            key={property.id} 
            property={property}
            parkings={property.parkings}
            storages={property.storages}
             />;
            })
        )}
        </div>
    </div>
    )
}