const reviewCtrl = require("../controller/review");
const database = require("../data/database");
// const { MongoClient } = require("@shelf/jest-mongodb");

jest.mock("../data/database");

describe("Test GetAll on Review controller", () => {
    let req, res;

    beforeEach(() => {
        req = {} // request no needed

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            setHeader: jest.fn().mockReturnThis()
        }
    });

    test("Should return 200 and the list of reviews", async () =>{
        const mockReviews = [
            {
                _id: { $oid: "692afabc7419d225ee1d8129" },
                userId: "6928d33c83769d9feee1b641",
                destnationId: "6928d33c83769d9feee1b641",
                rating: 5,
                reviewText:
                    "I feel like I have a million things I want to share about the trip so far...",
                visitDate: "2024-08-01",
                reviewDate: "2024-09-01"
            },
            {
                _id: { $oid: "692b16e27419d225ee1d812b" },
                userId: "6928de988f566ad9022fd39e",
                destnationId: "692990faf5c3d322dc296d46",
                rating: 4,
                reviewText:
                    "There are things to do – if you have money-. Which alas, I definitely did not...",
                visitDate: "2025-07-14",
                reviewDate: "2025-08-01"
            }
        ]
        
        database.getDatabase.mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn().mockReturnValue({
                        toArray: jest.fn().mockResolvedValue(mockReviews)
                    })
                })
            })
        });

        await reviewCtrl.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockReviews);
    });

    test("Should return 500 when error returns", async () =>{

        database.getDatabase.mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn().mockReturnValue({
                        toArray: jest.fn().mockRejectedValue(new Error("DB Error"))
                    })
                })
            })
        });

        await reviewCtrl.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "DB Error"});
    });
});