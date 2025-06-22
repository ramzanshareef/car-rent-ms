import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import car from "../models/Car.model";

// Core filter builder
function buildFilters(query: any): Record<string, any> {
    const filter: any = {};

    ["model"].forEach(key => {
        if (query[key]) {
            filter[key] = { $regex: query[key], $options: "i" };
        }
    });

    ["category", "status", "gearBoxType", "fuelType"].forEach(key => {
        if (query[key]) {
            filter[key] = query[key].toUpperCase();
        }
    });

    if (query.minPrice || query.maxPrice) {
        filter.pricePerDay = {
            ...(query.minPrice && { $gte: Number(query.minPrice) }),
            ...(query.maxPrice && { $lte: Number(query.maxPrice) }),
        };
    }

    if (query.locationId) {
        try {
            filter.location = new ObjectId(query.locationId);
        } catch {
            filter.location = query.locationId;
        }
    }

    const rating = parseFloat(query.minRating);
    if (!isNaN(rating)) filter.carRating = { $gte: rating };

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    if (query.startDate && query.endDate && !filter.status && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        filter.status = "AVAILABLE";
    }

    return filter;
}

// MongoDB aggregation
function buildPipeline(filter: any, sortBy?: string, sortOrder?: string) {
    return [
        { $match: filter },
        {
            $project: {
                carId: { $toString: "$_id" },
                model: 1,
                category: 1,
                pricePerDay: { $toString: "$pricePerDay" },
                status: 1,
                gearBoxType: 1,
                fuelType: 1,
                imageUrl: { $arrayElemAt: ["$images", 0] },
                images: 1,
                engineCapacity: 1,
                fuelConsumption: 1,
                passengerCapacity: 1,
                climateControl: 1,
                carRating: { $toString: "$carRating" },
                serviceRating: { $toString: "$serviceRating" },
                location: { $toString: "$location" },
            },
        },
        { $sort: { [sortBy || "pricePerDay"]: sortOrder === "desc" ? -1 : 1 } },
    ];
}

async function fetchLocationName(locationId: string): Promise<string> {
    try {
        const response = await fetch(
            `https://home-service-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/home/locations/${locationId}`
        );
        const json = await response.json();
        return json.content?.locationName || "Unknown Location";
    } catch {
        return "Unknown Location";
    }
}

// Controller
export const getCars = async (req: Request, res: Response) => {
    try {
        const { query } = req;
        const filter = buildFilters(query);
        const pipeline = buildPipeline(filter, query.sortBy as string, query.sortOrder as string);

        const allCars = await car.aggregate(pipeline);
        const page = parseInt(query.page as string) || 1;
        const size = parseInt(query.size as string) || 10;

        const paginatedCars = allCars.slice((page - 1) * size, page * size);

        // Resolve location names
        for (const c of paginatedCars) {
            c.location = await fetchLocationName(c.location);
        }

        res.status(200).json({
            content: paginatedCars,
            currentPage: page,
            totalElements: allCars.length,
            totalPages: Math.ceil(allCars.length / size),
        });
    } catch (error: any) {
        console.error("Error fetching cars:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching cars",
            error: error.message,
        });
    }
};