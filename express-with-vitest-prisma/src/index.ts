import express, { Request } from "express";
import { prismaClient } from "./db";
import { z } from "zod";

export const app = express();
app.use(express.json());

const sumInput = z.object({
    a: z.number(),
    b: z.number()
})

app.post("/sum", async (req: Request, res: any) => {
    const parsedResponse = sumInput.safeParse(req.body)
    
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    await prismaClient.sum.create({
        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            result: parsedResponse.data.a + parsedResponse.data.b,
        }
    })

    res.json({
        answer: parsedResponse.data.a + parsedResponse.data.b
    })
});

app.get("/sum", (req: Request, res: any) => {
    const parsedResponse = sumInput.safeParse({
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