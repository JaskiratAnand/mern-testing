import express, { Request } from "express";
import { prismaClient } from "./db";
import { z } from "zod";

export const app = express();
app.use(express.json());

const calculateInput = z.object({
    a: z.number(),
    b: z.number()
})

app.post("/calculate", async (req: Request, res: any) => {
    const parsedResponse = calculateInput.safeParse(req.body)

    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const response = await prismaClient.calculate.create({
        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            result: parsedResponse.data.a + parsedResponse.data.b,
            type: "SUM"
        }
    });


    res.json({
        answer: parsedResponse.data.a + parsedResponse.data.b,
        id: response.id
    })
});

app.get("/calculate", (req: Request, res: any) => {
    const parsedResponse = calculateInput.safeParse({
        a: Number(req.headers["a"]),
        b: Number(req.headers["b"])
    })

    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    res.json({
        answer: parsedResponse.data.a + parsedResponse.data.b
    })
});