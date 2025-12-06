const reviewCtrl = require("../controller/review");
const database = require("../data/database");

jest.mock("../data/database");

describe("Test GetAll review controller", () => {
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
            { _id: "1", rating: 5 },
            { _id: "1", rating: 4 },
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